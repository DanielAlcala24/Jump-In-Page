import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import QRCode from 'qrcode'
import Stripe from 'stripe'
import { getTransporter, getFromAddress } from '@/lib/mail'

// Supabase admin client (bypasses RLS — only used server-side in webhook)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mapea el tipo de tarjeta de Stripe al formato en español requerido.
// Las prepagadas (prepaid) se tratan como débito.
function mapFormaPago(funding?: string | null): string {
  switch (funding) {
    case 'credit':
      return 'credito'
    case 'debit':
    case 'prepaid':
      return 'debito'
    default:
      return funding ?? 'desconocido'
  }
}

// Envía el correo de confirmación con el QR del Id_Ticket (inline + adjunto descargable).
async function enviarCorreoConfirmacion(opts: {
  to: string
  idTicket: string
  branchName: string
  visitDate: string | null
  total: number
  currency: string
}) {
  const transporter = getTransporter()
  if (!transporter || !opts.to) {
    console.warn('SMTP no configurado o sin destinatario — se omite el correo de confirmación')
    return
  }

  // QR con el Id_Ticket como contenido.
  const qrBuffer = await QRCode.toBuffer(opts.idTicket, { width: 320, margin: 2 })

  const totalFmt = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: (opts.currency || 'mxn').toUpperCase(),
  }).format(opts.total)

  const fechaHtml = opts.visitDate
    ? `<p style="margin:4px 0;color:#374151;"><strong>Fecha de visita:</strong> ${opts.visitDate}</p>`
    : ''

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
    <h1 style="color:#f97316;font-size:24px;margin-bottom:8px;">¡Gracias por tu compra en Jump-In!</h1>
    <p style="color:#374151;">Tu pago fue procesado correctamente. Presenta este código QR al llegar a la sucursal.</p>
    <div style="text-align:center;margin:24px 0;">
      <img src="cid:qrticket" alt="Código QR de tu ticket" width="240" height="240" style="border:1px solid #e5e7eb;border-radius:12px;padding:8px;background:#fff;" />
    </div>
    <div style="background:#f9fafb;border-radius:12px;padding:16px;">
      <p style="margin:4px 0;color:#374151;"><strong>No. de ticket:</strong> ${opts.idTicket}</p>
      ${opts.branchName ? `<p style="margin:4px 0;color:#374151;"><strong>Sucursal:</strong> ${opts.branchName}</p>` : ''}
      ${fechaHtml}
      <p style="margin:4px 0;color:#374151;"><strong>Total:</strong> ${totalFmt}</p>
    </div>
    <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Si tienes dudas, contáctanos por WhatsApp. ¡Te esperamos! 🧡</p>
  </div>`

  await transporter.sendMail({
    from: getFromAddress(),
    to: opts.to,
    subject: `Tu ticket Jump-In · ${opts.idTicket}`,
    html,
    attachments: [
      // Inline: se muestra dentro del correo.
      { filename: 'qr-ticket.png', content: qrBuffer, cid: 'qrticket' },
      // Adjunto descargable independiente.
      { filename: `ticket-${opts.idTicket}.png`, content: qrBuffer },
    ],
  })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const meta = session.metadata ?? {}
    const email = session.customer_details?.email ?? session.customer_email ?? ''

    // --- Idempotencia: Stripe reintenta los webhooks. No procesar dos veces. ---
    const { data: existing } = await supabaseAdmin
      .from('shop_orders')
      .select('id_ticket')
      .eq('stripe_session_id', session.id)
      .maybeSingle()

    if (existing?.id_ticket) {
      return NextResponse.json({ received: true, alreadyProcessed: true })
    }

    // --- Line items con el producto expandido (para leer metadata Id_Articulo) ---
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
      limit: 100,
    })

    const items = lineItems.data.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      amount_total: item.amount_total,
    }))

    // --- Datos de la tarjeta (últimos 4 dígitos y crédito/débito) ---
    let last4: string | null = null
    let funding: string | null = null
    if (session.payment_intent) {
      const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string, {
        expand: ['latest_charge'],
      })
      const charge = pi.latest_charge as Stripe.Charge | null
      const card = charge?.payment_method_details?.card
      last4 = card?.last4 ?? null
      funding = card?.funding ?? null
    }

    // --- Id_Terminal de la sucursal desde Supabase ---
    let idTerminal: string | null = null
    if (meta.branch_id) {
      const { data: branch } = await supabaseAdmin
        .from('branches')
        .select('Id_Terminal')
        .eq('id', meta.branch_id)
        .maybeSingle()
      idTerminal = (branch as any)?.Id_Terminal ?? null
    }

    // --- Genera el Id_Ticket (GUID) ---
    const idTicket = randomUUID()

    // --- Arma el payload del webhook de venta ---
    const articulos = lineItems.data.map((item) => {
      const product = item.price?.product as Stripe.Product | undefined
      return {
        Id_Articulo: product?.metadata?.Id_Articulo ?? null,
        Cantidad: item.quantity ?? 0,
        Total: (item.amount_total ?? 0) / 100,
      }
    })

    const ventaPayload = {
      // Llave que DECManager usa para autenticar la venta. Va dentro del JSON,
      // no en los headers.
      API_Key: process.env.VENTA_WEBHOOK_API_KEY ?? null,
      Id_Ticket: idTicket,
      Id_Terminal: idTerminal,
      Total: (session.amount_total ?? 0) / 100,
      Articulos: articulos,
      Fecha_Visita: meta.visit_date || null, // ya viene en formato YYYY-MM-DD
      Forma_Pago: mapFormaPago(funding),
      Detalle_Pago: last4,
    }

    // --- Guarda la orden ANTES de enviar el webhook (marca idempotencia con id_ticket) ---
    await supabaseAdmin.from('shop_orders').upsert(
      {
        stripe_session_id: session.id,
        id_ticket: idTicket,
        branch_id: meta.branch_id || null,
        branch_name: meta.branch_name || '',
        customer_email: email,
        visit_date: meta.visit_date || null,
        items,
        amount_total: session.amount_total,
        currency: session.currency,
        status: 'completed',
      },
      { onConflict: 'stripe_session_id' }
    )

    // --- Envía el webhook de venta en línea ---
    const ventaWebhookUrl = process.env.VENTA_WEBHOOK_URL
    if (ventaWebhookUrl) {
      try {
        // DECManager espera el JSON de la venta como una CADENA (string literal),
        // no como un objeto JSON. Su backend deserializa el body como string y
        // luego hace el parse interno. Por eso se serializa dos veces.
        const res = await fetch(ventaWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.VENTA_WEBHOOK_TOKEN
              ? { Authorization: `Bearer ${process.env.VENTA_WEBHOOK_TOKEN}` }
              : {}),
          },
          body: JSON.stringify(JSON.stringify(ventaPayload)),
        })

        // fetch NO lanza en respuestas 4xx/5xx: hay que revisar el status a mano,
        // si no los rechazos de DECManager pasan inadvertidos.
        if (!res.ok) {
          const respBody = await res.text().catch(() => '')
          console.error(
            `Webhook de venta rechazado por DECManager (HTTP ${res.status}): ${respBody} — payload:`,
            JSON.stringify(ventaPayload)
          )
        } else {
          console.log(`Webhook de venta enviado a DECManager OK (HTTP ${res.status}) — Id_Ticket ${idTicket}`)
        }
      } catch (err) {
        // No fallar el webhook de Stripe si el sistema externo no responde.
        console.error('Error enviando webhook de venta:', err)
      }
    } else {
      console.warn('VENTA_WEBHOOK_URL no configurada — payload de venta:', JSON.stringify(ventaPayload))
    }

    // --- Envía el correo de confirmación con el QR ---
    try {
      await enviarCorreoConfirmacion({
        to: email,
        idTicket,
        branchName: meta.branch_name || '',
        visitDate: meta.visit_date || null,
        total: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? 'mxn',
      })
    } catch (err) {
      // No fallar el webhook de Stripe si el correo no se pudo enviar.
      console.error('Error enviando correo de confirmación:', err)
    }
  }

  return NextResponse.json({ received: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import QRCode from 'qrcode'
import Stripe from 'stripe'
import { getTransporter, getFromAddress } from '@/lib/mail'
import { buildQrContent } from '@/lib/ticket'

// Registro anticipado de la responsiva (sistema externo Databiz). Se muestra
// también en /shop/success; si cambia la URL hay que actualizarla en ambos lados.
const WAIVER_URL = 'https://databiz.mx:300/Jump-in_Waiver/registroResponsable.aspx'

// Logo del encabezado del correo. Se sirve desde el bucket `media` de Supabase.
// Se usa PNG y no WebP porque Outlook de escritorio (motor de Word) no renderiza
// WebP y el logo saldría roto.
const LOGO_URL =
  'https://pcxunmtwgfechivixjkc.supabase.co/storage/v1/object/public/media/logojumpin.png'

// Supabase admin client (bypasses RLS — only used server-side in webhook)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// DECManager SOLO acepta 'credito' o 'debito' en Forma_Pago: cualquier otro valor
// (p. ej. 'desconocido') hace que rechace la venta completa con HTTP 400 y la compra
// se pierde. Cuando Stripe no reporta el tipo de tarjeta se manda este valor por
// defecto para que la venta sí quede registrada.
const FORMA_PAGO_DEFAULT = 'credito'

// Mapea el tipo de tarjeta de Stripe al formato en español requerido.
// Las prepagadas (prepaid) se tratan como débito.
function mapFormaPago(funding?: string | null): string {
  switch (funding) {
    case 'credit':
      return 'credito'
    case 'debit':
    case 'prepaid':
      return 'debito'
    // 'unknown', null o cualquier método que no sea tarjeta.
    default:
      return FORMA_PAGO_DEFAULT
  }
}

/**
 * Obtiene tipo de tarjeta (funding) y últimos 4 dígitos de una sesión de Checkout.
 *
 * Se intenta por varias vías porque no todos los pagos exponen los datos en el mismo
 * lugar (wallets, Link, expansiones que vuelven sin expandir). Nunca lanza: si no se
 * puede resolver, devuelve nulos y deja el motivo en el log para diagnosticarlo.
 */
async function resolverDatosTarjeta(
  session: Stripe.Checkout.Session
): Promise<{ funding: string | null; last4: string | null; diagnostico: string }> {
  const piId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id

  if (!piId) return { funding: null, last4: null, diagnostico: 'la sesión no tiene payment_intent' }

  try {
    const pi = await stripe.paymentIntents.retrieve(piId, {
      expand: ['latest_charge.payment_method', 'payment_method'],
    })

    // latest_charge puede llegar como objeto (expandido) o como id (string).
    let charge: Stripe.Charge | null = null
    if (pi.latest_charge && typeof pi.latest_charge === 'object') {
      charge = pi.latest_charge as Stripe.Charge
    } else if (typeof pi.latest_charge === 'string') {
      charge = await stripe.charges.retrieve(pi.latest_charge)
    }

    // 1) Datos desde el cargo. Apple Pay / Google Pay / Link con tarjeta cuelgan de .card.
    const details = charge?.payment_method_details as any
    const card = details?.card ?? details?.card_present ?? details?.link?.card

    // 2) Respaldo: el PaymentMethod (expandido en el cargo o en el PaymentIntent).
    const pm =
      (charge?.payment_method && typeof charge.payment_method === 'object'
        ? (charge.payment_method as any)
        : null) ??
      (pi.payment_method && typeof pi.payment_method === 'object' ? (pi.payment_method as any) : null)

    const funding = card?.funding ?? pm?.card?.funding ?? null
    const last4 = card?.last4 ?? pm?.card?.last4 ?? null

    return {
      funding,
      last4,
      diagnostico: `pi=${pi.id} pi_status=${pi.status} charge=${charge?.id ?? 'ninguno'} metodo=${details?.type ?? pm?.type ?? 'desconocido'}`,
    }
  } catch (err) {
    // Un fallo aquí no debe tirar el webhook: la venta y el correo importan más.
    return { funding: null, last4: null, diagnostico: `error consultando Stripe: ${err}` }
  }
}

// Escapa el texto que se interpola en el HTML del correo (nombres de producto).
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Envía el correo de confirmación con el QR del Id_Ticket (inline + adjunto descargable).
async function enviarCorreoConfirmacion(opts: {
  to: string
  idTicket: string
  branchName: string
  visitDate: string | null
  total: number
  currency: string
  items: { description: string | null; quantity: number | null; amount_total: number | null }[]
}) {
  const transporter = getTransporter()
  if (!transporter || !opts.to) {
    console.warn('SMTP no configurado o sin destinatario — se omite el correo de confirmación')
    return
  }

  // QR con el prefijo + el Id_Ticket como contenido ("07/<guid>").
  const qrBuffer = await QRCode.toBuffer(buildQrContent(opts.idTicket), { width: 320, margin: 2 })

  // Logo inline: se descarga y se adjunta como CID para que no dependa de que el
  // cliente de correo permita imágenes remotas. Si falla, se cae a la URL remota.
  let logoBuffer: Buffer | null = null
  try {
    const logoRes = await fetch(LOGO_URL)
    if (logoRes.ok) logoBuffer = Buffer.from(await logoRes.arrayBuffer())
  } catch {
    /* se usa la URL remota como respaldo */
  }
  const logoSrc = logoBuffer ? 'cid:jumpinlogo' : LOGO_URL

  const money = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: (opts.currency || 'mxn').toUpperCase(),
  })
  const totalFmt = money.format(opts.total)

  // Detalle de los productos comprados (amount_total viene en centavos).
  const itemsHtml = opts.items.length
    ? `
    <table style="width:100%;border-collapse:collapse;margin:24px 0;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 0;border-bottom:2px solid #f97316;color:#111827;font-size:13px;">Producto</th>
          <th style="text-align:center;padding:8px 0;border-bottom:2px solid #f97316;color:#111827;font-size:13px;">Cant.</th>
          <th style="text-align:right;padding:8px 0;border-bottom:2px solid #f97316;color:#111827;font-size:13px;">Importe</th>
        </tr>
      </thead>
      <tbody>
        ${opts.items
          .map(
            (it) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;">${escapeHtml(it.description ?? 'Producto')}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;text-align:center;">${it.quantity ?? 1}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;text-align:right;">${money.format((it.amount_total ?? 0) / 100)}</td>
        </tr>`
          )
          .join('')}
        <tr>
          <td colspan="2" style="padding:10px 0;color:#111827;font-size:14px;font-weight:bold;">Total</td>
          <td style="padding:10px 0;color:#f97316;font-size:16px;font-weight:bold;text-align:right;">${totalFmt}</td>
        </tr>
      </tbody>
    </table>`
    : ''

  const fechaHtml = opts.visitDate
    ? `<p style="margin:4px 0;color:#374151;"><strong>Fecha de visita:</strong> ${opts.visitDate}</p>`
    : ''

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <img src="${logoSrc}" alt="Jump-In" width="240" style="max-width:100%;height:auto;border:0;display:inline-block;" />
    </div>
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
    ${itemsHtml}
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:20px;text-align:center;margin-top:24px;">
      <h2 style="color:#111827;font-size:18px;margin:0 0 6px;">Agiliza tu acceso registrando tu visita</h2>
      <p style="color:#4b5563;font-size:14px;margin:0 0 16px;">Llena tu responsiva en línea y evita filas al llegar a la sucursal.</p>
      <a href="${WAIVER_URL}" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:12px 24px;border-radius:9999px;">Registro digital</a>
      <p style="color:#9ca3af;font-size:11px;margin:14px 0 0;word-break:break-all;">Si el botón no funciona, copia esta liga:<br />${WAIVER_URL}</p>
    </div>
    <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Si tienes dudas, contáctanos por WhatsApp. ¡Te esperamos! 🧡</p>
  </div>`

  await transporter.sendMail({
    from: getFromAddress(),
    to: opts.to,
    subject: `Tu ticket Jump-In · ${opts.idTicket}`,
    html,
    attachments: [
      // Logo del encabezado (inline, no se lista como adjunto descargable).
      ...(logoBuffer
        ? [{ filename: 'jumpin.png', content: logoBuffer, cid: 'jumpinlogo', contentDisposition: 'inline' as const }]
        : []),
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
    const { funding, last4, diagnostico } = await resolverDatosTarjeta(session)
    if (funding !== 'credit' && funding !== 'debit' && funding !== 'prepaid') {
      console.warn(
        `No se pudo determinar el tipo de tarjeta (funding=${funding ?? 'null'}, last4=${last4 ?? 'null'}); ` +
          `se envía Forma_Pago='${FORMA_PAGO_DEFAULT}' — ${diagnostico}`
      )
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

        // El cuerpo se lee SIEMPRE (no solo en los errores): DECManager puede
        // devolver aquí datos de la venta que hay que incluir en el correo.
        const respBody = await res.text().catch(() => '')

        // fetch NO lanza en respuestas 4xx/5xx: hay que revisar el status a mano,
        // si no los rechazos de DECManager pasan inadvertidos.
        if (!res.ok) {
          console.error(
            `Webhook de venta rechazado por DECManager (HTTP ${res.status}): ${respBody} — payload:`,
            JSON.stringify(ventaPayload)
          )
        } else {
          console.log(
            `Webhook de venta enviado a DECManager OK (HTTP ${res.status}) — Id_Ticket ${idTicket} — respuesta:`,
            respBody
          )
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
        items,
      })
    } catch (err) {
      // No fallar el webhook de Stripe si el correo no se pudo enviar.
      console.error('Error enviando correo de confirmación:', err)
    }
  }

  return NextResponse.json({ received: true })
}

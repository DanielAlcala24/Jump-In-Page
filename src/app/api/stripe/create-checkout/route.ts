import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

interface CartItem {
  price_id: string
  quantity: number
  name: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, branch_id, branch_name, visit_date } = body as {
      items: CartItem[]
      branch_id: string
      branch_name: string
      visit_date?: string
    }

    if (!items?.length || !branch_id || !branch_name) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // La fecha de visita es obligatoria para cualquier producto (acceso, articulo o
    // promocion): el webhook de venta a DECManager siempre debe enviar Fecha_Visita.
    if (!visit_date || !/^\d{4}-\d{2}-\d{2}$/.test(visit_date)) {
      return NextResponse.json(
        { error: 'La fecha de visita es requerida (formato YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://jumpin.com.mx'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // Solo tarjeta. Con Link habilitado, el cargo queda como
      // payment_method_details.type = 'link' y Stripe no expone la tarjeta que hay
      // detras: el webhook se queda sin `funding` ni `last4`, y DECManager rechaza la
      // venta completa (HTTP 400) porque Forma_Pago solo acepta credito/debito.
      payment_method_types: ['card'],
      // `payment_method_types` no basta para ocultar Link: además de método de pago,
      // Link es un *wallet* dentro del formulario de tarjeta y se sigue mostrando.
      // Esto lo apaga de verdad. (Apple Pay / Google Pay no tienen equivalente en la
      // API: esos solo se desactivan desde el Dashboard de Stripe.)
      wallet_options: { link: { display: 'never' } },
      line_items: items.map((i) => ({ price: i.price_id, quantity: i.quantity })),
      billing_address_collection: 'auto',
      metadata: {
        branch_id,
        branch_name,
        visit_date,
        product_names: items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
      },
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      // 'es-419' (español latinoamericano) y no 'es' (España): el de España formatea
      // los importes como 1000,00 MXN, con la coma como separador decimal.
      locale: 'es-419',
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

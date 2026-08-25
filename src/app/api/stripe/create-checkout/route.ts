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
      locale: 'es',
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'session_id requerido' }, { status: 400 })

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })

    // El Id_Ticket lo genera el webhook al confirmarse el pago; puede tardar unos segundos.
    const { data: order } = await supabaseAdmin
      .from('shop_orders')
      .select('id_ticket')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()

    return NextResponse.json({
      customer_email: session.customer_details?.email ?? session.customer_email,
      metadata: session.metadata,
      amount_total: session.amount_total,
      currency: session.currency,
      id_ticket: order?.id_ticket ?? null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

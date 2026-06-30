import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Supabase admin client (bypasses RLS — only used server-side in webhook)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 })

    const items = lineItems.data.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      amount_total: item.amount_total,
    }))

    await supabaseAdmin.from('shop_orders').upsert({
      stripe_session_id: session.id,
      branch_id: meta.branch_id || null,
      branch_name: meta.branch_name || '',
      customer_email: email,
      visit_date: meta.visit_date || null,
      items,
      amount_total: session.amount_total,
      currency: session.currency,
      status: 'completed',
    })
  }

  return NextResponse.json({ received: true })
}

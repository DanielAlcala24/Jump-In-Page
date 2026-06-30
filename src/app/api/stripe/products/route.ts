import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function GET(req: NextRequest) {
  const branchId = req.nextUrl.searchParams.get('branch_id')

  try {
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
      limit: 100,
    })

    const filtered = products.data.filter((p) => {
      if (!branchId) return true
      const productBranch = p.metadata?.branch_id
      return !productBranch || productBranch === branchId
    })

    const result = filtered.map((p) => {
      const price = p.default_price as Stripe.Price | null
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        image: p.images?.[0] ?? null,
        price_id: price?.id ?? null,
        unit_amount: price?.unit_amount ?? null,
        currency: price?.currency ?? 'mxn',
        product_type: p.metadata?.product_type ?? 'access',
        branch_id: p.metadata?.branch_id ?? null,
      }
    })

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

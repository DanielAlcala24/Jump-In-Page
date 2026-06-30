import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('product_id')
  const branchId = req.nextUrl.searchParams.get('branch_id')

  let query = supabase
    .from('shop_date_restrictions')
    .select('*')
    .eq('is_active', true)

  if (productId) query = query.eq('stripe_product_id', productId)
  if (branchId) query = query.eq('branch_id', branchId)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data ?? [])
}

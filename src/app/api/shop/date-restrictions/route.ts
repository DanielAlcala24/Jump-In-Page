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
  // branch_id NULL = la restricción aplica en todas las sucursales. Se valida que
  // sea UUID porque va interpolado dentro del filtro .or() de PostgREST.
  if (branchId) {
    if (!/^[0-9a-f-]{36}$/i.test(branchId)) {
      return NextResponse.json({ error: 'branch_id inválido' }, { status: 400 })
    }
    query = query.or(`branch_id.is.null,branch_id.eq.${branchId}`)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data ?? [])
}

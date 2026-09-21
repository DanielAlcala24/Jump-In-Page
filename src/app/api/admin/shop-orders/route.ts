import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAdminUser } from '@/lib/admin-auth'

// Se lee con la service role key porque `shop_orders` solo la escribe el webhook
// de Stripe (no hay política de lectura para el rol authenticated). La ruta queda
// protegida por la sesión de Supabase del admin.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const LIMITE_DEFAULT = 500

// GET — lista las ventas de la tienda en línea, de la más reciente a la más vieja.
// Params: from / to (YYYY-MM-DD sobre la fecha de compra), limit.
export async function GET(req: NextRequest) {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const limit = Number(searchParams.get('limit')) || LIMITE_DEFAULT

  try {
    let query = supabaseAdmin
      .from('shop_orders')
      .select('id, stripe_session_id, id_ticket, branch_id, branch_name, customer_email, visit_date, items, amount_total, currency, status, created_at')
      .order('created_at', { ascending: false })
      .limit(Math.min(limit, 2000))

    // Los rangos van sobre created_at (timestamptz), así que el "to" incluye todo el día.
    if (from) query = query.gte('created_at', `${from}T00:00:00`)
    if (to) query = query.lte('created_at', `${to}T23:59:59.999`)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json(data ?? [])
  } catch (err: any) {
    console.error('Error al listar ventas:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

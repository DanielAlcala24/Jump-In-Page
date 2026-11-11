import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireAdmin } from '@/lib/admin-auth'
import Stripe from 'stripe'

// GET — productos activos de Stripe con sus datos, para el selector de
// /admin/shop (restricciones de fecha). A diferencia de /api/stripe/products,
// incluye los ocultos en la tienda e Id_Articulo, y no filtra por sucursal:
// el filtro se hace en el cliente.
export async function GET() {
  const { respuesta } = await requireAdmin('shop', 'view')
  if (respuesta) return respuesta

  try {
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
      limit: 100,
    })

    const result = products.data.map((p) => {
      const price = p.default_price as Stripe.Price | null
      return {
        id: p.id,
        name: p.name,
        unit_amount: price?.unit_amount ?? null,
        currency: price?.currency ?? 'mxn',
        id_articulo: p.metadata?.Id_Articulo ?? '',
        product_type: p.metadata?.product_type ?? 'access',
        // UUIDs de branches; vacío = todas las sucursales.
        branch_ids: (p.metadata?.branch_id ?? '').split(',').map((b) => b.trim()).filter(Boolean),
        visible: p.metadata?.visible_en_shop !== 'false',
      }
    })

    result.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

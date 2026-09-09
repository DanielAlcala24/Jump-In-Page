import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getAdminUser } from '@/lib/admin-auth'
import Stripe from 'stripe'

// Da forma a un producto de Stripe para el admin (incluye metadata completa).
function mapProduct(p: Stripe.Product) {
  const price = p.default_price as Stripe.Price | null
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    active: p.active,
    image: p.images?.[0] ?? null,
    price_id: price?.id ?? null,
    unit_amount: price?.unit_amount ?? null,
    currency: price?.currency ?? 'mxn',
    id_articulo: p.metadata?.Id_Articulo ?? '',
    product_type: p.metadata?.product_type ?? 'access',
    branch_id: p.metadata?.branch_id ?? '',
    // Sin la metadata = visible. Solo el 'false' explícito lo oculta, así los
    // productos que ya existían siguen apareciendo en /shop.
    visible: p.metadata?.visible_en_shop !== 'false',
  }
}

// GET — lista todos los productos (activos y archivados).
export async function GET() {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const products = await stripe.products.list({
      limit: 100,
      expand: ['data.default_price'],
    })
    return NextResponse.json(products.data.map(mapProduct))
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST — crea un producto nuevo con su precio y metadata.
export async function POST(req: NextRequest) {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, description, image, price, product_type, id_articulo, branch_ids, visible } = body as {
      name: string
      description?: string
      image?: string
      price: number // en pesos (MXN)
      product_type: string
      id_articulo?: string
      branch_ids?: string[]
      visible?: boolean
    }

    if (!name || !price || price <= 0) {
      return NextResponse.json({ error: 'Nombre y precio (mayor a 0) son requeridos' }, { status: 400 })
    }

    const product = await stripe.products.create({
      name,
      description: description || undefined,
      images: image ? [image] : undefined,
      metadata: {
        Id_Articulo: id_articulo || '',
        product_type: product_type || 'access',
        branch_id: (branch_ids ?? []).join(','), // vacío = todas las sucursales
        // Controla si el producto se muestra a los clientes en /shop.
        visible_en_shop: visible === false ? 'false' : 'true',
      },
    })

    const newPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100),
      currency: 'mxn',
    })

    await stripe.products.update(product.id, { default_price: newPrice.id })

    return NextResponse.json({ id: product.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

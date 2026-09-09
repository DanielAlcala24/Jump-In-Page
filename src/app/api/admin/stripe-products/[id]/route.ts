import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getAdminUser } from '@/lib/admin-auth'
import Stripe from 'stripe'

// PATCH — actualiza un producto (datos, metadata, activo/archivado y precio).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  try {
    const body = await req.json()
    const { name, description, image, price, product_type, id_articulo, branch_ids, active, visible } = body as {
      name?: string
      description?: string
      image?: string
      price?: number // en pesos (MXN)
      product_type?: string
      id_articulo?: string
      branch_ids?: string[]
      active?: boolean
      visible?: boolean
    }

    // Campos base del producto.
    const updateData: Stripe.ProductUpdateParams = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description || undefined
    if (image !== undefined) updateData.images = image ? [image] : []
    if (active !== undefined) updateData.active = active

    // Metadata (solo si se mandó alguno de sus campos).
    // Stripe hace merge de la metadata, así que mandar solo algunas llaves no borra el resto.
    if (
      product_type !== undefined ||
      id_articulo !== undefined ||
      branch_ids !== undefined ||
      visible !== undefined
    ) {
      updateData.metadata = {}
      if (product_type !== undefined) updateData.metadata.product_type = product_type
      if (id_articulo !== undefined) updateData.metadata.Id_Articulo = id_articulo || ''
      if (branch_ids !== undefined) updateData.metadata.branch_id = (branch_ids ?? []).join(',')
      if (visible !== undefined) updateData.metadata.visible_en_shop = visible ? 'true' : 'false'
    }

    // Si cambia el precio: los precios de Stripe son inmutables, se crea uno nuevo
    // y se marca como predeterminado (el anterior se archiva).
    if (price !== undefined && price > 0) {
      const current = await stripe.products.retrieve(id, { expand: ['default_price'] })
      const currentPrice = current.default_price as Stripe.Price | null
      const newAmount = Math.round(price * 100)

      if (!currentPrice || currentPrice.unit_amount !== newAmount) {
        const newPrice = await stripe.prices.create({
          product: id,
          unit_amount: newAmount,
          currency: 'mxn',
        })
        updateData.default_price = newPrice.id
        if (currentPrice?.id) {
          await stripe.prices.update(currentPrice.id, { active: false })
        }
      }
    }

    await stripe.products.update(id, updateData)

    return NextResponse.json({ id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

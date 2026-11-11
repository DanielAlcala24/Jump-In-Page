import type { SupabaseClient } from '@supabase/supabase-js'

// Secciones del paso "Productos" de /shop: una por product_type de Stripe.
export const TIPOS_PRODUCTO = ['access', 'promotion', 'article'] as const
export type TipoProducto = (typeof TIPOS_PRODUCTO)[number]

// Orden que se usa si no hay nada guardado (o si aún no existe shop_settings).
export const ORDEN_SECCIONES_DEFAULT: TipoProducto[] = ['access', 'promotion', 'article']

export const ETIQUETA_TIPO: Record<TipoProducto, string> = {
  access: 'Acceso',
  promotion: 'Promoción',
  article: 'Artículo',
}

// Título de cada sección. Escrito completo: pegarle una "s" al singular daba "Promocións".
export const ETIQUETA_TIPO_PLURAL: Record<TipoProducto, string> = {
  access: 'Accesos',
  promotion: 'Promociones',
  article: 'Artículos',
}

// Deja un orden válido: sin repetidos ni valores desconocidos, y con los tipos que
// falten agregados al final (en el orden por defecto).
export function normalizarOrden(orden: unknown): TipoProducto[] {
  const lista = Array.isArray(orden) ? orden : []
  const validos = lista.filter(
    (t, i): t is TipoProducto => TIPOS_PRODUCTO.includes(t as TipoProducto) && lista.indexOf(t) === i
  )
  return [...validos, ...ORDEN_SECCIONES_DEFAULT.filter((t) => !validos.includes(t))]
}

// Lee el orden guardado en shop_settings. Nunca lanza: ante cualquier error
// (p. ej. la tabla todavía no existe) devuelve el orden por defecto.
export async function obtenerOrdenSecciones(supabase: SupabaseClient): Promise<TipoProducto[]> {
  try {
    const { data, error } = await supabase.from('shop_settings').select('section_order').eq('id', 1).maybeSingle()
    if (error || !data) return ORDEN_SECCIONES_DEFAULT
    return normalizarOrden(data.section_order)
  } catch {
    return ORDEN_SECCIONES_DEFAULT
  }
}

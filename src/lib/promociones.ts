import type { SupabaseClient } from '@supabase/supabase-js'
import { validarEnlace } from '@/lib/enlaces'

export interface PromocionPublica {
  id: string
  title: string
  description: string
  image_url: string
  image_hint?: string
  available_in: string[]
  button_text?: string | null
  button_url?: string | null
}

const COLUMNAS = 'id, title, description, image_url, image_hint, available_in, order_index, created_at'

// Promociones para el sitio público, ya ordenadas. Si todavía no se corre
// supabase-promotions-button.sql (no existen button_text / button_url), se vuelven
// a pedir sin esas columnas: así las promociones nunca dejan de mostrarse.
export async function obtenerPromociones(supabase: SupabaseClient): Promise<PromocionPublica[]> {
  const pedir = (columnas: string) =>
    supabase
      .from('promotions')
      .select(columnas)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

  let { data, error } = await pedir(`${COLUMNAS}, button_text, button_url`)
  if (error && /button_(text|url)/.test(error.message)) {
    ;({ data, error } = await pedir(COLUMNAS))
  }
  if (error) throw error
  return (data ?? []) as unknown as PromocionPublica[]
}

// El botón solo se muestra con leyenda y enlace válidos. Un "#seccion" suelto se
// convierte en "/#seccion" (sección del inicio): las promociones también salen en
// /precios-y-promociones, donde esa sección no existe.
export function botonDePromocion(p: Pick<PromocionPublica, 'button_text' | 'button_url'>) {
  const texto = p.button_text?.trim()
  const enlace = p.button_url?.trim()
  if (!texto || !enlace || validarEnlace(enlace)) return null
  return { texto, enlace: enlace.startsWith('#') ? `/${enlace}` : enlace }
}

// Validación del formulario del admin. Devuelve el mensaje de error o null.
export function validarBotonPromocion(texto: string, enlace: string): string | null {
  const t = texto.trim()
  const e = enlace.trim()
  if (!t && !e) return null
  if (t && !e) return 'Escribe a dónde lleva el botón, o borra la leyenda si no quieres botón'
  if (!t && e) return 'Escribe la leyenda del botón, o borra el enlace si no quieres botón'
  if (t.length > 40) return 'La leyenda del botón puede tener máximo 40 caracteres'
  return validarEnlace(e)
}

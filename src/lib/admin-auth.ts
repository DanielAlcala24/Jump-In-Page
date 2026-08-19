import { createServerComponentClient } from '@/lib/supabase-server'

// Devuelve el usuario autenticado (admin) o null.
// Se usa en rutas API para bloquear accesos no autenticados.
export async function getAdminUser() {
  try {
    const supabase = await createServerComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

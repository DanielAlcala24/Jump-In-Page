import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { createServerComponentClient } from '@/lib/supabase-server'
import {
  accesoDeUsuario,
  esSuper,
  puedeEditar,
  puedeVer,
  type AccesoAdmin,
  type NivelPermiso,
  type SeccionAdmin,
} from '@/lib/admin-permissions'

// Devuelve el usuario autenticado (admin) o null.
// Se usa en rutas API para bloquear accesos no autenticados.
//
// getUser() consulta al servidor de Auth, así que el app_metadata (y con él los
// permisos) siempre viene actualizado, aunque el JWT de la cookie sea viejo.
export async function getAdminUser() {
  try {
    const supabase = await createServerComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

type ResultadoGuard =
  | { user: User; acceso: AccesoAdmin; respuesta?: undefined }
  | { user?: undefined; acceso?: undefined; respuesta: NextResponse }

// Guard para rutas API: exige sesión y el permiso indicado sobre la sección.
// Uso:
//   const { user, respuesta } = await requireAdmin('ventas', 'view')
//   if (respuesta) return respuesta
export async function requireAdmin(seccion: SeccionAdmin, nivel: NivelPermiso): Promise<ResultadoGuard> {
  const user = await getAdminUser()
  if (!user) {
    return { respuesta: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) }
  }
  const acceso = accesoDeUsuario(user)
  const permitido = nivel === 'edit' ? puedeEditar(acceso, seccion) : puedeVer(acceso, seccion)
  if (!permitido) {
    return {
      respuesta: NextResponse.json(
        { error: 'No tienes permiso para esta sección' },
        { status: 403 }
      ),
    }
  }
  return { user, acceso }
}

// Guard para la administración de usuarios: solo super administradores. Quien
// pudiera editar usuarios podría darse a sí mismo todos los permisos.
export async function requireSuperAdmin(): Promise<ResultadoGuard> {
  const user = await getAdminUser()
  if (!user) {
    return { respuesta: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) }
  }
  const acceso = accesoDeUsuario(user)
  if (!esSuper(acceso)) {
    return {
      respuesta: NextResponse.json(
        { error: 'Solo un super administrador puede administrar usuarios' },
        { status: 403 }
      ),
    }
  }
  return { user, acceso }
}

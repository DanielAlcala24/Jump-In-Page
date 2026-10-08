// Permisos por sección del panel /admin.
//
// Se guardan en el `app_metadata` del usuario de Supabase Auth, que solo se puede
// escribir con la service role key (a diferencia de `user_metadata`, que el propio
// usuario puede cambiar desde el navegador):
//
//   app_metadata.admin_role        'super' | 'custom'
//   app_metadata.admin_permissions { posts: 'edit', ventas: 'view', ... }
//
// - 'super': ve y edita todo, y es el único que administra usuarios.
// - 'custom': solo las secciones listadas en admin_permissions; una sección que no
//   aparece = sin acceso.
// - Sin admin_role = 'super'. Así siguen igual los admins dados de alta antes de que
//   existieran los permisos (todos eran super administradores).
//
// Este archivo no importa nada de servidor: lo usan el middleware, las rutas API y
// los componentes del cliente. La barrera real para escribir en las tablas es RLS
// (`supabase-admin-permissions.sql`), que lee estos mismos campos.

export type NivelPermiso = 'view' | 'edit'
export type RolAdmin = 'super' | 'custom'

export const SECCIONES_ADMIN = [
  { key: 'posts', label: 'Artículos (Blog)', path: '/admin/posts' },
  { key: 'media', label: 'Multimedia', path: '/admin/media' },
  { key: 'menu', label: 'Menú de alimentos', path: '/admin/menu' },
  { key: 'faq', label: 'Preguntas frecuentes', path: '/admin/faq' },
  { key: 'base-conocimiento', label: 'Base de conocimiento', path: '/admin/base-conocimiento' },
  { key: 'atracciones', label: 'Atracciones', path: '/admin/atracciones' },
  { key: 'promociones', label: 'Promociones', path: '/admin/promociones' },
  { key: 'cumpleanos', label: 'Paquetes cumpleaños (y galería)', path: '/admin/cumpleanos' },
  { key: 'sucursales', label: 'Sucursales', path: '/admin/sucursales' },
  { key: 'popup', label: 'Popup del sitio', path: '/admin/popup' },
  { key: 'banner', label: 'Banner superior', path: '/admin/banner' },
  { key: 'articulos', label: 'Artículos Shop y grupos', path: '/admin/articulos' },
  { key: 'shop', label: 'Shop — Fechas', path: '/admin/shop' },
  { key: 'ventas', label: 'Ventas en línea', path: '/admin/ventas', soloLectura: true },
  { key: 'leads', label: 'Registros (Leads)', path: '/admin/leads' },
] as const satisfies readonly {
  key: string
  label: string
  path: string
  soloLectura?: boolean
}[]

export type SeccionAdmin = (typeof SECCIONES_ADMIN)[number]['key']

export type PermisosAdmin = Partial<Record<SeccionAdmin, NivelPermiso>>

export interface AccesoAdmin {
  rol: RolAdmin
  permisos: PermisosAdmin
}

const CLAVES = new Set<string>(SECCIONES_ADMIN.map((s) => s.key))

// Ventas no tiene nada que editar desde el panel: como mucho se ve.
const SOLO_LECTURA = new Set<string>(
  SECCIONES_ADMIN.filter((s) => 'soloLectura' in s && s.soloLectura).map((s) => s.key)
)

// Limpia lo que llega del cliente o de la metadata: solo claves conocidas y
// niveles válidos. Todo lo demás se descarta.
export function normalizarPermisos(raw: unknown): PermisosAdmin {
  if (!raw || typeof raw !== 'object') return {}
  const permisos: PermisosAdmin = {}
  for (const [key, nivel] of Object.entries(raw as Record<string, unknown>)) {
    if (!CLAVES.has(key)) continue
    if (nivel !== 'view' && nivel !== 'edit') continue
    permisos[key as SeccionAdmin] = SOLO_LECTURA.has(key) ? 'view' : nivel
  }
  return permisos
}

// Lee el acceso de un usuario de Supabase (o de su app_metadata).
export function accesoDeUsuario(user: { app_metadata?: Record<string, any> } | null | undefined): AccesoAdmin {
  const meta = user?.app_metadata ?? {}
  if (meta.admin_role !== 'custom') return { rol: 'super', permisos: {} }
  return { rol: 'custom', permisos: normalizarPermisos(meta.admin_permissions) }
}

export function puedeVer(acceso: AccesoAdmin, seccion: SeccionAdmin): boolean {
  return acceso.rol === 'super' || acceso.permisos[seccion] !== undefined
}

export function puedeEditar(acceso: AccesoAdmin, seccion: SeccionAdmin): boolean {
  return acceso.rol === 'super' || acceso.permisos[seccion] === 'edit'
}

export function esSuper(acceso: AccesoAdmin): boolean {
  return acceso.rol === 'super'
}

// Sección a la que pertenece una ruta del panel, o null si es una ruta común
// (/admin, /admin/login) o de solo super (/admin/usuarios).
export function seccionDeRuta(pathname: string): SeccionAdmin | null {
  const s = SECCIONES_ADMIN.find((s) => pathname === s.path || pathname.startsWith(`${s.path}/`))
  return s?.key ?? null
}

// Pantallas de alta y edición (/new, /[id]/edit): sin permiso de edición ni se abren.
export function esRutaDeEdicion(pathname: string): boolean {
  return /\/(new|edit)(\/|$)/.test(pathname)
}

import { getAdminUser } from '@/lib/admin-auth'
import { accesoDeUsuario } from '@/lib/admin-permissions'
import { AdminAccessProvider } from '@/components/admin/admin-access'

// Carga los permisos del admin en sesión una vez para todo /admin. En /admin/login
// no hay usuario y el contexto queda sin permisos, que es lo correcto.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser()
  const acceso = user ? accesoDeUsuario(user) : { rol: 'custom' as const, permisos: {} }

  return <AdminAccessProvider acceso={acceso}>{children}</AdminAccessProvider>
}

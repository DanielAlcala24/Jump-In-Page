'use client'

import { createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  esSuper,
  puedeEditar,
  puedeVer,
  seccionDeRuta,
  SECCIONES_ADMIN,
  type AccesoAdmin,
  type SeccionAdmin,
} from '@/lib/admin-permissions'

// Permisos del admin en sesión para los componentes del cliente. Los carga
// src/app/admin/layout.tsx desde el servidor, así que no hay parpadeo de botones.
//
// Ocultar botones es comodidad: lo que impide de verdad escribir sin permiso es
// el middleware (rutas /new y /edit), las rutas API y RLS en Supabase.

const AccesoContext = createContext<AccesoAdmin>({ rol: 'custom', permisos: {} })

export function AdminAccessProvider({
  acceso,
  children,
}: {
  acceso: AccesoAdmin
  children: React.ReactNode
}) {
  return (
    <AccesoContext.Provider value={acceso}>
      <AvisoSoloLectura />
      {children}
    </AccesoContext.Provider>
  )
}

export function useAccesoAdmin() {
  const acceso = useContext(AccesoContext)
  return {
    acceso,
    esSuper: esSuper(acceso),
    puedeVer: (seccion: SeccionAdmin) => puedeVer(acceso, seccion),
    puedeEditar: (seccion: SeccionAdmin) => puedeEditar(acceso, seccion),
  }
}

// ¿Puede editar la sección de la página actual? Sin argumento la deduce de la ruta,
// así cada página solo hace `const puedeEditar = usePuedeEditar()`.
export function usePuedeEditar(seccion?: SeccionAdmin): boolean {
  const acceso = useContext(AccesoContext)
  const pathname = usePathname()
  const s = seccion ?? seccionDeRuta(pathname)
  return s ? puedeEditar(acceso, s) : esSuper(acceso)
}

// Muestra sus hijos solo a quien puede editar la sección de la página actual.
// Para envolver botones de crear, editar, eliminar, reordenar, etc.
export function SoloEditores({
  seccion,
  children,
}: {
  seccion?: SeccionAdmin
  children: React.ReactNode
}) {
  return usePuedeEditar(seccion) ? <>{children}</> : null
}

// Deshabilita de un golpe todos los campos y botones de un formulario (incluidos
// Switch y Checkbox de Radix, que son <button>) para quien solo puede ver.
export function BloqueEditable({
  seccion,
  className,
  children,
}: {
  seccion?: SeccionAdmin
  className?: string
  children: React.ReactNode
}) {
  const puede = usePuedeEditar(seccion)
  return (
    <fieldset disabled={!puede} className={cn('min-w-0', className)}>
      {children}
    </fieldset>
  )
}

// Franja informativa en las secciones donde el usuario solo tiene lectura.
function AvisoSoloLectura() {
  const acceso = useContext(AccesoContext)
  const pathname = usePathname()
  const seccion = seccionDeRuta(pathname)
  if (!seccion || !puedeVer(acceso, seccion) || puedeEditar(acceso, seccion)) return null

  const info = SECCIONES_ADMIN.find((s) => s.key === seccion)
  // Ventas es de solo lectura para todos: no tiene caso avisar.
  if (info && 'soloLectura' in info && info.soloLectura) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2">
        <Eye className="h-4 w-4 flex-shrink-0" />
        <span>
          Tienes acceso de <strong>solo lectura</strong> en {info?.label ?? 'esta sección'}: puedes
          consultar, pero no crear, editar ni eliminar.
        </span>
      </div>
    </div>
  )
}

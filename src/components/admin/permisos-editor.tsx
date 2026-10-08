'use client'

import { ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SECCIONES_ADMIN,
  type NivelPermiso,
  type PermisosAdmin,
  type RolAdmin,
  type SeccionAdmin,
} from '@/lib/admin-permissions'

type Opcion = 'none' | NivelPermiso

const OPCIONES: { value: Opcion; label: string }[] = [
  { value: 'none', label: 'Sin acceso' },
  { value: 'view', label: 'Ver' },
  { value: 'edit', label: 'Ver y editar' },
]

// Selector de rol + matriz de permisos por sección, para alta y edición de admins.
export function PermisosEditor({
  rol,
  permisos,
  onChange,
}: {
  rol: RolAdmin
  permisos: PermisosAdmin
  onChange: (rol: RolAdmin, permisos: PermisosAdmin) => void
}) {
  const cambiarSeccion = (key: SeccionAdmin, opcion: Opcion) => {
    const siguiente = { ...permisos }
    if (opcion === 'none') delete siguiente[key]
    else siguiente[key] = opcion
    onChange(rol, siguiente)
  }

  const todas = (opcion: Opcion) => {
    const siguiente: PermisosAdmin = {}
    if (opcion !== 'none') {
      for (const s of SECCIONES_ADMIN) {
        siguiente[s.key] = 'soloLectura' in s && s.soloLectura ? 'view' : opcion
      }
    }
    onChange(rol, siguiente)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('super', permisos)}
          className={cn(
            'flex items-start gap-2 rounded-md border p-3 text-left text-sm transition-colors',
            rol === 'super' ? 'border-orange-500 bg-orange-50' : 'hover:bg-gray-50'
          )}
        >
          <ShieldCheck className="h-4 w-4 mt-0.5 text-orange-500 flex-shrink-0" />
          <span>
            <span className="font-medium block">Super administrador</span>
            <span className="text-xs text-gray-500">Ve y edita todo, y administra usuarios.</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => onChange('custom', permisos)}
          className={cn(
            'flex items-start gap-2 rounded-md border p-3 text-left text-sm transition-colors',
            rol === 'custom' ? 'border-orange-500 bg-orange-50' : 'hover:bg-gray-50'
          )}
        >
          <SlidersHorizontal className="h-4 w-4 mt-0.5 text-orange-500 flex-shrink-0" />
          <span>
            <span className="font-medium block">Permisos personalizados</span>
            <span className="text-xs text-gray-500">Solo las secciones que elijas.</span>
          </span>
        </button>
      </div>

      {rol === 'custom' && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">Secciones</p>
            <div className="flex gap-1 text-xs">
              <span className="text-gray-500 mr-1 self-center">Todas:</span>
              {OPCIONES.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => todas(o.value)}
                  className="rounded border px-2 py-0.5 hover:bg-gray-50"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[45vh] overflow-y-auto rounded-md border divide-y">
            {SECCIONES_ADMIN.map((s) => {
              const actual: Opcion = permisos[s.key] ?? 'none'
              const soloLectura = 'soloLectura' in s && s.soloLectura
              return (
                <div
                  key={s.key}
                  className="flex flex-col gap-2 p-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm">{s.label}</span>
                  <div className="inline-flex rounded-md border overflow-hidden self-start sm:self-auto">
                    {OPCIONES.filter((o) => !(soloLectura && o.value === 'edit')).map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => cambiarSeccion(s.key, o.value)}
                        className={cn(
                          'px-2.5 py-1 text-xs border-l first:border-l-0 transition-colors',
                          actual === o.value
                            ? o.value === 'none'
                              ? 'bg-gray-200 text-gray-800'
                              : 'bg-orange-500 text-white'
                            : 'bg-white hover:bg-gray-50'
                        )}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-500">
            &quot;Ver&quot; permite consultar la sección sin crear, editar ni eliminar. La sección
            Usuarios es exclusiva de super administradores.
          </p>
        </div>
      )}
    </div>
  )
}

// Resumen corto para la tabla de usuarios.
export function resumenPermisos(rol: RolAdmin, permisos: PermisosAdmin): string {
  if (rol === 'super') return 'Super administrador'
  const valores = Object.values(permisos)
  if (valores.length === 0) return 'Sin acceso'
  const editar = valores.filter((v) => v === 'edit').length
  const ver = valores.length - editar
  const partes = []
  if (editar) partes.push(`edita ${editar}`)
  if (ver) partes.push(`ve ${ver}`)
  return `${valores.length} ${valores.length === 1 ? 'sección' : 'secciones'} (${partes.join(', ')})`
}

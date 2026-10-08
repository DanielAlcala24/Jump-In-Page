import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/admin-auth'
import { normalizarPermisos } from '@/lib/admin-permissions'

// Cambia el rol y los permisos por sección de un admin existente.
// Body: { userId, role: 'super' | 'custom', permissions: { seccion: 'view' | 'edit' } }.
//
// Se escribe en app_metadata, que solo la service role puede modificar. El cambio
// aplica de inmediato en el panel (middleware y APIs leen el usuario con getUser) y
// en la base de datos (RLS consulta auth.users, no el JWT).
export async function PATCH(request: NextRequest) {
  const { user: admin, respuesta } = await requireSuperAdmin()
  if (respuesta) return respuesta

  try {
    const { userId, role, permissions } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'El ID del usuario es requerido' }, { status: 400 })
    }

    // Evita que un super se quite a sí mismo el acceso a la gestión de usuarios y
    // deje el panel sin nadie que pueda dar permisos.
    if (userId === admin.id) {
      return NextResponse.json(
        { error: 'No puedes cambiar tus propios permisos' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase service role key')
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const rol = role === 'super' ? 'super' : 'custom'
    const permisos = rol === 'super' ? {} : normalizarPermisos(permissions)

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata: { admin_role: rol, admin_permissions: permisos },
    })

    if (error) {
      console.error('Error updating user permissions:', error)
      return NextResponse.json(
        { error: error.message || 'Error al actualizar los permisos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in update-user API:', error)
    return NextResponse.json(
      { error: error.message || 'Error inesperado al procesar la solicitud' },
      { status: 500 }
    )
  }
}

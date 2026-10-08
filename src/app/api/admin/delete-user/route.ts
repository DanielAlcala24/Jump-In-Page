import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const { user: admin, respuesta } = await requireSuperAdmin()
  if (respuesta) return respuesta

  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'El ID del usuario es requerido' },
        { status: 400 }
      )
    }

    // Quien borra es super y no puede borrarse a sí mismo: siempre queda al menos
    // un super administrador.
    if (userId === admin.id) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propio usuario' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase service role key')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Eliminar usuario
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Error deleting user:', error)
      return NextResponse.json(
        { error: error.message || 'Error al eliminar el usuario' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    })
  } catch (error: any) {
    console.error('Error in delete-user API:', error)
    return NextResponse.json(
      { error: error.message || 'Error inesperado al procesar la solicitud' },
      { status: 500 }
    )
  }
}

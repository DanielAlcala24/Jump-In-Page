import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/admin-auth'
import { normalizarPermisos } from '@/lib/admin-permissions'

// Da de alta un admin nuevo listo para entrar con Google.
//
// Sustituye al viejo flujo de invitación (inviteUserByEmail + /admin/set-password):
// se crea la cuenta con `email_confirm: true` y NO se envía ningún correo. La cuenta
// nace confirmada, que es el requisito para que Google se enlace con ella; la persona
// entra directo desde /admin con "Continuar con Google".
//
// La cuenta se crea sin contraseña a propósito: el acceso es solo por Google.
//
// Body: { email, role: 'super' | 'custom', permissions: { seccion: 'view' | 'edit' } }.
// Los permisos van en app_metadata (ver src/lib/admin-permissions.ts).
export async function POST(request: NextRequest) {
  // Esta ruta puede crear cuentas con permisos totales: solo un super admin la llama.
  const { respuesta } = await requireSuperAdmin()
  if (respuesta) return respuesta

  try {
    const { email, role, permissions } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'El correo electrónico es requerido' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del correo electrónico no es válido' },
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
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const normalizado = email.trim().toLowerCase()

    // Sin rol explícito se crea limitado y sin secciones: dar acceso total tiene que
    // ser una decisión consciente.
    const rol = role === 'super' ? 'super' : 'custom'
    const permisos = rol === 'super' ? {} : normalizarPermisos(permissions)

    // Comprobar duplicados antes de crear: createUser devuelve un error genérico.
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (!listError && usersData?.users?.some((u) => u.email?.toLowerCase() === normalizado)) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este correo electrónico' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: normalizado,
      // Sin esto la cuenta queda sin confirmar y Google no se enlaza con ella.
      email_confirm: true,
      user_metadata: { role: 'admin' },
      app_metadata: { admin_role: rol, admin_permissions: permisos },
    })

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json(
        { error: error.message || 'Error al crear el usuario' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario creado. Ya puede entrar con su cuenta de Google.',
      user: data.user,
    })
  } catch (error: any) {
    console.error('Error in create-user API:', error)
    return NextResponse.json(
      { error: error.message || 'Error inesperado al procesar la solicitud' },
      { status: 500 }
    )
  }
}

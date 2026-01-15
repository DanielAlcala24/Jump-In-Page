import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'El correo electrónico es requerido' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del correo electrónico no es válido' },
        { status: 400 }
      )
    }

    // Usar service role key para poder invitar usuarios
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

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(email)
    
    if (existingUser?.user) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este correo electrónico' },
        { status: 400 }
      )
    }

    // Invitar al usuario
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        role: 'admin'
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'}/admin/set-password`
    })

    if (error) {
      console.error('Error inviting user:', error)
      return NextResponse.json(
        { error: error.message || 'Error al enviar la invitación' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Invitación enviada correctamente',
      user: data.user
    })
  } catch (error: any) {
    console.error('Error in invite-user API:', error)
    return NextResponse.json(
      { error: error.message || 'Error inesperado al procesar la solicitud' },
      { status: 500 }
    )
  }
}

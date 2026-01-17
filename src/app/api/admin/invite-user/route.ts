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
    // Listar usuarios y buscar por email
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      console.error('Error listing users:', listError)
      // Continuar de todas formas, la invitación fallará si el usuario ya existe
    } else {
      const existingUser = usersData?.users?.find(user => user.email === email)

      if (existingUser) {
        return NextResponse.json(
          { error: 'Ya existe un usuario con este correo electrónico' },
          { status: 400 }
        )
      }
    }

    // Determinar la URL base (producción o desarrollo)
    const getSiteUrl = () => {
      // Prioridad 1: Variable de entorno (debe estar configurada en producción)
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
      }

      // Prioridad 2: Detectar desde el request URL
      const url = new URL(request.url)
      const protocol = url.protocol // 'http:' o 'https:'
      const host = url.host // incluye puerto si es necesario

      if (host && !host.includes('localhost')) {
        // En producción, usar https
        return `${protocol}//${host}`
      }

      // Prioridad 3: Intentar desde headers
      const origin = request.headers.get('origin')
      if (origin && !origin.includes('localhost')) {
        return origin
      }

      const hostHeader = request.headers.get('host')
      if (hostHeader && !hostHeader.includes('localhost')) {
        return `https://${hostHeader}`
      }

      // Fallback: localhost solo en desarrollo
      return process.env.NODE_ENV === 'production'
        ? 'https://jumpin.com.mx'
        : 'http://localhost:3000'
    }

    const siteUrl = getSiteUrl()
    const redirectTo = `${siteUrl}/admin/set-password`

    // Log para debugging (remover en producción si es necesario)
    console.log('Inviting user with redirect URL:', redirectTo)

    // Invitar al usuario
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        role: 'admin'
      },
      redirectTo: redirectTo
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

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Callback del login con Google.
//
// Flujo: /admin/login -> signInWithOAuth -> Google -> Supabase -> aquí con ?code=...
// Aquí se canjea el code por sesión (PKCE) y se comprueba que el correo YA estuviera
// dado de alta como admin. Si no, se cierra la sesión y se rechaza.
//
// OJO: la barrera principal es el ajuste "Allow new users to sign up" APAGADO en
// Supabase (Authentication -> Sign In / Providers). Con eso, un correo desconocido
// ni siquiera llega a crear cuenta. La verificación de abajo es la segunda barrera,
// por si ese ajuste se reactiva por error.

// Margen para considerar que una cuenta "acaba de crearse" en este mismo login.
const MARGEN_CUENTA_NUEVA_MS = 2 * 60 * 1000

const loginConError = (req: NextRequest, motivo: string) =>
  NextResponse.redirect(new URL(`/admin/login?error=${motivo}`, req.url))

// Un admin legítimo fue invitado (invited_at), o se creó con correo/contraseña,
// o simplemente ya existía antes de este login.
function esAdminPreexistente(user: any): boolean {
  if (user.invited_at) return true
  if (user.identities?.some((i: any) => i.provider === 'email')) return true

  const creado = user.created_at ? new Date(user.created_at).getTime() : 0
  return creado > 0 && Date.now() - creado > MARGEN_CUENTA_NUEVA_MS
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get('code')

  // Google o Supabase pueden devolver un error directo (p. ej. registro deshabilitado).
  const errorParam = searchParams.get('error_description') || searchParams.get('error')
  if (errorParam) {
    console.warn('Error devuelto por el proveedor OAuth:', errorParam)
    return loginConError(req, 'proveedor')
  }

  if (!code) return loginConError(req, 'sin_codigo')

  // Cliente ligado a las cookies de la respuesta: aquí es donde se escribe la sesión.
  const res = NextResponse.redirect(new URL('/admin', origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('No se pudo canjear el código de Google:', error?.message)
    return loginConError(req, 'canje')
  }

  // --- Segunda barrera: el correo tiene que ser de un admin que ya existía ---
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceKey) {
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: detalle } = await supabaseAdmin.auth.admin.getUserById(data.user.id)

    if (!detalle?.user || !esAdminPreexistente(detalle.user)) {
      console.warn(
        `Acceso rechazado para ${data.user.email}: la cuenta no estaba dada de alta como admin. ` +
          'Revisa que "Allow new users to sign up" esté apagado en Supabase.'
      )
      // signOut escribe el borrado de cookies sobre `res`, así que hay que
      // devolver ESE mismo objeto (solo cambiándole el destino) o la sesión
      // rechazada se quedaría viva en el navegador.
      await supabase.auth.signOut()
      res.headers.set('location', new URL('/admin/login?error=no_autorizado', origin).toString())
      return res
    }
  } else {
    // Sin service role no se puede verificar; se deja pasar pero queda el aviso.
    console.warn('SUPABASE_SERVICE_ROLE_KEY no configurada: no se pudo verificar el alta del admin.')
  }

  return res
}

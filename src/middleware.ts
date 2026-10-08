import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  accesoDeUsuario,
  esRutaDeEdicion,
  esSuper,
  puedeEditar,
  puedeVer,
  seccionDeRuta,
} from '@/lib/admin-permissions'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    return NextResponse.next()
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          res.cookies.set(name, '', {
            maxAge: 0,
            ...options
          })
        },
      },
    }
  )

  // getUser() (y no getSession) porque valida la sesión contra Supabase y trae el
  // app_metadata al día: si un super admin cambia permisos, aplican en la siguiente
  // navegación sin esperar a que caduque el JWT.
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = req.nextUrl

  // Si la ruta es /admin (excepto login) y no hay sesión, redirigir a /admin/login
  if (pathname.startsWith('/admin') &&
    pathname !== '/admin/login' &&
    !user) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Si hay sesión y está en /admin/login, redirigir a /admin
  if (pathname === '/admin/login' && user) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Permisos por sección (ver src/lib/admin-permissions.ts). Sin permiso se regresa
  // al dashboard, que solo muestra las secciones a las que sí tiene acceso.
  if (user) {
    const acceso = accesoDeUsuario(user)
    const seccion = seccionDeRuta(pathname)
    const sinPermiso = () => NextResponse.redirect(new URL('/admin?sin_permiso=1', req.url))

    if (pathname === '/admin/usuarios' || pathname.startsWith('/admin/usuarios/')) {
      if (!esSuper(acceso)) return sinPermiso()
    } else if (seccion) {
      if (!puedeVer(acceso, seccion)) return sinPermiso()
      if (esRutaDeEdicion(pathname) && !puedeEditar(acceso, seccion)) return sinPermiso()
    }
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

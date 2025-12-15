import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const { data: { session } } = await supabase.auth.getSession()

  // Si la ruta es /admin (excepto login) y no hay sesión, redirigir a /admin/login
  if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login' && !session) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Si hay sesión y está en /admin/login, redirigir a /admin
  if (req.nextUrl.pathname === '/admin/login' && session) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

export const runtime = 'nodejs'

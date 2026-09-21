'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'

// Mensajes de los errores que devuelve /api/auth/callback.
const ERRORES: Record<string, string> = {
  no_autorizado:
    'Esa cuenta de Google no tiene acceso al panel. Pide que te den de alta desde Usuarios.',
  proveedor: 'Google no completó el inicio de sesión. Inténtalo de nuevo.',
  canje: 'No se pudo validar la sesión. Inténtalo de nuevo.',
  sin_codigo: 'El enlace de acceso llegó incompleto. Inténtalo de nuevo.',
}

function LoginContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  const errorUrl = searchParams.get('error')
  const mensajeError = error || (errorUrl ? ERRORES[errorUrl] ?? 'No se pudo iniciar sesión.' : '')

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // El code se canjea por sesión en el servidor, donde además se valida
        // que el correo ya esté dado de alta como admin.
        redirectTo: `${window.location.origin}/api/auth/callback`,
        // Siempre preguntar qué cuenta usar: varios admins comparten navegador.
        queryParams: { prompt: 'select_account' },
      },
    })

    if (error) {
      setError('No se pudo abrir el inicio de sesión de Google. Inténtalo de nuevo.')
      setLoading(false)
    }
    // Si todo va bien el navegador se va a Google, no hace falta apagar el loading.
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/assets/logojumpin.png"
              alt="Jump-in Trampoline Park Logo"
              width={120}
              height={120}
              data-ai-hint="logo jump"
              className="h-auto"
            />
          </div>
          <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Accede al panel de administración de Jump-In
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mensajeError && (
            <Alert variant="destructive">
              <AlertDescription>{mensajeError}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            variant="outline"
            className="w-full h-11 text-base"
          >
            {loading ? (
              'Conectando con Google...'
            ) : (
              <>
                <GoogleIcon />
                Continuar con Google
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Solo pueden entrar las cuentas dadas de alta previamente en el panel.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Logo oficial de Google en SVG (inline para no depender de una imagen externa).
function GoogleIcon() {
  return (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}

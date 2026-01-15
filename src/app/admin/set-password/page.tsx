'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'
import { toast } from 'sonner'

function SetPasswordPageContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    verifyToken()
  }, [])

  const verifyToken = async () => {
    try {
      // Verificar si hay un token en la URL (hash o query params)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const queryParams = new URLSearchParams(window.location.search)
      
      // Intentar obtener el token del hash primero, luego de query params
      const accessToken = hashParams.get('access_token') || queryParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token')
      const type = hashParams.get('type') || queryParams.get('type')

      if (accessToken && (type === 'invite' || type === 'signup')) {
        // El token está en la URL, establecer la sesión
        const { data: { session }, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        })
        
        if (error) {
          console.error('Error setting session:', error)
          setError('El enlace de invitación no es válido o ha expirado. Por favor, solicita una nueva invitación.')
        } else if (!session) {
          setError('No se pudo establecer la sesión. El enlace puede haber expirado.')
        } else {
          // Sesión establecida correctamente, limpiar el hash/query de la URL
          window.history.replaceState(null, '', window.location.pathname)
        }
      } else {
        // No hay token en la URL, verificar si ya hay una sesión activa
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setError('Error al verificar la sesión')
        } else if (!session) {
          setError('No se encontró una sesión válida. Por favor, usa el enlace de invitación que recibiste por correo.')
        }
      }
    } catch (err) {
      console.error('Error verifying token:', err)
      setError('Error al verificar el enlace de invitación. Por favor, intenta nuevamente.')
    } finally {
      setVerifying(false)
    }
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      // Verificar sesión primero
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError('Tu sesión ha expirado. Por favor, solicita una nueva invitación.')
        setLoading(false)
        return
      }

      // Actualizar la contraseña del usuario
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        setError(updateError.message)
        toast.error('Error al establecer la contraseña')
      } else {
        toast.success('Contraseña establecida correctamente')
        // Redirigir al panel de administración
        setTimeout(() => {
          router.push('/admin')
        }, 1500)
      }
    } catch (err) {
      console.error('Error setting password:', err)
      setError('Ocurrió un error inesperado')
      toast.error('Error al establecer la contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Verificando enlace...</p>
        </div>
      </div>
    )
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
          <CardTitle className="text-2xl text-center">Establecer Contraseña</CardTitle>
          <CardDescription className="text-center">
            Crea una contraseña para acceder al panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Estableciendo contraseña...' : 'Establecer Contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    }>
      <SetPasswordPageContent />
    </Suspense>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Home, Mail, UserPlus, Trash2, CheckCircle, XCircle, ShieldCheck, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { PermisosEditor, resumenPermisos } from '@/components/admin/permisos-editor'
import type { PermisosAdmin, RolAdmin } from '@/lib/admin-permissions'

interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  role: RolAdmin
  permissions: PermisosAdmin
}

// Un usuario personalizado sin ninguna sección no vería nada en el panel.
const permisosVacios = (rol: RolAdmin, permisos: PermisosAdmin) =>
  rol === 'custom' && Object.keys(permisos).length === 0

export default function UsuariosAdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [email, setEmail] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [nuevoRol, setNuevoRol] = useState<RolAdmin>('custom')
  const [nuevosPermisos, setNuevosPermisos] = useState<PermisosAdmin>({})
  const [editando, setEditando] = useState<User | null>(null)
  const [editRol, setEditRol] = useState<RolAdmin>('custom')
  const [editPermisos, setEditPermisos] = useState<PermisosAdmin>({})
  const [guardando, setGuardando] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
    fetchUsers()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/admin/login')
      return
    }
    setUser(user)
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Obtener usuarios usando la API de administración
      const response = await fetch('/api/admin/list-users')
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setUsers(data.users || [])
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('No se pudieron cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  const resetNuevo = () => {
    setEmail('')
    setNuevoRol('custom')
    setNuevosPermisos({})
    setError('')
  }

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (permisosVacios(nuevoRol, nuevosPermisos)) {
      setError('Elige al menos una sección o hazlo super administrador.')
      return
    }
    setInviting(true)
    setError('')

    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role: nuevoRol, permissions: nuevosPermisos }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        toast.error(data.error)
      } else {
        toast.success(`${email} ya puede entrar con Google`)
        resetNuevo()
        setDialogOpen(false)
        fetchUsers() // Recargar lista de usuarios
      }
    } catch (err) {
      console.error('Error creating user:', err)
      setError('Error al crear el usuario')
      toast.error('Error al crear el usuario')
    } finally {
      setInviting(false)
    }
  }

  const abrirPermisos = (u: User) => {
    setEditando(u)
    setEditRol(u.role)
    setEditPermisos(u.permissions || {})
  }

  const handleGuardarPermisos = async () => {
    if (!editando) return
    if (permisosVacios(editRol, editPermisos)) {
      toast.error('Elige al menos una sección o hazlo super administrador.')
      return
    }
    setGuardando(true)
    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: editando.id, role: editRol, permissions: editPermisos }),
      })
      const data = await response.json()
      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success(`Permisos de ${editando.email} actualizados`)
        setEditando(null)
        fetchUsers()
      }
    } catch (err) {
      console.error('Error updating permissions:', err)
      toast.error('Error al actualizar los permisos')
    } finally {
      setGuardando(false)
    }
  }

  const handleDelete = async (userId: string, userEmail: string) => {
    if (!confirm(`¿Estás seguro de eliminar al usuario ${userEmail}?`)) return

    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success('Usuario eliminado correctamente')
        fetchUsers()
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      toast.error('Error al eliminar el usuario')
    }
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Volver al Panel
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            </div>
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open)
                if (!open) resetNuevo()
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Agregar Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                  <DialogDescription>
                    Escribe el correo de <strong>su cuenta de Google</strong>. Entra de
                    inmediato desde el panel con &quot;Continuar con Google&quot;: no se
                    le envía ningún correo ni tiene que crear contraseña.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCrearUsuario} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@jumpin.com.mx"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Permisos</Label>
                    <PermisosEditor
                      rol={nuevoRol}
                      permisos={nuevosPermisos}
                      onChange={(rol, permisos) => {
                        setNuevoRol(rol)
                        setNuevosPermisos(permisos)
                      }}
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false)
                        resetNuevo()
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={inviting}>
                      {inviting ? 'Agregando...' : 'Agregar Usuario'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle>Listado de Usuarios</CardTitle>
              <CardDescription>
                Administra los usuarios que tienen acceso al panel de administración
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p>Cargando usuarios...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay usuarios registrados.</p>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="mt-4">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Agregar Primer Usuario
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Correo Electrónico</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Permisos</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead>Fecha de Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userItem) => (
                      <TableRow key={userItem.id}>
                        <TableCell className="font-medium">{userItem.email}</TableCell>
                        <TableCell>
                          {userItem.email_confirmed_at ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Activo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              Pendiente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {userItem.role === 'super' ? (
                            <Badge variant="outline" className="border-orange-500 text-orange-600">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Super administrador
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-600">
                              {resumenPermisos(userItem.role, userItem.permissions)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {userItem.last_sign_in_at
                            ? new Date(userItem.last_sign_in_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Nunca'}
                        </TableCell>
                        <TableCell>
                          {new Date(userItem.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {userItem.id === user.id ? (
                            <span className="text-xs text-gray-400">Tú</span>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => abrirPermisos(userItem)}
                                title="Editar permisos"
                              >
                                <KeyRound className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(userItem.id, userItem.email)}
                                title="Eliminar usuario"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={!!editando} onOpenChange={(open) => !open && setEditando(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Permisos de {editando?.email}</DialogTitle>
            <DialogDescription>
              El cambio aplica en cuanto la persona navegue a otra sección del panel.
            </DialogDescription>
          </DialogHeader>
          <PermisosEditor
            rol={editRol}
            permisos={editPermisos}
            onChange={(rol, permisos) => {
              setEditRol(rol)
              setEditPermisos(permisos)
            }}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEditando(null)}>
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleGuardarPermisos}
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Guardar permisos'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

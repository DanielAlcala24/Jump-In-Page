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
import { Plus, Edit, Trash2, Home, MapPin, CheckCircle2, XCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface Branch {
  id: string
  name: string
  slug: string
  state?: string
  is_active: boolean
  created_at: string
}

export default function SucursalesAdminPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
    fetchBranches()
  }, [])

  const checkUser = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) {
      router.push('/admin/login')
      return
    }
    setUser(user)
  }

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error('Error fetching branches:', error)
        setError('No se pudieron cargar las sucursales')
      } else {
        setBranches(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setError('No se pudieron cargar las sucursales')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    // Verificar si hay atracciones usando esta sucursal
    const { data: attractions } = await supabase
      .from('attractions')
      .select('id, name, available_in')

    const hasAttractions = attractions?.some(attraction => 
      attraction.available_in && attraction.available_in.includes(name)
    )

    // Verificar promociones
    const { data: promotions } = await supabase
      .from('promotions')
      .select('id, title, available_in')

    const hasPromotions = promotions?.some(promotion => 
      promotion.available_in && promotion.available_in.includes(name)
    )

    if (hasAttractions || hasPromotions) {
      const reasons = []
      if (hasAttractions) reasons.push('atracciones')
      if (hasPromotions) reasons.push('promociones')
      toast.error(
        `No se puede eliminar la sucursal "${name}" porque tiene ${reasons.join(' y ')} asociadas. Primero actualiza o elimina esos elementos.`
      )
      return
    }

    if (!confirm(`¿Estás seguro de eliminar la sucursal "${name}"?`)) return

    try {
      const { error } = await supabase.from('branches').delete().eq('id', id)

      if (error) {
        console.error('Error deleting branch:', error)
        toast.error('Error al eliminar la sucursal')
      } else {
        setBranches(branches.filter((branch) => branch.id !== id))
        toast.success('Sucursal eliminada correctamente')
        fetchBranches()
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al eliminar la sucursal')
    }
  }

  const handleToggleActive = async (branch: Branch) => {
    try {
      const { error } = await supabase
        .from('branches')
        .update({ is_active: !branch.is_active })
        .eq('id', branch.id)

      if (error) {
        console.error('Error updating branch:', error)
        toast.error('Error al actualizar la sucursal')
      } else {
        toast.success(`Sucursal ${!branch.is_active ? 'activada' : 'desactivada'} correctamente`)
        fetchBranches()
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al actualizar la sucursal')
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
              <h1 className="text-2xl font-bold text-gray-900">Sucursales</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/sucursales/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Sucursal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle>Listado de Sucursales</CardTitle>
              <CardDescription>
                Administra las sucursales disponibles en el sistema
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
                  <p>Cargando sucursales...</p>
                </div>
              ) : branches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay sucursales registradas.</p>
                  <Link href="/admin/sucursales/new" className="mt-4 inline-block">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Primera Sucursal
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Estado (Geográfico)</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branches.map((branch) => (
                      <TableRow key={branch.id}>
                        <TableCell className="font-medium">{branch.name}</TableCell>
                        <TableCell>{branch.state || '-'}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {branch.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant={branch.is_active ? 'default' : 'secondary'}>
                            {branch.is_active ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Activa
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactiva
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(branch.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/admin/sucursales/${branch.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleActive(branch)}
                              title={branch.is_active ? 'Desactivar' : 'Activar'}
                            >
                              {branch.is_active ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(branch.id, branch.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
    </div>
  )
}


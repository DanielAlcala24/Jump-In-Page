'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
import { Plus, Edit, Trash2, Home, Tag } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface Attraction {
  id: string
  name: string
  category: string
  available_in: string[]
  image_url: string
  image_hint?: string
  created_at: string
}

const DEFAULT_IMAGE = '/assets/atracciones/exclusivas/climbingwall.jpg'

const SUCURSALES = ['Churubusco', 'Coacalco', 'Interlomas', 'Ecatepec', 'Vallejo', 'La Cúspide', 'Miramontes', 'Cuernavaca']

export default function AtraccionesAdminPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const [filterCategory, setFilterCategory] = useState('Todas')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
    fetchAttractions()
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

  const fetchAttractions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching attractions:', error)
        setError('No se pudieron cargar las atracciones')
      } else {
        setAttractions(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setError('No se pudieron cargar las atracciones')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta atracción?')) return

    try {
      const { error } = await supabase.from('attractions').delete().eq('id', id)

      if (error) {
        console.error('Error deleting attraction:', error)
        toast.error('Error al eliminar la atracción')
      } else {
        setAttractions(attractions.filter((attraction) => attraction.id !== id))
        toast.success('Atracción eliminada correctamente')
        fetchAttractions()
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al eliminar la atracción')
    }
  }

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        attractions
          .map((attraction) => attraction.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    )
    return unique
  }, [attractions])

  useEffect(() => {
    if (
      filterCategory !== 'Todas' &&
      categories.length > 0 &&
      !categories.includes(filterCategory)
    ) {
      setFilterCategory('Todas')
    }
  }, [categories, filterCategory])

  const filteredAttractions =
    filterCategory === 'Todas'
      ? attractions
      : attractions.filter((attraction) => attraction.category === filterCategory)

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
              <h1 className="text-2xl font-bold text-gray-900">Atracciones</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/atracciones/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Atracción
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
              <CardTitle>Listado de Atracciones</CardTitle>
              <CardDescription>
                Administra las atracciones que aparecen en el sitio
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Filtrar por categoría
                    </p>
                    <p className="text-xs text-gray-500">
                      Selecciona una categoría para ver solo esas atracciones
                    </p>
                  </div>
                  <div className="max-w-xs w-full">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Todas">Todas</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p>Cargando atracciones...</p>
                </div>
              ) : filteredAttractions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay atracciones que coincidan con el filtro seleccionado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Sucursales</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttractions.map((attraction) => (
                      <TableRow key={attraction.id}>
                        <TableCell>
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={attraction.image_url || DEFAULT_IMAGE}
                              alt={attraction.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{attraction.name}</TableCell>
                        <TableCell>{attraction.category}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {attraction.available_in && attraction.available_in.length > 0 ? (
                              attraction.available_in.slice(0, 3).map((sucursal) => (
                                <Badge key={sucursal} variant="outline" className="text-xs">
                                  {sucursal}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">Sin sucursales</span>
                            )}
                            {attraction.available_in && attraction.available_in.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{attraction.available_in.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/admin/atracciones/${attraction.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(attraction.id)}
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


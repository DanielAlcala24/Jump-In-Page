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

interface MenuItem {
  id: string
  title: string
  description: string
  price: string
  category: string
  image_url: string
  image_hint?: string
  created_at: string
}

const DEFAULT_IMAGE = '/assets/menu/alimentos/alitas.png'

export default function MenuAdminPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const [filterCategory, setFilterCategory] = useState('Todas')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
    fetchMenuItems()
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

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching menu items:', error)
        setError('No se pudieron cargar los elementos del menú')
      } else {
        setItems(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setError('No se pudieron cargar los elementos del menú')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este elemento del menú?')) return

    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id)

      if (error) {
        console.error('Error deleting item:', error)
        toast.error('Error al eliminar el elemento')
      } else {
        setItems(items.filter((item) => item.id !== id))
        toast.success('Elemento eliminado correctamente')
        fetchMenuItems() // Refrescar para actualizar categorías
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al eliminar el elemento')
    }
  }

  const handleDeleteCategory = async (categoryToDelete: string) => {
    // Verificar si hay platillos usando esta categoría
    const itemsInCategory = items.filter((item) => item.category === categoryToDelete)
    
    if (itemsInCategory.length > 0) {
      toast.error(
        `No se puede eliminar la categoría "${categoryToDelete}" porque tiene ${itemsInCategory.length} platillo(s) asociado(s). Primero mueve o elimina esos platillos.`
      )
      return
    }

    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoryToDelete}"?`)) return

    // Como no hay platillos usando esta categoría, solo necesitamos actualizar el filtro si está activo
    if (filterCategory === categoryToDelete) {
      setFilterCategory('Todas')
    }
    
    toast.success(`Categoría "${categoryToDelete}" eliminada (no tenía platillos asociados)`)
  }

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        items
          .map((item) => item.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    )
    return unique
  }, [items])

  useEffect(() => {
    if (
      filterCategory !== 'Todas' &&
      categories.length > 0 &&
      !categories.includes(filterCategory)
    ) {
      setFilterCategory('Todas')
    }
  }, [categories, filterCategory])

  const filteredItems =
    filterCategory === 'Todas'
      ? items
      : items.filter((item) => item.category === filterCategory)

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
              <h1 className="text-2xl font-bold text-gray-900">Menú de Alimentos</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/menu/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Platillo
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
              <CardTitle>Listado de Platillos</CardTitle>
              <CardDescription>
                Administra los platillos que aparecen en el menú del sitio
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length > 0 && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Filtrar por categoría
                      </p>
                      <p className="text-xs text-gray-500">
                        Selecciona una categoría para ver solo esos platillos
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
                  
                  {/* Sección de gestión de categorías */}
                  <Card className="mb-4 border-dashed">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Gestionar Categorías
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Elimina categorías que no tengan platillos asociados
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                          const itemsInCategory = items.filter((item) => item.category === cat).length
                          return (
                            <div
                              key={cat}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md border"
                            >
                              <span className="text-sm font-medium">{cat}</span>
                              <span className="text-xs text-gray-500">
                                ({itemsInCategory} platillo{itemsInCategory !== 1 ? 's' : ''})
                              </span>
                              {itemsInCategory === 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteCategory(cat)}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p>Cargando platillos...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay platillos que coincidan con el filtro seleccionado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={item.image_url || DEFAULT_IMAGE}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {item.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/admin/menu/${item.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(item.id)}
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


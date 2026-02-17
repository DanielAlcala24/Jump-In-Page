'use client'

import { useEffect, useState } from 'react'
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
import { Plus, Edit, Trash2, Home, ArrowUp, ArrowDown } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface Promotion {
  id: string
  title: string
  description: string
  image_url: string
  image_hint?: string
  available_in: string[]
  order_index: number
  created_at: string
}

const DEFAULT_IMAGE = '/assets/g5.jpeg'

export default function PromocionesAdminPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
    fetchPromotions()
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

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching promotions:', error)
        setError('No se pudieron cargar las promociones')
      } else {
        setPromotions(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setError('No se pudieron cargar las promociones')
    } finally {
      setLoading(false)
    }
  }

  const handleMovePromotion = async (item: Promotion, direction: 'up' | 'down') => {
    const index = promotions.findIndex((p) => p.id === item.id)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= promotions.length) return

    const otherItem = promotions[newIndex]

    // Intercambiar order_index
    const tempOrder = item.order_index || 0
    const newOrder = otherItem.order_index || 0

    // Si ambos tienen el mismo orden o no tienen (0), asignar nuevos basados en indices
    const finalItemOrder = newOrder || index + (direction === 'up' ? -1 : 1)
    const finalOtherOrder = tempOrder || index

    const { error: error1 } = await supabase
      .from('promotions')
      .update({ order_index: finalItemOrder })
      .eq('id', item.id)

    if (error1) {
      toast.error('Error al mover la promoción')
      return
    }

    const { error: error2 } = await supabase
      .from('promotions')
      .update({ order_index: finalOtherOrder })
      .eq('id', otherItem.id)

    if (error2) {
      toast.error('Error al mover la promoción')
      return
    }

    fetchPromotions()
    toast.success('Orden actualizado')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta promoción?')) return

    try {
      const { error } = await supabase.from('promotions').delete().eq('id', id)

      if (error) {
        console.error('Error deleting promotion:', error)
        toast.error('Error al eliminar la promoción')
      } else {
        setPromotions(promotions.filter((promotion) => promotion.id !== id))
        toast.success('Promoción eliminada correctamente')
        fetchPromotions()
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al eliminar la promoción')
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
              <h1 className="text-2xl font-bold text-gray-900">Promociones</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/promociones/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Promoción
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
              <CardTitle>Listado de Promociones</CardTitle>
              <CardDescription>
                Administra las promociones que aparecen en la página de Precios y Promociones. Usa las flechas para ordenar.
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
                  <p>Cargando promociones...</p>
                </div>
              ) : promotions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay promociones registradas.</p>
                  <Link href="/admin/promociones/new" className="mt-4 inline-block">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Primera Promoción
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Imagen</TableHead>
                      <TableHead className="w-[80px]">Orden</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Sucursales</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promotions.map((promotion, idx) => (
                      <TableRow key={promotion.id}>
                        <TableCell>
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={promotion.image_url || DEFAULT_IMAGE}
                              alt={promotion.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMovePromotion(promotion, 'up')}
                              disabled={idx === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMovePromotion(promotion, 'down')}
                              disabled={idx === promotions.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{promotion.title}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {promotion.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {promotion.available_in && promotion.available_in.length > 0 ? (
                              promotion.available_in.slice(0, 3).map((sucursal) => (
                                <Badge key={sucursal} variant="outline" className="text-xs">
                                  {sucursal}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">Sin sucursales</span>
                            )}
                            {promotion.available_in && promotion.available_in.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{promotion.available_in.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/admin/promociones/${promotion.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(promotion.id)}
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


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
import {
  Plus,
  Edit,
  Trash2,
  Home,
  BookOpen,
  Ticket,
  Cake,
  UtensilsCrossed,
  Tag
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import ExternalKnowledgeSection from '@/components/admin/external-knowledge-section'

interface KnowledgeEntry {
  id: string
  question: string
  answer: string
  knowledge_category?: string | null
  branches?: string[]
  is_active?: boolean
  order: number
  created_at: string
  updated_at?: string
}

export default function KnowledgeBaseAdminPage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
    fetchEntries()
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

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('order', { ascending: true })

      if (error) {
        console.error('Error fetching knowledge base:', error)
        setError('No se pudo cargar la base de conocimiento')
      } else {
        setEntries(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setError('No se pudo cargar la base de conocimiento')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta pregunta de la base de conocimiento?')) return

    try {
      const { error } = await supabase.from('knowledge_base').delete().eq('id', id)

      if (error) {
        console.error('Error deleting entry:', error)
        toast.error('Error al eliminar la pregunta')
      } else {
        setEntries(entries.filter((entry) => entry.id !== id))
        toast.success('Pregunta eliminada correctamente')
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al eliminar la pregunta')
    }
  }

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = entries.findIndex((entry) => entry.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= entries.length) return

    const updatedEntries = [...entries]
    const [moved] = updatedEntries.splice(currentIndex, 1)
    updatedEntries.splice(newIndex, 0, moved)

    // Actualizar el orden en la base de datos
    try {
      const updates = updatedEntries.map((entry, index) => ({
        id: entry.id,
        order: index
      }))

      for (const update of updates) {
        await supabase
          .from('knowledge_base')
          .update({ order: update.order })
          .eq('id', update.id)
      }

      setEntries(updatedEntries)
      toast.success('Orden actualizado')
    } catch (err) {
      console.error('Error reordering:', err)
      toast.error('Error al actualizar el orden')
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
              <h1 className="text-2xl font-bold text-gray-900">
                Base de Conocimiento
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/base-conocimiento/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Pregunta
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
              <CardTitle>Listado de Preguntas y Respuestas</CardTitle>
              <CardDescription>
                Administra las preguntas y respuestas de la base de conocimiento
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
                  <p>Cargando preguntas...</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay preguntas en la base de conocimiento. Agrega la primera.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Orden</TableHead>
                      <TableHead>Pregunta</TableHead>
                      <TableHead className="max-w-md">Respuesta</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Sucursales</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry, index) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleReorder(entry.id, 'up')}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleReorder(entry.id, 'down')}
                              disabled={index === entries.length - 1}
                            >
                              ↓
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{entry.question}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {entry.answer}
                        </TableCell>
                        <TableCell>
                          {entry.knowledge_category ? (
                            <Badge variant="outline">{entry.knowledge_category}</Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {entry.branches && entry.branches.length > 0 ? (
                              entry.branches.map((branch) => (
                                <Badge key={branch} variant="secondary">
                                  {branch}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="secondary">Todas las sucursales</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {entry.is_active === false ? (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-600 border-gray-300"
                            >
                              Inactiva
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-300"
                            >
                              Activa
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/admin/base-conocimiento/${entry.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(entry.id)}
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

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Base de conocimiento por sección
              </h2>
              <p className="text-sm text-gray-600">
                Edita aquí la base de conocimiento interna de cada módulo. Este contenido
                no se muestra en el sitio público; es solo informativo para el admin y para
                consumirse vía API.
              </p>
            </div>

            <ExternalKnowledgeSection
              table="attractions"
              title="Atracciones"
              description="Información interna de cada atracción"
              nameField="name"
              icon={Ticket}
            />
            <ExternalKnowledgeSection
              table="birthday_packages"
              title="Paquetes de Cumpleaños"
              description="Información interna de cada paquete de cumpleaños"
              nameField="title"
              icon={Cake}
            />
            <ExternalKnowledgeSection
              table="menu_items"
              title="Menú de Alimentos"
              description="Información interna de cada producto del menú"
              nameField="title"
              icon={UtensilsCrossed}
            />
            <ExternalKnowledgeSection
              table="promotions"
              title="Promociones"
              description="Información interna de cada promoción"
              nameField="title"
              icon={Tag}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

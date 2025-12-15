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
import { Plus, Edit, Trash2, Home, HelpCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  created_at: string
  updated_at?: string
}

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
    fetchFAQs()
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

  const fetchFAQs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order', { ascending: true })

      if (error) {
        console.error('Error fetching FAQs:', error)
        setError('No se pudieron cargar las preguntas frecuentes')
      } else {
        setFaqs(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setError('No se pudieron cargar las preguntas frecuentes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta pregunta frecuente?')) return

    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id)

      if (error) {
        console.error('Error deleting FAQ:', error)
        toast.error('Error al eliminar la pregunta')
      } else {
        setFaqs(faqs.filter((faq) => faq.id !== id))
        toast.success('Pregunta eliminada correctamente')
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al eliminar la pregunta')
    }
  }

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex((faq) => faq.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= faqs.length) return

    const updatedFaqs = [...faqs]
    const [moved] = updatedFaqs.splice(currentIndex, 1)
    updatedFaqs.splice(newIndex, 0, moved)

    // Actualizar el orden en la base de datos
    try {
      const updates = updatedFaqs.map((faq, index) => ({
        id: faq.id,
        order: index
      }))

      for (const update of updates) {
        await supabase
          .from('faqs')
          .update({ order: update.order })
          .eq('id', update.id)
      }

      setFaqs(updatedFaqs)
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
                Preguntas Frecuentes
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/faq/new">
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
              <CardTitle>Listado de Preguntas Frecuentes</CardTitle>
              <CardDescription>
                Administra las preguntas frecuentes que aparecen en el sitio
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
              ) : faqs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay preguntas frecuentes. Agrega la primera.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Orden</TableHead>
                      <TableHead>Pregunta</TableHead>
                      <TableHead className="max-w-md">Respuesta</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faqs.map((faq, index) => (
                      <TableRow key={faq.id}>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleReorder(faq.id, 'up')}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleReorder(faq.id, 'down')}
                              disabled={index === faqs.length - 1}
                            >
                              ↓
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{faq.question}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {faq.answer}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/admin/faq/${faq.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(faq.id)}
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


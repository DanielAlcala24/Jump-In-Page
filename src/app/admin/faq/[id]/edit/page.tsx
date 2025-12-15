'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save } from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  order: number
}

export default function EditFAQPage() {
  const [faq, setFaq] = useState<FAQ | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingFAQ, setLoadingFAQ] = useState(true)
  const [error, setError] = useState('')

  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const faqId = params.id as string

  useEffect(() => {
    if (faqId) {
      fetchFAQ()
    }
  }, [faqId])

  const fetchFAQ = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('id', faqId)
        .single()

      if (error || !data) {
        setError('Pregunta no encontrada')
        return
      }

      setFaq(data as FAQ)
      setQuestion(data.question || '')
      setAnswer(data.answer || '')
    } catch (err) {
      console.error('Error fetching FAQ:', err)
      setError('Error al cargar la pregunta')
    } finally {
      setLoadingFAQ(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!question.trim() || !answer.trim()) {
      setError('La pregunta y la respuesta son obligatorias')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('faqs')
        .update({
          question: question.trim(),
          answer: answer.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', faqId)

      if (error) {
        setError(error.message)
      } else {
        router.push('/admin/faq')
      }
    } catch (err) {
      console.error('Error inesperado:', err)
      setError('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (loadingFAQ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Cargando pregunta...</p>
        </div>
      </div>
    )
  }

  if (!faq) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>No se encontró la pregunta solicitada.</p>
          <Link href="/admin/faq" className="mt-4 inline-block">
            <Button>Volver al listado</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4">
            <Link href="/admin/faq">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Pregunta Frecuente</h1>
              <p className="text-sm text-gray-600">
                Actualiza los detalles de la pregunta seleccionada
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Pregunta</CardTitle>
            <CardDescription>Modifica los detalles necesarios</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question">Pregunta *</Label>
                <Input
                  id="question"
                  type="text"
                  placeholder="Ej: ¿Hay un límite de edad para saltar?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Respuesta *</Label>
                <Textarea
                  id="answer"
                  placeholder="Escribe la respuesta completa a la pregunta..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-4">
                <Link href="/admin/faq">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Actualizando...' : 'Actualizar Pregunta'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


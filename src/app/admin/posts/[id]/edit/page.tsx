'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import MediaSelector from '@/components/admin/media-selector'

export default function EditPostPage() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingPost, setLoadingPost] = useState(true)
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single()

        if (error) {
          console.error('Error fetching post:', error)
          setError('Post no encontrado')
        } else if (data) {
          setTitle(data.title || '')
          setSlug(data.slug || '')
          setDescription(data.description || '')
          setCoverImage(data.cover_image || '')
          setContent(data.content || '')
        }
      } catch (err) {
        console.error('Error:', err)
        setError('Error al cargar el post')
      } finally {
        setLoadingPost(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, supabase])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setSlug(generateSlug(newTitle))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!title || !slug || !description) {
      setError('Título, slug y descripción son obligatorios')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title,
          slug,
          description,
          cover_image: coverImage || '/assets/g1.jpg',
          content: content || description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId)

      if (error) {
        setError(error.message)
      } else {
        router.push('/admin/posts')
      }
    } catch (err) {
      setError('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Cargando post...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin/posts">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Editar Post</h1>
                <p className="text-sm text-gray-600">Modificar el artículo del blog</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle>Información del Post</CardTitle>
              <CardDescription>
                Modifica los detalles del artículo del blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Título del artículo"
                      value={title}
                      onChange={handleTitleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      type="text"
                      placeholder="titulo-del-articulo"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      URL amigable generada automáticamente
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    placeholder="Breve descripción del artículo"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage">Imagen de Portada</Label>
                  <MediaSelector
                    value={coverImage}
                    onSelect={(url) => setCoverImage(url)}
                    label="Seleccionar Imagen de Multimedia"
                  />
                  <p className="text-xs text-gray-500">
                    Selecciona una imagen de tu biblioteca de multimedia. Si está vacío, se usará una imagen por defecto.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenido</Label>
                  <Textarea
                    id="content"
                    placeholder="Contenido completo del artículo..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                  />
                  <p className="text-xs text-gray-500">
                    Si está vacío, se usará la descripción como contenido.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end space-x-4">
                  <Link href="/admin/posts">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Guardando...' : 'Actualizar Post'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


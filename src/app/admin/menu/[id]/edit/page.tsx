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
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import MediaSelector from '@/components/admin/media-selector'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const DEFAULT_CATEGORIES = ['Alimentos', 'Bebidas', 'Snacks', 'Dulces']

interface MenuItem {
  id: string
  title: string
  description: string
  price: string
  category: string
  image_url: string
  image_hint?: string
}

export default function EditMenuItemPage() {
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0])
  const [imageUrl, setImageUrl] = useState('')
  const [imageHint, setImageHint] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingItem, setLoadingItem] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const itemId = params.id as string

  useEffect(() => {
    if (itemId) {
      fetchMenuItem()
    }
  }, [itemId])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('category')

        if (!error && data) {
          const unique = Array.from(
            new Set(
              data
                .map((item) => item.category)
                .filter((cat): cat is string => Boolean(cat))
            )
          )
          // Combinar categorías existentes con las predeterminadas
          const allCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...unique]))
          setCategories(allCategories)

          // Si la categoría actual del platillo no está en la lista, asegurarse de que esté
          if (category && !allCategories.includes(category)) {
            setCategories([...allCategories, category])
          }
        } else {
          setCategories(DEFAULT_CATEGORIES)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setCategories(DEFAULT_CATEGORIES)
      }
    }

    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const trimmedName = newCategoryName.trim()
      if (!categories.includes(trimmedName)) {
        setCategories([...categories, trimmedName])
      }
      setCategory(trimmedName)
      setNewCategoryName('')
      setShowNewCategory(false)
    }
  }

  const fetchMenuItem = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', itemId)
        .single()

      if (error || !data) {
        setError('Platillo no encontrado')
        return
      }

      setMenuItem(data as MenuItem)
      const itemCategory = data.category || DEFAULT_CATEGORIES[0]
      setTitle(data.title || '')
      setDescription(data.description || '')
      setPrice(data.price || '')
      setCategory(itemCategory)
      setImageUrl(data.image_url || '')
      setImageHint(data.image_hint || '')

      // Asegurarse de que la categoría del platillo esté en la lista
      setCategories((prevCategories) => {
        if (itemCategory && !prevCategories.includes(itemCategory)) {
          return [...prevCategories, itemCategory]
        }
        return prevCategories
      })
    } catch (err) {
      console.error('Error fetching menu item:', err)
      setError('Error al cargar el platillo')
    } finally {
      setLoadingItem(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title || !description || !price || !category) {
      setError('Todos los campos obligatorios deben estar completos')
      return
    }

    setLoading(true)
    try {
      // 1. Asegurarse de que la categoría exista en la tabla de categorías
      const { data: catExists } = await supabase
        .from('menu_categories')
        .select('id')
        .eq('name', category)

      if (!catExists || catExists.length === 0) {
        const { data: maxCat } = await supabase
          .from('menu_categories')
          .select('order_index')
          .order('order_index', { ascending: false })
          .limit(1)

        const newCatOrder = maxCat && maxCat.length > 0 ? (maxCat[0].order_index + 10) : 0

        await supabase.from('menu_categories').insert([{
          name: category,
          order_index: newCatOrder
        }])
      }

      const { error } = await supabase
        .from('menu_items')
        .update({
          title,
          description,
          price,
          category,
          image_url: imageUrl,
          image_hint: imageHint,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)

      if (error) {
        setError(error.message)
      } else {
        router.push('/admin/menu')
      }
    } catch (err) {
      setError('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (loadingItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Cargando platillo...</p>
        </div>
      </div>
    )
  }

  if (!menuItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>No se encontró el platillo solicitado.</p>
          <Link href="/admin/menu" className="mt-4 inline-block">
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
            <Link href="/admin/menu">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Platillo</h1>
              <p className="text-sm text-gray-600">
                Actualiza los detalles del platillo seleccionado
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Información del Platillo</CardTitle>
            <CardDescription>Modifica los detalles necesarios</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Nombre *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Nombre del platillo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    type="text"
                    placeholder="$0.00 MXN"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  {!showNewCategory ? (
                    <div className="space-y-2">
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowNewCategory(true)}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Nueva Categoría
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nombre de la nueva categoría"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleCreateCategory()
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setShowNewCategory(false)
                            setNewCategoryName('')
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={!newCategoryName.trim()}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Categoría
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageHint">Hint de la Imagen</Label>
                  <Input
                    id="imageHint"
                    type="text"
                    placeholder="Descripción corta para IA/SEO"
                    value={imageHint}
                    onChange={(e) => setImageHint(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción del platillo"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Imagen del Platillo</Label>
                <MediaSelector
                  value={imageUrl}
                  onSelect={(url) => setImageUrl(url)}
                  label="Seleccionar Imagen"
                />
                <p className="text-xs text-gray-500">
                  Puedes seleccionar una imagen existente o subir una nueva.
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-4">
                <Link href="/admin/menu">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Actualizando...' : 'Actualizar Platillo'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


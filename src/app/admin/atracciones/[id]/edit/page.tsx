'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Checkbox } from '@/components/ui/checkbox'

const DEFAULT_CATEGORIES = [
  'Atracciones Exclusivas',
  'Trampolines',
  'Atracciones para los más pequeños',
  'Atracciones extremas'
]

interface Branch {
  id: string
  name: string
  is_active: boolean
}

interface Attraction {
  id: string
  name: string
  category: string
  available_in: string[]
  image_url: string
  image_hint?: string
}

export default function EditAttractionPage() {
  const [attraction, setAttraction] = useState<Attraction | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0])
  const [availableIn, setAvailableIn] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [imageHint, setImageHint] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingItem, setLoadingItem] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [branches, setBranches] = useState<Branch[]>([])
  const [loadingBranches, setLoadingBranches] = useState(true)

  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const attractionId = params.id as string

  useEffect(() => {
    if (attractionId) {
      fetchAttraction()
    }
  }, [attractionId])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('attractions')
          .select('category')

        if (!error && data) {
          const unique = Array.from(
            new Set(
              data
                .map((item) => item.category)
                .filter((cat): cat is string => Boolean(cat))
            )
          )
          const allCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...unique]))
          setCategories(allCategories)
          
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

    const fetchBranches = async () => {
      try {
        const { data, error } = await supabase
          .from('branches')
          .select('id, name, is_active')
          .eq('is_active', true)
          .order('name', { ascending: true })

        if (!error && data) {
          setBranches(data || [])
        }
      } catch (err) {
        console.error('Error fetching branches:', err)
      } finally {
        setLoadingBranches(false)
      }
    }

    fetchCategories()
    fetchBranches()
  }, [supabase, category])

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

  const handleSucursalToggle = (sucursal: string) => {
    setAvailableIn((prev) => {
      if (prev.includes(sucursal)) {
        return prev.filter((s) => s !== sucursal)
      } else {
        return [...prev, sucursal]
      }
    })
  }

  const fetchAttraction = async () => {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .eq('id', attractionId)
        .single()

      if (error || !data) {
        setError('Atracción no encontrada')
        return
      }

      setAttraction(data as Attraction)
      const itemCategory = data.category || DEFAULT_CATEGORIES[0]
      setName(data.name || '')
      setCategory(itemCategory)
      setAvailableIn(data.available_in || [])
      setImageUrl(data.image_url || '')
      setImageHint(data.image_hint || '')
      
      setCategories((prevCategories) => {
        if (itemCategory && !prevCategories.includes(itemCategory)) {
          return [...prevCategories, itemCategory]
        }
        return prevCategories
      })
    } catch (err) {
      console.error('Error fetching attraction:', err)
      setError('Error al cargar la atracción')
    } finally {
      setLoadingItem(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !category || availableIn.length === 0 || !imageUrl) {
      setError('Todos los campos obligatorios deben estar completos, incluyendo al menos una sucursal')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('attractions')
        .update({
          name,
          category,
          available_in: availableIn,
          image_url: imageUrl,
          image_hint: imageHint || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', attractionId)

      if (error) {
        setError(error.message)
      } else {
        router.push('/admin/atracciones')
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
          <p>Cargando atracción...</p>
        </div>
      </div>
    )
  }

  if (!attraction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>No se encontró la atracción solicitada.</p>
          <Link href="/admin/atracciones" className="mt-4 inline-block">
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
            <Link href="/admin/atracciones">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Atracción</h1>
              <p className="text-sm text-gray-600">
                Actualiza los detalles de la atracción seleccionada
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Atracción</CardTitle>
            <CardDescription>Modifica los detalles necesarios</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Atracción *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ej: Climbing Wall"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                <Label>Sucursales Disponibles *</Label>
                <p className="text-xs text-gray-500 mb-3">
                  Selecciona las sucursales donde está disponible esta atracción
                </p>
                {loadingBranches ? (
                  <p className="text-sm text-gray-500">Cargando sucursales...</p>
                ) : branches.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No hay sucursales activas. <Link href="/admin/sucursales/new" className="underline">Crea una sucursal primero</Link>.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {branches.map((branch) => (
                        <div key={branch.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`sucursal-${branch.id}`}
                            checked={availableIn.includes(branch.name)}
                            onCheckedChange={() => handleSucursalToggle(branch.name)}
                          />
                          <Label
                            htmlFor={`sucursal-${branch.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {branch.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {availableIn.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Debes seleccionar al menos una sucursal
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label>Imagen de la Atracción *</Label>
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
                <Link href="/admin/atracciones">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Actualizando...' : 'Actualizar Atracción'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


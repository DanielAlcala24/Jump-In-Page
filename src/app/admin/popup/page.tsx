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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Home, Save, X, Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import MediaSelectorMultiple from '@/components/admin/media-selector-multiple'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PopupImage {
  id?: string
  image_url: string
  order_index: number
  is_active: boolean
}

interface PopupConfig {
  is_active: boolean
  images: string[] // We'll keep this for compatibility with the UI logic
  rawImages: PopupImage[] // We'll use this to track DB rows
}

export default function PopupAdminPage() {
  const [config, setConfig] = useState<PopupConfig>({
    is_active: false,
    images: [],
    rawImages: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
    fetchConfig()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/admin/login')
      return
    }
    setUser(user)
  }

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('popup_config')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error fetching popup config:', error)
        setError('No se pudo cargar la configuración del popup')
      } else {
        if (data && data.length > 0) {
          // If the first row still has the old 'images' array, we might be in transition
          // But our SQL migration should have handled it.
          // Let's check if we have multiple rows with image_url
          const hasImageUrls = data.some(row => row.image_url)

          if (hasImageUrls) {
            // New structure: multiple rows
            const imageRows = data.filter(row => row.image_url)
            setConfig({
              is_active: imageRows[0]?.is_active || false,
              images: imageRows.map(row => row.image_url),
              rawImages: imageRows
            })
          } else if (data[0].images && data[0].images.length > 0) {
            // Old structure: single row with array
            setConfig({
              is_active: data[0].is_active || false,
              images: data[0].images || [],
              rawImages: []
            })
          } else {
            setConfig({
              is_active: data[0]?.is_active || false,
              images: [],
              rawImages: []
            })
          }
        } else {
          setConfig({
            is_active: false,
            images: [],
            rawImages: []
          })
        }
      }
    } catch (err) {
      console.error('Error:', err)
      setError('No se pudo cargar la configuración del popup')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = (checked: boolean) => {
    setConfig(prev => ({ ...prev, is_active: checked }))
  }

  const handleAddImage = (url: string) => {
    if (!url || config.images.includes(url)) {
      return
    }
    setConfig(prev => ({
      ...prev,
      images: [...prev.images, url]
    }))
  }

  const handleRemoveImage = (index: number) => {
    setConfig(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleMoveImage = (index: number, direction: 'prev' | 'next') => {
    const newImages = [...config.images]
    const targetIndex = direction === 'prev' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newImages.length) return

    const [movedItem] = newImages.splice(index, 1)
    newImages.splice(targetIndex, 0, movedItem)

    setConfig(prev => ({ ...prev, images: newImages }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (config.images.length === 0 && config.is_active) {
        setError('Debes agregar al menos una imagen para activar el popup')
        setSaving(false)
        return
      }

      // 1. Get current IDs to know what to delete
      const currentIds = config.rawImages.map(img => img.id).filter(Boolean) as string[]

      // 2. Prepare data for all images
      const imagesToSave = config.images.map((url, index) => ({
        image_url: url,
        order_index: index,
        is_active: config.is_active,
        updated_at: new Date().toISOString()
      }))

      // To keep it simple and robust, we'll delete existing rows and insert new ones
      // This avoids complex diffing for this specific small config
      const { error: deleteError } = await supabase
        .from('popup_config')
        .delete()
        .not('id', 'is', null) // Delete all rows

      if (deleteError) throw deleteError

      if (imagesToSave.length > 0) {
        const { error: insertError } = await supabase
          .from('popup_config')
          .insert(imagesToSave)

        if (insertError) throw insertError
      } else {
        // If no images, we still need at least one row to store the is_active state?
        // Actually, if there are no images, the popup won't show anyway.
        // But for consistency let's insert a dummy row if we want to preserve the active state
        const { error: insertError } = await supabase
          .from('popup_config')
          .insert([{
            is_active: config.is_active,
            images: [], // Keep array for backwards compat in first row
            updated_at: new Date().toISOString()
          }])

        if (insertError) throw insertError
      }

      await fetchConfig()
      toast.success('Configuración del popup guardada correctamente')
    } catch (err: any) {
      console.error('Error saving popup config:', err)
      setError(err.message || 'Error al guardar la configuración')
      toast.error('Error al guardar la configuración')
    } finally {
      setSaving(false)
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
              <h1 className="text-2xl font-bold text-gray-900">Configuración del Popup</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p>Cargando configuración...</p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Gestión del Popup del Sitio Web</CardTitle>
                <CardDescription>
                  Activa o desactiva el popup y selecciona las imágenes que se mostrarán cuando los visitantes ingresen al sitio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Toggle para activar/desactivar popup */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="popup-active" className="text-base font-semibold">
                      Activar Popup
                    </Label>
                    <p className="text-sm text-gray-500">
                      Cuando esté activo, el popup aparecerá cuando los visitantes ingresen al sitio web
                    </p>
                  </div>
                  <Switch
                    id="popup-active"
                    checked={config.is_active}
                    onCheckedChange={handleToggleActive}
                  />
                </div>

                {/* Selector de imágenes */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">Imágenes del Popup</Label>
                      <p className="text-sm text-gray-500">
                        Selecciona una o más imágenes para mostrar en el popup. Puedes agregar múltiples imágenes.
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <MediaSelectorMultiple
                      onSelect={handleAddImage}
                      label="Agregar Imagen"
                    />
                  </div>

                  {/* Lista de imágenes seleccionadas */}
                  {config.images.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Imágenes Seleccionadas ({config.images.length})
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {config.images.map((imageUrl, index) => (
                          <div
                            key={index}
                            className="relative group border rounded-lg overflow-hidden bg-gray-100 transition-all hover:ring-2 hover:ring-orange-500"
                          >
                            <div className="aspect-video relative">
                              <Image
                                src={imageUrl}
                                alt={`Popup image ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>

                            {/* Reordering Controls */}
                            <div className="absolute top-2 left-2 flex gap-1">
                              <Button
                                variant="secondary"
                                size="icon"
                                className={`h-7 w-7 bg-white/90 hover:bg-white text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity ${index === 0 ? 'hidden' : ''}`}
                                onClick={() => handleMoveImage(index, 'prev')}
                                title="Mover anterior"
                              >
                                <ArrowLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="icon"
                                className={`h-7 w-7 bg-white/90 hover:bg-white text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity ${index === config.images.length - 1 ? 'hidden' : ''}`}
                                onClick={() => handleMoveImage(index, 'next')}
                                title="Mover posterior"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="absolute top-2 right-2">
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                onClick={() => handleRemoveImage(index)}
                                title="Eliminar imagen"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="p-2 bg-white flex items-center justify-between">
                              <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">
                                #{index + 1}
                              </span>
                              <p className="text-xs text-gray-600 truncate flex-1 ml-2" title={imageUrl}>
                                {imageUrl.split('/').pop()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {config.images.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border rounded-lg">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay imágenes seleccionadas</p>
                      <p className="text-xs mt-2">Usa el selector de arriba para agregar imágenes</p>
                    </div>
                  )}
                </div>

                {/* Botón de guardar */}
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    onClick={handleSave}
                    disabled={saving || (config.is_active && config.images.length === 0)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar Configuración'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

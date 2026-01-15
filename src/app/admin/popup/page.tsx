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
import { Home, Save, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import MediaSelectorMultiple from '@/components/admin/media-selector-multiple'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PopupConfig {
  id?: string
  is_active: boolean
  images: string[]
}

export default function PopupAdminPage() {
  const [config, setConfig] = useState<PopupConfig>({
    is_active: false,
    images: []
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
        .single()

      if (error) {
        // Si no existe la configuración, crear una por defecto
        if (error.code === 'PGRST116') {
          setConfig({
            is_active: false,
            images: []
          })
        } else {
          console.error('Error fetching popup config:', error)
          setError('No se pudo cargar la configuración del popup')
        }
      } else {
        setConfig({
          id: data.id,
          is_active: data.is_active || false,
          images: data.images || []
        })
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

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (config.images.length === 0 && config.is_active) {
        setError('Debes agregar al menos una imagen para activar el popup')
        setSaving(false)
        return
      }

      const dataToSave = {
        is_active: config.is_active,
        images: config.images,
        updated_at: new Date().toISOString()
      }

      if (config.id) {
        // Actualizar configuración existente
        const { error: updateError } = await supabase
          .from('popup_config')
          .update(dataToSave)
          .eq('id', config.id)

        if (updateError) {
          throw updateError
        }
      } else {
        // Crear nueva configuración
        const { data, error: insertError } = await supabase
          .from('popup_config')
          .insert([{
            ...dataToSave,
            created_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (insertError) {
          throw insertError
        }

        setConfig(prev => ({ ...prev, id: data.id }))
      }

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
                            className="relative group border rounded-lg overflow-hidden bg-gray-100"
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
                            <div className="absolute top-2 right-2">
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="p-2 bg-white">
                              <p className="text-xs text-gray-600 truncate" title={imageUrl}>
                                Imagen {index + 1}
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

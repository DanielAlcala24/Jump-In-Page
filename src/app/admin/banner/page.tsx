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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Home, Save, PanelTop, X, Monitor, Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import MediaSelector from '@/components/admin/media-selector'

const DEFAULT_DESKTOP_MAX_HEIGHT = 200

interface BannerConfig {
  id?: string
  is_active: boolean
  image_url: string
  image_width: number | null
  image_height: number | null
  mobile_image_url: string
  mobile_image_width: number | null
  mobile_image_height: number | null
  desktop_max_height: number
  image_alt: string
  link_url: string
  is_dismissible: boolean
}

const EMPTY_CONFIG: BannerConfig = {
  is_active: false,
  image_url: '',
  image_width: null,
  image_height: null,
  mobile_image_url: '',
  mobile_image_width: null,
  mobile_image_height: null,
  desktop_max_height: DEFAULT_DESKTOP_MAX_HEIGHT,
  image_alt: '',
  link_url: '',
  is_dismissible: true
}

export default function BannerAdminPage() {
  const [config, setConfig] = useState<BannerConfig>(EMPTY_CONFIG)
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
        .from('banner_config')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('Error fetching banner config:', error)
        setError('No se pudo cargar la configuración del banner. ¿Ya ejecutaste supabase-banner-setup.sql?')
        return
      }

      const row = data?.[0]
      if (row) {
        setConfig({
          id: row.id,
          is_active: row.is_active ?? false,
          image_url: row.image_url || '',
          image_width: row.image_width ?? null,
          image_height: row.image_height ?? null,
          mobile_image_url: row.mobile_image_url || '',
          mobile_image_width: row.mobile_image_width ?? null,
          mobile_image_height: row.mobile_image_height ?? null,
          desktop_max_height: row.desktop_max_height || DEFAULT_DESKTOP_MAX_HEIGHT,
          image_alt: row.image_alt || '',
          link_url: row.link_url || '',
          is_dismissible: row.is_dismissible ?? true
        })
      } else {
        setConfig(EMPTY_CONFIG)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('No se pudo cargar la configuración del banner')
    } finally {
      setLoading(false)
    }
  }

  // Guardamos las dimensiones reales para reservar el espacio del banner en el sitio
  const readImageSize = (url: string): Promise<{ width: number; height: number } | null> =>
    new Promise((resolve) => {
      const img = document.createElement('img')
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = () => resolve(null)
      img.src = url
    })

  const handleSelectImage = async (target: 'desktop' | 'mobile', url: string) => {
    const urlKey = target === 'desktop' ? 'image_url' : 'mobile_image_url'
    const widthKey = target === 'desktop' ? 'image_width' : 'mobile_image_width'
    const heightKey = target === 'desktop' ? 'image_height' : 'mobile_image_height'

    setConfig(prev => ({ ...prev, [urlKey]: url, [widthKey]: null, [heightKey]: null }))
    if (!url) return

    const size = await readImageSize(url)
    if (size) {
      setConfig(prev =>
        prev[urlKey] === url
          ? { ...prev, [widthKey]: size.width, [heightKey]: size.height }
          : prev
      )
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (config.is_active && !config.image_url && !config.mobile_image_url) {
        setError('Debes seleccionar al menos una imagen (PC o móvil) para activar el banner')
        setSaving(false)
        return
      }

      const linkUrl = config.link_url.trim()
      if (linkUrl && !/^(https?:\/\/|\/)/i.test(linkUrl)) {
        setError('El enlace debe empezar con "/" (página del sitio) o con "https://" (sitio externo)')
        setSaving(false)
        return
      }

      const payload = {
        is_active: config.is_active,
        image_url: config.image_url || null,
        image_width: config.image_width,
        image_height: config.image_height,
        mobile_image_url: config.mobile_image_url || null,
        mobile_image_width: config.mobile_image_width,
        mobile_image_height: config.mobile_image_height,
        desktop_max_height: config.desktop_max_height || DEFAULT_DESKTOP_MAX_HEIGHT,
        image_alt: config.image_alt.trim() || null,
        link_url: linkUrl || null,
        is_dismissible: config.is_dismissible,
        updated_at: new Date().toISOString()
      }

      if (config.id) {
        const { error: updateError } = await supabase
          .from('banner_config')
          .update(payload)
          .eq('id', config.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('banner_config')
          .insert([payload])

        if (insertError) throw insertError
      }

      await fetchConfig()
      toast.success('Banner guardado correctamente')
    } catch (err: any) {
      console.error('Error saving banner config:', err)
      setError(err.message || 'Error al guardar la configuración')
      toast.error('Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveBanner = async () => {
    setConfig(prev => ({
      ...prev,
      is_active: false,
      image_url: '',
      image_width: null,
      image_height: null,
      mobile_image_url: '',
      mobile_image_width: null,
      mobile_image_height: null,
      image_alt: '',
      link_url: ''
    }))
    toast.info('Banner limpiado. Guarda los cambios para aplicarlo en el sitio.')
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  const hasAnyImage = !!config.image_url || !!config.mobile_image_url
  // Sin imagen de PC: en escritorio se usa la de móvil centrada, con franjas negras
  const isPillarbox = !config.image_url && !!config.mobile_image_url
  const desktopPreviewUrl = config.image_url || config.mobile_image_url
  const mobilePreviewUrl = config.mobile_image_url || config.image_url

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
              <h1 className="text-2xl font-bold text-gray-900">Banner Superior</h1>
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
                <CardTitle>Banner de la Página de Inicio</CardTitle>
                <CardDescription>
                  Muestra una imagen de ancho completo en la parte superior de la página de inicio, arriba del menú.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Activar / desactivar */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="banner-active" className="text-base font-semibold">
                      Mostrar banner
                    </Label>
                    <p className="text-sm text-gray-500">
                      Cuando está activo, el banner aparece arriba de todo en la página de inicio
                    </p>
                  </div>
                  <Switch
                    id="banner-active"
                    checked={config.is_active}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, is_active: checked }))}
                  />
                </div>

                {/* Imagen para PC */}
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-gray-500" />
                    <Label className="text-base font-semibold">Imagen para PC (escritorio)</Label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Se muestra a lo ancho completo conservando su proporción. Usa una imagen horizontal tipo
                    franja (por ejemplo 1920 × 200 px) para que no se vea enorme en pantallas grandes.
                  </p>
                  <MediaSelector
                    value={config.image_url}
                    onSelect={(url) => handleSelectImage('desktop', url)}
                    label="Seleccionar Imagen para PC"
                  />
                  {config.image_width && config.image_height && (
                    <p className="text-xs text-gray-500">
                      Dimensiones detectadas: {config.image_width} × {config.image_height} px
                    </p>
                  )}
                </div>

                {/* Imagen para móvil */}
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-gray-500" />
                    <Label className="text-base font-semibold">Imagen para móvil</Label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Se usa en pantallas menores a 768 px. Si la dejas vacía, se usa la imagen de PC en todos
                    los dispositivos.
                  </p>
                  <MediaSelector
                    value={config.mobile_image_url}
                    onSelect={(url) => handleSelectImage('mobile', url)}
                    label="Seleccionar Imagen para Móvil"
                  />
                  {config.mobile_image_width && config.mobile_image_height && (
                    <p className="text-xs text-gray-500">
                      Dimensiones detectadas: {config.mobile_image_width} × {config.mobile_image_height} px
                    </p>
                  )}
                </div>

                {/* Alto máximo en PC: solo aplica cuando no hay imagen de escritorio */}
                {isPillarbox && (
                  <div className="space-y-2 p-4 border rounded-lg bg-amber-50 border-amber-200">
                    <Label htmlFor="banner-max-height" className="text-base font-semibold">
                      Alto máximo en PC
                    </Label>
                    <p className="text-sm text-gray-700">
                      No hay imagen para PC, así que en pantallas grandes se mostrará la imagen de móvil
                      centrada y con franjas negras a los costados. Este valor limita qué tan alta se ve.
                    </p>
                    <div className="flex items-center gap-2">
                      <Input
                        id="banner-max-height"
                        type="number"
                        min={60}
                        max={600}
                        value={config.desktop_max_height}
                        onChange={(e) =>
                          setConfig(prev => ({
                            ...prev,
                            desktop_max_height: Number(e.target.value) || DEFAULT_DESKTOP_MAX_HEIGHT
                          }))
                        }
                        className="w-32"
                      />
                      <span className="text-sm text-gray-600">píxeles</span>
                    </div>
                  </div>
                )}

                {/* Texto alternativo */}
                <div className="space-y-2">
                  <Label htmlFor="banner-alt" className="text-base font-semibold">
                    Texto alternativo <span className="font-normal text-gray-500">(opcional)</span>
                  </Label>
                  <p className="text-sm text-gray-500">
                    Describe la imagen para buscadores y lectores de pantalla. Ej: &quot;Promoción 2x1 en martes&quot;
                  </p>
                  <Input
                    id="banner-alt"
                    value={config.image_alt}
                    onChange={(e) => setConfig(prev => ({ ...prev, image_alt: e.target.value }))}
                    placeholder="Promoción de verano en Jump-In"
                  />
                </div>

                {/* Enlace */}
                <div className="space-y-2">
                  <Label htmlFor="banner-link" className="text-base font-semibold">
                    Enlace al hacer clic <span className="font-normal text-gray-500">(opcional)</span>
                  </Label>
                  <p className="text-sm text-gray-500">
                    Usa una ruta del sitio (ej. <code>/precios-y-promociones</code>) o una URL completa
                    (ej. <code>https://...</code>, se abre en una pestaña nueva). Déjalo vacío si el banner no debe ser clicable.
                  </p>
                  <Input
                    id="banner-link"
                    value={config.link_url}
                    onChange={(e) => setConfig(prev => ({ ...prev, link_url: e.target.value }))}
                    placeholder="/precios-y-promociones"
                  />
                </div>

                {/* Botón de cerrar */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="banner-dismissible" className="text-base font-semibold">
                      Permitir cerrar el banner
                    </Label>
                    <p className="text-sm text-gray-500">
                      Muestra una &quot;✕&quot; para que el visitante lo oculte. No vuelve a aparecer durante esa visita.
                    </p>
                  </div>
                  <Switch
                    id="banner-dismissible"
                    checked={config.is_dismissible}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, is_dismissible: checked }))}
                  />
                </div>

                {/* Vista previa */}
                {hasAnyImage && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">Vista previa</Label>
                      <p className="text-sm text-gray-500">
                        Aproximada: en el sitio real el ancho es el de la pantalla completa.
                      </p>
                    </div>

                    {/* PC */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Monitor className="h-4 w-4" />
                        En PC
                      </div>
                      <div className="border rounded-lg overflow-hidden bg-gray-900">
                        <div className="relative bg-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={desktopPreviewUrl}
                            alt={config.image_alt || 'Vista previa del banner en PC'}
                            className={isPillarbox ? 'block mx-auto h-auto w-auto max-w-full' : 'block w-full h-auto'}
                            style={isPillarbox ? { maxHeight: `${config.desktop_max_height}px` } : undefined}
                          />
                          {config.is_dismissible && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white">
                              <X className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 text-white/80">
                          <PanelTop className="h-4 w-4" />
                          <span className="text-xs">Aquí abajo continúa el sitio (logo, menú y video)</span>
                        </div>
                      </div>
                    </div>

                    {/* Móvil */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Smartphone className="h-4 w-4" />
                        En móvil
                      </div>
                      <div className="border rounded-lg overflow-hidden bg-gray-900 max-w-[375px]">
                        <div className="relative bg-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={mobilePreviewUrl}
                            alt={config.image_alt || 'Vista previa del banner en móvil'}
                            className="block w-full h-auto"
                          />
                          {config.is_dismissible && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white">
                              <X className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 text-white/80">
                          <PanelTop className="h-4 w-4" />
                          <span className="text-xs">Sigue el sitio</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleRemoveBanner}
                    disabled={saving || !hasAnyImage}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Quitar banner
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
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

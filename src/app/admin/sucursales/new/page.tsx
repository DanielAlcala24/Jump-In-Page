'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { ArrowLeft, Save, Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import MediaSelector from '@/components/admin/media-selector'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'


interface Price {
  title: string
  price: string
  description: string
  image: string
}

interface Attraction {
  name: string
  image: string
}

interface GalleryItem {
  src: string
  alt: string
}

export default function NewBranchPage() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [state, setState] = useState('')
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [newStateName, setNewStateName] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [address, setAddress] = useState('')
  const [mapLink, setMapLink] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [horarios, setHorarios] = useState<string[]>([''])
  const [prices, setPrices] = useState<Price[]>([{ title: '', price: '', description: '', image: '' }])
  const [attractions, setAttractions] = useState<Attraction[]>([{ name: '', image: '' }])
  const [gallery, setGallery] = useState<GalleryItem[]>([{ src: '', alt: '' }])
  const [featuredImage, setFeaturedImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStates, setLoadingStates] = useState(true)
  const [error, setError] = useState('')
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    basic: true,
    location: false,
    contact: false,
    schedule: false,
    prices: false,
    attractions: false,
    gallery: false,
    states: false
  })

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAvailableStates()
  }, [])

  const fetchAvailableStates = async () => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('state')
        .not('state', 'is', null)

      if (error) {
        console.error('Error fetching states:', error)
        // Inicializar con estados por defecto si hay error
        setAvailableStates(['Estado de México', 'CDMX', 'Morelos'])
      } else {
        // Obtener estados únicos
        const uniqueStates = Array.from(new Set(data.map(b => b.state).filter(Boolean))) as string[]
        // Si no hay estados, usar los por defecto
        if (uniqueStates.length === 0) {
          setAvailableStates(['Estado de México', 'CDMX', 'Morelos'])
        } else {
          setAvailableStates(uniqueStates.sort())
        }
      }
    } catch (err) {
      console.error('Error:', err)
      setAvailableStates(['Estado de México', 'CDMX', 'Morelos'])
    } finally {
      setLoadingStates(false)
    }
  }

  const addState = () => {
    const trimmedName = newStateName.trim()
    if (trimmedName && !availableStates.includes(trimmedName)) {
      const updated = [...availableStates, trimmedName].sort()
      setAvailableStates(updated)
      setNewStateName('')
      toast.success(`Estado "${trimmedName}" agregado`)
    } else if (availableStates.includes(trimmedName)) {
      toast.error('Este estado ya existe')
    } else {
      toast.error('Por favor ingresa un nombre válido')
    }
  }

  const removeState = (stateToRemove: string) => {
    // Verificar si hay sucursales usando este estado
    const checkStateInUse = async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('id, name')
        .eq('state', stateToRemove)
        .limit(1)

      if (error) {
        console.error('Error checking state:', error)
        return false
      }

      if (data && data.length > 0) {
        toast.error(`No se puede eliminar el estado "${stateToRemove}" porque hay sucursales que lo están usando`)
        return false
      }

      return true
    }

    checkStateInUse().then(canRemove => {
      if (canRemove) {
        const updated = availableStates.filter(s => s !== stateToRemove)
        setAvailableStates(updated)
        // Si el estado eliminado es el seleccionado, limpiar la selección
        if (state === stateToRemove) {
          setState('')
        }
        toast.success(`Estado "${stateToRemove}" eliminado`)
      }
    })
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value))
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const addHorario = () => {
    setHorarios([...horarios, ''])
  }

  const removeHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index))
  }

  const updateHorario = (index: number, value: string) => {
    const updated = [...horarios]
    updated[index] = value
    setHorarios(updated)
  }

  const addPrice = () => {
    setPrices([...prices, { title: '', price: '', description: '', image: '' }])
  }

  const removePrice = (index: number) => {
    if (prices.length > 1) {
      setPrices(prices.filter((_, i) => i !== index))
    }
  }

  const updatePrice = (index: number, field: keyof Price, value: string) => {
    const updated = [...prices]
    updated[index] = { ...updated[index], [field]: value }
    setPrices(updated)
  }

  const addAttraction = () => {
    setAttractions([...attractions, { name: '', image: '' }])
  }

  const removeAttraction = (index: number) => {
    if (attractions.length > 1) {
      setAttractions(attractions.filter((_, i) => i !== index))
    }
  }

  const updateAttraction = (index: number, field: keyof Attraction, value: string) => {
    const updated = [...attractions]
    updated[index] = { ...updated[index], [field]: value }
    setAttractions(updated)
  }

  const addGalleryItem = () => {
    setGallery([...gallery, { src: '', alt: '' }])
  }

  const removeGalleryItem = (index: number) => {
    if (gallery.length > 1) {
      setGallery(gallery.filter((_, i) => i !== index))
    }
  }

  const updateGalleryItem = (index: number, field: keyof GalleryItem, value: string) => {
    const updated = [...gallery]
    updated[index] = { ...updated[index], [field]: value }
    setGallery(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !slug || !state) {
      setError('Nombre, slug y estado son campos obligatorios')
      return
    }

    setLoading(true)
    try {
      // Limpiar arrays vacíos
      const cleanedHorarios = horarios.filter(h => h.trim() !== '')
      const cleanedPrices = prices.filter(p => p.title.trim() !== '' || p.price.trim() !== '')
      const cleanedAttractions = attractions.filter(a => a.name.trim() !== '' || a.image.trim() !== '')
      const cleanedGallery = gallery.filter(g => g.src.trim() !== '')

      const branchData: any = {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        state: state.trim(),
        is_active: isActive,
        address: address.trim() || null,
        map_link: mapLink.trim() || null,
        phone: phone.trim() || null,
        whatsapp: whatsapp.trim() || null,
        horarios: cleanedHorarios.length > 0 ? cleanedHorarios : null,
        prices: cleanedPrices.length > 0 ? cleanedPrices : [],
        attractions: cleanedAttractions.length > 0 ? cleanedAttractions : [],
        gallery: cleanedGallery.length > 0 ? cleanedGallery : [],
        featured_image: featuredImage.trim() || null,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('branches')
        .insert([branchData])
        .select()

      if (error) {
        if (error.code === '23505') {
          setError('Ya existe una sucursal con ese nombre o slug')
        } else {
          setError(error.message)
        }
        console.error('Error al guardar:', error)
      } else {
        toast.success('Sucursal creada correctamente')
        router.push('/admin/sucursales')
      }
    } catch (err) {
      console.error('Error inesperado:', err)
      setError('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4">
            <Link href="/admin/sucursales">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Sucursal</h1>
              <p className="text-sm text-gray-600">Agrega una nueva sucursal con toda su información</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>Datos principales de la sucursal</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('basic')}
                >
                  {expandedSections.basic ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.basic && (
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la Sucursal *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ej: Nueva Sucursal"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      type="text"
                      placeholder="ejemplo: nueva-sucursal"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      URL amigable (solo letras minúsculas, números y guiones)
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="state"
                      type="text"
                      placeholder="Ej: Estado de México, CDMX, Morelos..."
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      list="states-list"
                      required
                    />
                    {availableStates.length > 0 && (
                      <Select value={state} onValueChange={setState} disabled={loadingStates}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="O seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStates.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Escribe el estado directamente o selecciona uno de la lista. Puedes gestionar la lista de estados en la sección "Gestión de Estados"
                  </p>
                  <datalist id="states-list">
                    {availableStates.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label>Imagen Destacada</Label>
                  <MediaSelector
                    value={featuredImage}
                    onSelect={(url) => setFeaturedImage(url)}
                    label="Seleccionar Imagen"
                  />
                  <p className="text-xs text-gray-500">
                    Imagen que aparece en la lista de sucursales
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setIsActive(checked === true)}
                  />
                  <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                    Sucursal activa (visible en el sitio público)
                  </Label>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Gestión de Estados */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestión de Estados</CardTitle>
                  <CardDescription>Agregar o eliminar estados disponibles</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('states')}
                >
                  {expandedSections.states ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.states && (
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: Jalisco, Querétaro, Nuevo León..."
                      value={newStateName}
                      onChange={(e) => setNewStateName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addState()
                        }
                      }}
                    />
                    <Button type="button" onClick={addState} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Estado
                    </Button>
                  </div>
                  {loadingStates ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Cargando estados...</p>
                    </div>
                  ) : availableStates.length > 0 ? (
                    <div className="space-y-2">
                      <Label>Estados disponibles:</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableStates.map((stateName) => (
                          <div
                            key={stateName}
                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md"
                          >
                            <span className="text-sm">{stateName}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-red-100"
                              onClick={() => removeState(stateName)}
                              title={`Eliminar estado "${stateName}"`}
                            >
                              <X className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Solo se pueden eliminar estados que no estén siendo usados por ninguna sucursal
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No hay estados disponibles. Agrega uno nuevo.</p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Ubicación */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ubicación</CardTitle>
                  <CardDescription>Dirección y mapa de la sucursal</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('location')}
                >
                  {expandedSections.location ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.location && (
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección Completa</Label>
                  <Textarea
                    id="address"
                    placeholder="Ej: Av. José López Portillo 105, San Francisco Coacalco, 55712..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mapLink">Enlace del Mapa (iframe de Google Maps)</Label>
                  <Textarea
                    id="mapLink"
                    placeholder="Pega aquí el código completo del iframe o solo el src de Google Maps"
                    value={mapLink}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Si contiene un iframe, extraer automáticamente el src
                      const iframeMatch = value.match(/<iframe[^>]+src=["']([^"']+)["']/i);
                      if (iframeMatch && iframeMatch[1]) {
                        value = iframeMatch[1];
                      }
                      setMapLink(value);
                    }}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    Puedes pegar el iframe completo o solo la URL del src. Si pegas el iframe completo, se extraerá automáticamente la URL.
                    Obtén el enlace desde Google Maps: Compartir → Insertar un mapa → Copiar el iframe o el src
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Contacto */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contacto</CardTitle>
                  <CardDescription>Teléfono y WhatsApp</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('contact')}
                >
                  {expandedSections.contact ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.contact && (
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="text"
                      placeholder="Ej: 55 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp (número completo con código de país)</Label>
                    <Input
                      id="whatsapp"
                      type="text"
                      placeholder="Ej: 525512345678"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Horarios */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Horarios</CardTitle>
                  <CardDescription>Horarios de operación de la sucursal</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('schedule')}
                >
                  {expandedSections.schedule ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.schedule && (
              <CardContent className="space-y-4">
                {horarios.map((horario, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Ej: Lunes a Viernes: 2 PM - 8 PM"
                      value={horario}
                      onChange={(e) => updateHorario(index, e.target.value)}
                    />
                    {horarios.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeHorario(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addHorario}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Horario
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Precios */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Precios</CardTitle>
                  <CardDescription>Lista de precios de la sucursal</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('prices')}
                >
                  {expandedSections.prices ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.prices && (
              <CardContent className="space-y-6">
                {prices.map((price, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Precio #{index + 1}</h4>
                      {prices.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePrice(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Título *</Label>
                        <Input
                          value={price.title}
                          onChange={(e) => updatePrice(index, 'title', e.target.value)}
                          placeholder="Ej: Salto Individual"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Precio *</Label>
                        <Input
                          value={price.price}
                          onChange={(e) => updatePrice(index, 'price', e.target.value)}
                          placeholder="Ej: $180/hr"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>Descripción</Label>
                      <Textarea
                        value={price.description}
                        onChange={(e) => updatePrice(index, 'description', e.target.value)}
                        placeholder="Descripción del precio..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>Imagen</Label>
                      <MediaSelector
                        value={price.image}
                        onSelect={(url) => updatePrice(index, 'image', url)}
                        label="Seleccionar Imagen"
                      />
                    </div>
                    {index < prices.length - 1 && <Separator className="my-4" />}
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addPrice}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Precio
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Atracciones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Atracciones</CardTitle>
                  <CardDescription>Atracciones disponibles en esta sucursal</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('attractions')}
                >
                  {expandedSections.attractions ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.attractions && (
              <CardContent className="space-y-6">
                {attractions.map((attraction, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Atracción #{index + 1}</h4>
                      {attractions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAttraction(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre *</Label>
                        <Input
                          value={attraction.name}
                          onChange={(e) => updateAttraction(index, 'name', e.target.value)}
                          placeholder="Ej: Climbing Wall"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Imagen *</Label>
                        <MediaSelector
                          value={attraction.image}
                          onSelect={(url) => updateAttraction(index, 'image', url)}
                          label="Seleccionar Imagen"
                        />
                      </div>
                    </div>
                    {index < attractions.length - 1 && <Separator className="my-4" />}
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addAttraction}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Atracción
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Galería */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Galería</CardTitle>
                  <CardDescription>Fotos de la sucursal</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('gallery')}
                >
                  {expandedSections.gallery ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.gallery && (
              <CardContent className="space-y-6">
                {gallery.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Imagen #{index + 1}</h4>
                      {gallery.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeGalleryItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>URL de la Imagen *</Label>
                        <MediaSelector
                          value={item.src}
                          onSelect={(url) => updateGalleryItem(index, 'src', url)}
                          label="Seleccionar Imagen"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Texto Alternativo (Alt)</Label>
                        <Input
                          value={item.alt}
                          onChange={(e) => updateGalleryItem(index, 'alt', e.target.value)}
                          placeholder="Descripción de la imagen"
                        />
                      </div>
                    </div>
                    {index < gallery.length - 1 && <Separator className="my-4" />}
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addGalleryItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Imagen a la Galería
                </Button>
              </CardContent>
            )}
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-4 pb-6">
            <Link href="/admin/sucursales">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Sucursal'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

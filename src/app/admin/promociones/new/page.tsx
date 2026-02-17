'use client'

import { useEffect, useState } from 'react'
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
import { ArrowLeft, Save, Plus, MapPin, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import MediaSelector from '@/components/admin/media-selector'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Branch {
  id: string
  name: string
  slug: string
  is_active: boolean
}

export default function NewPromotionPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [availableIn, setAvailableIn] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [imageHint, setImageHint] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [branches, setBranches] = useState<Branch[]>([])
  const [loadingBranches, setLoadingBranches] = useState(true)
  const [showManageSucursales, setShowManageSucursales] = useState(false)
  const [newBranchName, setNewBranchName] = useState('')
  const [newBranchSlug, setNewBranchSlug] = useState('')
  const [newBranchActive, setNewBranchActive] = useState(true)
  const [creatingBranch, setCreatingBranch] = useState(false)
  const [allBranches, setAllBranches] = useState<Branch[]>([])

  const router = useRouter()
  const supabase = createClientComponentClient()

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true)
      // Cargar solo sucursales activas para el selector
      const { data: activeBranches, error: activeError } = await supabase
        .from('branches')
        .select('id, name, slug, is_active')
        .eq('is_active', true)
        .order('name', { ascending: true })

      // Cargar todas las sucursales para la gestión
      const { data: allBranchesData, error: allError } = await supabase
        .from('branches')
        .select('id, name, slug, is_active')
        .order('name', { ascending: true })

      if (!activeError && activeBranches) {
        setBranches(activeBranches || [])
      }

      if (!allError && allBranchesData) {
        setAllBranches(allBranchesData || [])
      }
    } catch (err) {
      console.error('Error fetching branches:', err)
    } finally {
      setLoadingBranches(false)
    }
  }

  useEffect(() => {
    fetchBranches()
  }, [supabase])

  const handleSucursalToggle = (sucursal: string) => {
    setAvailableIn((prev) => {
      if (prev.includes(sucursal)) {
        return prev.filter((s) => s !== sucursal)
      } else {
        return [...prev, sucursal]
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

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) {
      toast.error('El nombre de la sucursal es obligatorio')
      return
    }

    const slugToUse = newBranchSlug.trim() || generateSlug(newBranchName)

    if (!slugToUse) {
      toast.error('El slug es obligatorio')
      return
    }

    setCreatingBranch(true)
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([
          {
            name: newBranchName.trim(),
            slug: slugToUse.toLowerCase(),
            is_active: newBranchActive,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        if (error.code === '23505') {
          toast.error('Ya existe una sucursal con ese nombre o slug')
        } else {
          toast.error('Error al crear la sucursal: ' + error.message)
        }
      } else {
        toast.success('Sucursal creada correctamente')
        const branchName = newBranchName.trim()
        const wasActive = newBranchActive
        setNewBranchName('')
        setNewBranchSlug('')
        setNewBranchActive(true)
        // Recargar las sucursales
        await fetchBranches()
        // Si la sucursal está activa, agregarla automáticamente a las seleccionadas
        if (wasActive && !availableIn.includes(branchName)) {
          setAvailableIn((prev) => [...prev, branchName])
        }
      }
    } catch (err) {
      console.error('Error inesperado:', err)
      toast.error('Ocurrió un error inesperado')
    } finally {
      setCreatingBranch(false)
    }
  }

  const handleDeleteBranch = async (id: string, name: string) => {
    // Verificar si hay promociones usando esta sucursal
    const { data: promotions } = await supabase
      .from('promotions')
      .select('id, title, available_in')

    const hasPromotions = promotions?.some(
      (promotion) =>
        promotion.available_in && promotion.available_in.includes(name)
    )

    if (hasPromotions) {
      toast.error(
        `No se puede eliminar la sucursal "${name}" porque tiene promociones asociadas. Primero actualiza o elimina esas promociones.`
      )
      return
    }

    if (!confirm(`¿Estás seguro de eliminar la sucursal "${name}"?`)) return

    try {
      const { error } = await supabase.from('branches').delete().eq('id', id)

      if (error) {
        console.error('Error deleting branch:', error)
        toast.error('Error al eliminar la sucursal')
      } else {
        toast.success('Sucursal eliminada correctamente')
        // Recargar las sucursales
        fetchBranches()
        // Remover de las seleccionadas si estaba seleccionada
        setAvailableIn((prev) => prev.filter((s) => s !== name))
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al eliminar la sucursal')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title || !description || availableIn.length === 0 || !imageUrl) {
      setError('Todos los campos obligatorios deben estar completos, incluyendo al menos una sucursal')
      return
    }

    setLoading(true)
    try {
      // Obtener el máximo order_index actual
      const { data: currentPromos } = await supabase
        .from('promotions')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = currentPromos && currentPromos.length > 0
        ? (currentPromos[0].order_index || 0) + 1
        : 0

      const dataToInsert = {
        title: title.trim(),
        description: description.trim(),
        available_in: availableIn,
        image_url: imageUrl.trim(),
        image_hint: imageHint.trim() || null,
        order_index: nextOrderIndex,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase.from('promotions').insert([dataToInsert]).select()

      if (error) {
        setError(error.message)
        console.error('Error al guardar:', error)
      } else {
        router.push('/admin/promociones')
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
            <Link href="/admin/promociones">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Promoción</h1>
              <p className="text-sm text-gray-600">Agrega una nueva promoción</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Promoción</CardTitle>
            <CardDescription>Completa los detalles de la promoción</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Ej: Martes 2x1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  placeholder="Escribe una descripción detallada de la promoción..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sucursales Disponibles *</Label>
                    <p className="text-xs text-gray-500">
                      Selecciona las sucursales donde está disponible esta promoción. Puedes seleccionar "Todas las sucursales" o sucursales específicas.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowManageSucursales(!showManageSucursales)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {showManageSucursales ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Ocultar Gestión
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Gestionar Sucursales
                      </>
                    )}
                  </Button>
                </div>
                {loadingBranches ? (
                  <p className="text-sm text-gray-500">Cargando sucursales...</p>
                ) : branches.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No hay sucursales activas. Crea una sucursal usando el botón "Gestionar Sucursales".
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="todas-sucursales"
                          checked={availableIn.includes('Todas las sucursales')}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAvailableIn(['Todas las sucursales'])
                            } else {
                              setAvailableIn([])
                            }
                          }}
                        />
                        <Label
                          htmlFor="todas-sucursales"
                          className="text-sm font-medium cursor-pointer"
                        >
                          Todas las sucursales
                        </Label>
                      </div>
                    </div>
                    {!availableIn.includes('Todas las sucursales') && (
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
                    )}
                    {availableIn.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Debes seleccionar al menos una sucursal
                      </p>
                    )}
                  </>
                )}

                {showManageSucursales && (
                  <Card className="mt-4 border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Gestión de Sucursales</CardTitle>
                      <CardDescription>
                        Crea o elimina sucursales desde aquí
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Formulario para crear nueva sucursal */}
                      <div className="border-b pb-4 space-y-4">
                        <h3 className="font-semibold text-sm">Crear Nueva Sucursal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="newBranchName">Nombre *</Label>
                            <Input
                              id="newBranchName"
                              type="text"
                              placeholder="Ej: Nueva Sucursal"
                              value={newBranchName}
                              onChange={(e) => {
                                setNewBranchName(e.target.value)
                                if (!newBranchSlug || newBranchSlug === generateSlug(newBranchName)) {
                                  setNewBranchSlug(generateSlug(e.target.value))
                                }
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newBranchSlug">Slug *</Label>
                            <Input
                              id="newBranchSlug"
                              type="text"
                              placeholder="ejemplo: nueva-sucursal"
                              value={newBranchSlug}
                              onChange={(e) => setNewBranchSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>&nbsp;</Label>
                            <div className="flex items-center space-x-2 pt-2">
                              <Checkbox
                                id="newBranchActive"
                                checked={newBranchActive}
                                onCheckedChange={(checked) => setNewBranchActive(checked === true)}
                              />
                              <Label htmlFor="newBranchActive" className="text-sm font-normal cursor-pointer">
                                Activa
                              </Label>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={handleCreateBranch}
                          disabled={creatingBranch || !newBranchName.trim()}
                          className="w-full md:w-auto"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {creatingBranch ? 'Creando...' : 'Crear Sucursal'}
                        </Button>
                      </div>

                      {/* Lista de sucursales existentes */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3">Sucursales Existentes</h3>
                        {allBranches.length === 0 ? (
                          <p className="text-sm text-gray-500">No hay sucursales registradas</p>
                        ) : (
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nombre</TableHead>
                                  <TableHead>Slug</TableHead>
                                  <TableHead>Estado</TableHead>
                                  <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {allBranches.map((branch) => (
                                  <TableRow key={branch.id}>
                                    <TableCell className="font-medium">{branch.name}</TableCell>
                                    <TableCell>
                                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {branch.slug}
                                      </code>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={branch.is_active ? 'default' : 'secondary'}>
                                        {branch.is_active ? 'Activa' : 'Inactiva'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() => handleDeleteBranch(branch.id, branch.name)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
                <Label>Imagen de la Promoción *</Label>
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
                <Link href="/admin/promociones">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar Promoción'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


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
import { ArrowLeft, Save, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import MediaSelector from '@/components/admin/media-selector'
import { Checkbox } from '@/components/ui/checkbox'

interface Branch {
    id: string
    name: string
    is_active: boolean
}

export default function NewBirthdayPackagePage() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [knowledgeBase, setKnowledgeBase] = useState('')
    const [price, setPrice] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [availableIn, setAvailableIn] = useState<string[]>(['Todas las sucursales'])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [branches, setBranches] = useState<Branch[]>([])
    const [loadingBranches, setLoadingBranches] = useState(true)

    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        fetchBranches()
    }, [supabase])

    const fetchBranches = async () => {
        try {
            setLoadingBranches(true)
            const { data, error } = await supabase
                .from('branches')
                .select('id, name, is_active')
                .eq('is_active', true)
                .order('name', { ascending: true })

            if (!error && data) {
                setBranches(data)
            }
        } catch (err) {
            console.error('Error fetching branches:', err)
        } finally {
            setLoadingBranches(false)
        }
    }

    const handleSucursalToggle = (sucursal: string) => {
        setAvailableIn((prev) => {
            if (prev.includes(sucursal)) {
                const updated = prev.filter((s) => s !== sucursal)
                return updated
            } else {
                // Si seleccionamos una sucursal específica, quitamos "Todas las sucursales"
                const updated = [...prev.filter(s => s !== 'Todas las sucursales'), sucursal]
                return updated
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!title || !imageUrl || availableIn.length === 0) {
            setError('Todos los campos son obligatorios, incluyendo al menos una sucursal')
            return
        }

        setLoading(true)
        try {
            // Obtener el máximo order_index actual
            const { data: currentPackages } = await supabase
                .from('birthday_packages')
                .select('order_index')
                .order('order_index', { ascending: false })
                .limit(1)

            const nextOrderIndex = currentPackages && currentPackages.length > 0
                ? (currentPackages[0].order_index || 0) + 1
                : 0

            const { error } = await supabase.from('birthday_packages').insert([
                {
                    title: title.trim(),
                    description: description.trim() || null,
                    knowledge_base: knowledgeBase.trim() || null,
                    price: price.trim(),
                    image_url: imageUrl.trim(),
                    available_in: availableIn,
                    order_index: nextOrderIndex,
                    created_at: new Date().toISOString()
                }
            ])

            if (error) {
                setError(error.message)
            } else {
                router.push('/admin/cumpleanos')
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
                        <Link href="/admin/cumpleanos">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Nuevo Paquete</h1>
                            <p className="text-sm text-gray-600">Agrega un nuevo paquete de cumpleaños</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Paquete</CardTitle>
                        <CardDescription>Completa los detalles del paquete</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Ej: Paquete Básico"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción (opcional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Escribe una descripción detallada del paquete..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                />
                                <p className="text-xs text-gray-500">
                                    Se mostrará en la vista pública. Déjala vacía si no quieres mostrar descripción.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Precio / Costo</Label>
                                <Input
                                    id="price"
                                    type="text"
                                    placeholder="Ej: $250.00 o Desde $1,500"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label>Sucursales Disponibles *</Label>
                                    <p className="text-xs text-gray-500">
                                        Selecciona las sucursales donde está disponible este paquete.
                                    </p>
                                </div>
                                {loadingBranches ? (
                                    <p className="text-sm text-gray-500">Cargando sucursales...</p>
                                ) : branches.length === 0 ? (
                                    <Alert>
                                        <AlertDescription>
                                            No hay sucursales activas registradas.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <>
                                        <div className="space-y-2">
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
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
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
                                            <p className="text-xs text-red-500">
                                                Debes seleccionar al menos una sucursal
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Imagen del Paquete *</Label>
                                <MediaSelector
                                    value={imageUrl}
                                    onSelect={(url) => setImageUrl(url)}
                                    label="Seleccionar Imagen"
                                />
                            </div>

                            <div className="space-y-2 rounded-lg border border-dashed border-orange-300 bg-orange-50/50 p-4">
                                <Label htmlFor="knowledgeBase">Base de Conocimiento (uso interno)</Label>
                                <Textarea
                                    id="knowledgeBase"
                                    placeholder="Información interna detallada sobre este paquete (no se muestra en el sitio)"
                                    value={knowledgeBase}
                                    onChange={(e) => setKnowledgeBase(e.target.value)}
                                    rows={5}
                                />
                                <p className="text-xs text-gray-500">
                                    Este contenido NO se muestra en la página pública. Es solo informativo
                                    para el admin y para consumirse vía API.
                                </p>
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="flex justify-end space-x-4">
                                <Link href="/admin/cumpleanos">
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={loading}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {loading ? 'Guardando...' : 'Guardar Paquete'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

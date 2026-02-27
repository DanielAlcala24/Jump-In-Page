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
import { Home, Save, X, Image as ImageIcon, ArrowLeft, ArrowRight, Cake } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import MediaSelectorMultiple from '@/components/admin/media-selector-multiple'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface GalleryImage {
    id?: string
    image_url: string
    order_index: number
}

export default function BirthdayGalleryAdminPage() {
    const [images, setImages] = useState<string[]>([])
    const [rawImages, setRawImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        checkUser()
        fetchGallery()
    }, [])

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/admin/login')
            return
        }
        setUser(user)
    }

    const fetchGallery = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('birthday_gallery')
                .select('*')
                .order('order_index', { ascending: true })

            if (error) {
                console.error('Error fetching gallery:', error)
                setError('No se pudo cargar la galería')
            } else {
                setRawImages(data || [])
                setImages(data?.map(img => img.image_url) || [])
            }
        } catch (err) {
            console.error('Error:', err)
            setError('No se pudo cargar la galería')
        } finally {
            setLoading(false)
        }
    }

    const handleAddImage = (url: string) => {
        if (!url || images.includes(url)) {
            return
        }
        setImages(prev => [...prev, url])
    }

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleMoveImage = (index: number, direction: 'prev' | 'next') => {
        const newImages = [...images]
        const targetIndex = direction === 'prev' ? index - 1 : index + 1

        if (targetIndex < 0 || targetIndex >= newImages.length) return

        const [movedItem] = newImages.splice(index, 1)
        newImages.splice(targetIndex, 0, movedItem)

        setImages(newImages)
    }

    const handleSave = async () => {
        setSaving(true)
        setError('')

        try {
            // 1. Prepare data for all images
            const imagesToSave = images.map((url, index) => ({
                image_url: url,
                order_index: index,
                created_at: new Date().toISOString()
            }))

            // To keep it simple and robust, we'll delete existing rows and insert new ones
            const { error: deleteError } = await supabase
                .from('birthday_gallery')
                .delete()
                .filter('id', 'neq', '00000000-0000-0000-0000-000000000000')

            if (deleteError) {
                console.error('Delete error details:', deleteError)
                throw new Error(`Error de Supabase: ${deleteError.message}. Código: ${deleteError.code}`)
            }

            if (imagesToSave.length > 0) {
                const { error: insertError } = await supabase
                    .from('birthday_gallery')
                    .insert(imagesToSave)

                if (insertError) throw insertError
            }

            await fetchGallery()
            toast.success('Galería guardada correctamente')
        } catch (err: any) {
            console.error('Error saving gallery:', err)
            setError(err.message || 'Error al guardar la galería')
            toast.error('Error al guardar la galería')
        } finally {
            setSaving(false)
        }
    }

    if (!user) {
        return <div className="p-8 text-center">Cargando...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
                        <div className="flex items-center gap-3">
                            <Link href="/admin/cumpleanos">
                                <Button variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver a Cumpleaños
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Galería de Cumpleaños</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <p>Cargando galería...</p>
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-6 w-6 text-pink-500" />
                                    Gestionar Imágenes de Fiestas
                                </CardTitle>
                                <CardDescription>
                                    Agrega, elimina y ordena las fotos que aparecen en la sección de "Tu Fiesta en Jump-In"
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Selector de imágenes */}
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-base font-semibold">Subir o Seleccionar Imágenes</Label>
                                        <p className="text-sm text-gray-500">
                                            Selecciona las imágenes que capturan la diversión de los cumpleaños en Jump-In
                                        </p>
                                    </div>

                                    <div className="border rounded-lg p-4 bg-gray-50/50">
                                        <MediaSelectorMultiple
                                            onSelect={handleAddImage}
                                            label="Seleccionar Fotos"
                                        />
                                    </div>

                                    {/* Lista de imágenes seleccionadas */}
                                    {images.length > 0 && (
                                        <div className="space-y-3">
                                            <Label className="text-sm font-medium">
                                                Fotos en el Carrusel ({images.length})
                                            </Label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {images.map((imageUrl, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative group border rounded-lg overflow-hidden bg-gray-100 transition-all hover:ring-2 hover:ring-pink-500 shadow-sm"
                                                    >
                                                        <div className="aspect-square relative">
                                                            <Image
                                                                src={imageUrl}
                                                                alt={`Gallery image ${index + 1}`}
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
                                                                className={`h-7 w-7 bg-white/90 hover:bg-white text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity ${index === images.length - 1 ? 'hidden' : ''}`}
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
                                                            <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded border border-pink-200">
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

                                    {images.length === 0 && (
                                        <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg bg-white">
                                            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No hay imágenes en la galería</p>
                                            <p className="text-xs mt-2">Usa el botón de arriba para agregar fotos</p>
                                        </div>
                                    )}
                                </div>

                                {/* Botón de guardar */}
                                <div className="flex justify-end pt-4 border-t">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-pink-600 hover:bg-pink-700 text-white"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? 'Guardando...' : 'Guardar Galería'}
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

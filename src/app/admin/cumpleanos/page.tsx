'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    Plus,
    Trash2,
    Edit,
    ArrowUp,
    ArrowDown,
    Home,
    Image as ImageIcon
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

interface BirthdayPackage {
    id: string
    title: string
    description: string
    price: string
    image_url: string
    available_in?: string[]
    order_index: number
    created_at: string
}

const DEFAULT_IMAGE = '/assets/g5.jpeg'

export default function BirthdayPackagesAdminPage() {
    const [packages, setPackages] = useState<BirthdayPackage[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        checkUser()
        fetchPackages()
    }, [])

    const checkUser = async () => {
        const {
            data: { user }
        } = await supabase.auth.getUser()
        if (!user) {
            router.push('/admin/login')
            return
        }
        setUser(user)
    }

    const fetchPackages = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('birthday_packages')
                .select('*')
                .order('order_index', { ascending: true })
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching packages:', error)
                setError('No se pudieron cargar los paquetes')
            } else {
                setPackages(data || [])
            }
        } catch (err) {
            console.error('Error:', err)
            setError('No se pudieron cargar los paquetes')
        } finally {
            setLoading(false)
        }
    }

    const handleMovePackage = async (item: BirthdayPackage, direction: 'up' | 'down') => {
        const index = packages.findIndex((p) => p.id === item.id)
        if (index === -1) return

        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= packages.length) return

        const otherItem = packages[newIndex]

        // Intercambiar order_index
        const tempOrder = item.order_index || 0
        const newOrder = otherItem.order_index || 0

        // Si ambos tienen el mismo orden o no tienen (0), asignar nuevos basados en indices
        const finalItemOrder = newOrder || index + (direction === 'up' ? -1 : 1)
        const finalOtherOrder = tempOrder || index

        const { error: error1 } = await supabase
            .from('birthday_packages')
            .update({ order_index: finalItemOrder })
            .eq('id', item.id)

        if (error1) {
            toast.error('Error al mover el paquete')
            return
        }

        const { error: error2 } = await supabase
            .from('birthday_packages')
            .update({ order_index: finalOtherOrder })
            .eq('id', otherItem.id)

        if (error2) {
            toast.error('Error al mover el paquete')
            return
        }

        fetchPackages()
        toast.success('Orden actualizado')
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este paquete?')) return

        try {
            const { error } = await supabase.from('birthday_packages').delete().eq('id', id)

            if (error) {
                console.error('Error deleting package:', error)
                toast.error('Error al eliminar el paquete')
            } else {
                setPackages(packages.filter((pkg) => pkg.id !== id))
                toast.success('Paquete eliminado correctamente')
                fetchPackages()
            }
        } catch (err) {
            console.error('Error:', err)
            toast.error('Error al eliminar el paquete')
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
                            <h1 className="text-2xl font-bold text-gray-900">Paquetes de Cumpleaños</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/admin/cumpleanos/gallery">
                                <Button variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50">
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Galería
                                </Button>
                            </Link>
                            <Link href="/admin/cumpleanos/new">
                                <Button className="bg-orange-500 hover:bg-orange-600">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Paquete
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Listado de Paquetes</CardTitle>
                            <CardDescription>
                                Administra los paquetes que aparecen en la sección de Fiestas de Cumpleaños. Usa las flechas para ordenar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                                    <p>Cargando paquetes...</p>
                                </div>
                            ) : packages.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No hay paquetes registrados.</p>
                                    <Link href="/admin/cumpleanos/new" className="mt-4 inline-block">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Crear Primer Paquete
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Imagen</TableHead>
                                            <TableHead className="w-[80px]">Orden</TableHead>
                                            <TableHead>Título</TableHead>
                                            <TableHead>Sucursales</TableHead>
                                            <TableHead>Precio</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {packages.map((pkg, idx) => (
                                            <TableRow key={pkg.id}>
                                                <TableCell>
                                                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                                                        <Image
                                                            src={pkg.image_url || DEFAULT_IMAGE}
                                                            alt={pkg.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col items-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0"
                                                            onClick={() => handleMovePackage(pkg, 'up')}
                                                            disabled={idx === 0}
                                                        >
                                                            <ArrowUp className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0"
                                                            onClick={() => handleMovePackage(pkg, 'down')}
                                                            disabled={idx === packages.length - 1}
                                                        >
                                                            <ArrowDown className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-bold">{pkg.title}</div>
                                                        <div className="text-xs text-gray-500 max-w-xs truncate">
                                                            {pkg.description}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                        {pkg.available_in && pkg.available_in.length > 0 ? (
                                                            pkg.available_in.map((sucursal, sIdx) => (
                                                                <span
                                                                    key={sIdx}
                                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                                                >
                                                                    {sucursal}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">No especificada</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-green-600">
                                                    {pkg.price || 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link href={`/admin/cumpleanos/${pkg.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={() => handleDelete(pkg.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

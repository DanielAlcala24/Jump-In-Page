'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClientComponentClient } from '@/lib/supabase'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import Autoplay from 'embla-carousel-autoplay'
import { Maximize2, MessageCircle, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface BirthdayPackage {
    id: string
    title: string
    description: string
    price: string
    image_url: string
    available_in?: string[]
    order_index: number
}

export default function BirthdayPackagesCarousel() {
    const [packages, setPackages] = useState<BirthdayPackage[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const { data, error } = await supabase
                    .from('birthday_packages')
                    .select('*')
                    .order('order_index', { ascending: true })

                if (!error && data) {
                    setPackages(data)
                }
            } catch (err) {
                console.error('Error fetching packages:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchPackages()
    }, [supabase])

    if (loading) {
        return (
            <div className="w-full py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (packages.length === 0) {
        return null
    }

    return (
        <section id="nuestros-paquetes" className="w-full pt-12 pb-0 bg-gray-50 dark:bg-gray-950 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-gray-900 dark:text-white">
                        Nuestros Paquetes
                    </h2>
                    <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                        Elige el paquete perfecto para tu celebración y vive una experiencia inolvidable.
                    </p>
                </div>

                <div className="relative max-w-6xl mx-auto px-12">
                    <Carousel
                        opts={{
                            align: 'start',
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 3000,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {packages.map((pkg) => (
                                <CarouselItem key={pkg.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <div className="relative cursor-pointer group w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                    <img
                                                        src={pkg.image_url || '/assets/g5.jpeg'}
                                                        alt={pkg.title}
                                                        className="w-full h-auto block transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                        <Maximize2 className="text-white opacity-0 group-hover:opacity-100 h-10 w-10 transition-opacity" />
                                                    </div>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-[95vw] md:max-w-[85vw] max-h-[95vh] p-0 border-none bg-black/95 shadow-2xl flex items-center justify-center overflow-hidden [&>button]:text-white [&>button]:opacity-100">
                                                <DialogHeader className="sr-only">
                                                    <DialogTitle>{pkg.title}</DialogTitle>
                                                </DialogHeader>
                                                <div className="relative w-full h-[95vh] flex items-center justify-center p-2">
                                                    <img
                                                        src={pkg.image_url || '/assets/g5.jpeg'}
                                                        alt={pkg.title}
                                                        className="max-w-full max-h-full object-contain shadow-2xl"
                                                    />
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <CardContent className="p-6 flex-1 flex flex-col">
                                            <div className="mb-2">
                                                <h3 className="text-xl font-bold font-headline text-gray-900 dark:text-gray-100">
                                                    {pkg.title}
                                                </h3>
                                                {pkg.price && (
                                                    <p className="text-lg font-bold text-primary dark:text-orange-500 mt-1">
                                                        {pkg.price}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                                                {pkg.description}
                                            </p>

                                            {pkg.available_in && pkg.available_in.length > 0 && (
                                                <div className="mt-auto pt-3 border-t dark:border-gray-800">
                                                    <div className="flex flex-wrap gap-1.5 items-center">
                                                        <MapPin className="h-3 w-3 text-primary shrink-0" />
                                                        <div className="flex flex-wrap gap-1">
                                                            {pkg.available_in.map((sucursal, sIdx) => (
                                                                <span
                                                                    key={sIdx}
                                                                    className="text-[10px] px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded border dark:border-gray-700"
                                                                >
                                                                    {sucursal}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-4 md:-left-12 bg-white text-primary hover:bg-primary hover:text-white border-2 border-primary shadow-md z-20" />
                        <CarouselNext className="-right-4 md:-right-12 bg-white text-primary hover:bg-primary hover:text-white border-2 border-primary shadow-md z-20" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}

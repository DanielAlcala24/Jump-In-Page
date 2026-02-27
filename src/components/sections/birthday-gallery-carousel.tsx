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
import Autoplay from 'embla-carousel-autoplay'
import { Maximize2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

interface GalleryImage {
    id: string
    image_url: string
    order_index: number
}

const DEFAULT_IMAGES = [
    { image_url: '/assets/g3.jpeg' },
    { image_url: '/assets/g8.jpeg' },
    { image_url: '/assets/g5.jpeg' },
    { image_url: '/assets/g7.jpeg' }
]

export default function BirthdayGalleryCarousel() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data, error } = await supabase
                    .from('birthday_gallery')
                    .select('*')
                    .order('order_index', { ascending: true })

                if (!error && data && data.length > 0) {
                    setImages(data)
                } else {
                    // Fallback to defaults if no images in DB
                    setImages(DEFAULT_IMAGES.map((img, idx) => ({
                        id: `default-${idx}`,
                        image_url: img.image_url,
                        order_index: idx
                    })))
                }
            } catch (err) {
                console.error('Error fetching gallery:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchGallery()
    }, [supabase])

    if (loading) {
        return (
            <div className="w-full py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        )
    }

    if (images.length === 0) {
        return null
    }

    return (
        <div className="relative max-w-5xl mx-auto px-4 md:px-12">
            <Carousel
                opts={{
                    align: 'start',
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 2000,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {images.map((image) => (
                        <CarouselItem key={image.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300">
                                        <Image
                                            src={image.image_url}
                                            alt="Galaría de fiesta Jump-In"
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 h-8 w-8 transition-opacity" />
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] md:max-w-[80vw] max-h-[90vh] p-0 border-none bg-black/95 shadow-2xl flex items-center justify-center overflow-hidden [&>button]:text-white [&>button]:opacity-100">
                                    <DialogHeader className="sr-only">
                                        <DialogTitle>Galería de Foto</DialogTitle>
                                    </DialogHeader>
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img
                                            src={image.image_url}
                                            alt="Foto de la galería ampliada"
                                            className="max-w-full max-h-[85vh] object-contain"
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="flex justify-center gap-4 mt-8 md:block">
                    <CarouselPrevious className="static md:absolute -left-12 translate-y-0 md:-translate-y-1/2 bg-white text-pink-600 border-pink-200 hover:bg-pink-50 hover:text-pink-700 shadow-md" />
                    <CarouselNext className="static md:absolute -right-12 translate-y-0 md:-translate-y-1/2 bg-white text-pink-600 border-pink-200 hover:bg-pink-50 hover:text-pink-700 shadow-md" />
                </div>
            </Carousel>
        </div>
    )
}

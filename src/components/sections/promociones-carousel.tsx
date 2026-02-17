'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Ticket, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Promotion {
  id: string
  title: string
  description: string
  image_url: string
  image_hint?: string
  available_in: string[]
}

export default function PromocionesCarousel() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedPromoIndex, setSelectedPromoIndex] = useState(0)
  const supabase = createClientComponentClient()

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching promotions:', error)
          setPromotions([])
        } else {
          setPromotions(data && data.length > 0 ? data : [])
        }
      } catch (err) {
        console.error('Error:', err)
        setPromotions([])
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [supabase])

  const openLightbox = (index: number) => {
    setSelectedPromoIndex(index)
    setLightboxOpen(true)
  }

  const goToPrevious = () => {
    setSelectedPromoIndex((prev) => (prev === 0 ? promotions.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedPromoIndex((prev) => (prev === promotions.length - 1 ? 0 : prev + 1))
  }

  if (loading) {
    return (
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando promociones...</p>
          </div>
        </div>
      </section>
    )
  }

  if (promotions.length === 0) {
    return null
  }

  return (
    <section className="w-full py-12 md:py-16 bg-white overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
            Promociones Especiales
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-gray-900">
            Aprovecha Nuestras Promociones
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">
            Descubre las mejores ofertas y promociones exclusivas para disfrutar al máximo tu experiencia en Jump-In
          </p>
        </div>

        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4 items-start">
            {promotions.map((promo, index) => (
              <CarouselItem key={promo.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group border-2 hover:border-orange-500 bg-white dark:bg-gray-950">
                  <CardHeader className="p-0 relative">
                    <div
                      className="relative w-full cursor-pointer overflow-hidden flex items-center justify-center bg-white"
                      onClick={() => openLightbox(index)}
                    >
                      <img
                        src={promo.image_url || '/assets/g5.jpeg'}
                        alt={promo.title}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md">
                          <Ticket className="h-3 w-3 mr-1" />
                          Promoción
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col">
                    <CardTitle className="font-headline text-xl mb-2 text-center">
                      {promo.title}
                    </CardTitle>
                    <CardDescription className="text-center mb-4">
                      {promo.description}
                    </CardDescription>
                    <div>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold flex items-center mb-2 justify-center text-muted-foreground">
                          <MapPin className="mr-1 h-4 w-4" />
                          Disponible en:
                        </h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {promo.available_in && promo.available_in.length > 0 ? (
                            promo.available_in.slice(0, 3).map((sucursal) => (
                              <Badge
                                key={sucursal}
                                variant="outline"
                                className="font-normal bg-blue-50 text-blue-700 border-blue-200 text-xs"
                              >
                                {sucursal}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="font-normal bg-gray-50 text-gray-600 border-gray-200 text-xs">
                              Todas las sucursales
                            </Badge>
                          )}
                          {promo.available_in && promo.available_in.length > 3 && (
                            <Badge variant="outline" className="font-normal bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              +{promo.available_in.length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Link href="/precios-y-promociones?tab=Promociones" className="block">
                        <div className="w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 font-medium">
                          Ver Todas las Promociones
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="relative static translate-y-0 bg-orange-500 hover:bg-orange-600 text-white border-orange-600 h-10 w-10" />
            <CarouselNext className="relative static translate-y-0 bg-orange-500 hover:bg-orange-600 text-white border-orange-600 h-10 w-10" />
          </div>
        </Carousel>

        {/* Lightbox para Promociones */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="bg-black/90 border-none p-0 max-w-none w-screen h-screen flex items-center justify-center">
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="h-8 w-8" />
                <span className="sr-only">Cerrar</span>
              </Button>

              <div className="flex items-center justify-center w-full h-full p-4 md:p-8">
                {promotions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12 hidden md:flex"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-10 w-10" />
                    <span className="sr-only">Anterior</span>
                  </Button>
                )}

                <div className="relative w-full h-full flex items-center justify-center p-2 md:p-10">
                  <img
                    src={promotions[selectedPromoIndex]?.image_url || ''}
                    alt={promotions[selectedPromoIndex]?.title || ''}
                    className="max-w-full max-h-full object-contain shadow-2xl"
                  />
                </div>

                {promotions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12 hidden md:flex"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-10 w-10" />
                    <span className="sr-only">Siguiente</span>
                  </Button>
                )}
              </div>

              {/* Título en el Lightbox */}
              <div className="absolute bottom-10 left-0 right-0 text-center text-white px-4">
                <h3 className="text-xl md:text-2xl font-bold font-headline">
                  {promotions[selectedPromoIndex]?.title}
                </h3>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

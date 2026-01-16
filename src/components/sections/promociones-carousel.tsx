'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Ticket, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import React from 'react'

interface Promotion {
  id: string
  title: string
  description: string
  image_url: string
  image_hint?: string
  available_in: string[]
}

const DEFAULT_PROMOTIONS: Promotion[] = [
  {
    id: 'default-1',
    title: 'Martes 2x1',
    description: '¡Los martes son de amigos! Compra una hora de salto y obtén la segunda gratis para un acompañante.',
    image_url: '/assets/g5.jpeg',
    image_hint: 'friends jumping',
    available_in: ['Todas las sucursales']
  },
  {
    id: 'default-2',
    title: 'Jueves de Estudiantes',
    description: 'Presenta tu credencial de estudiante vigente y obtén un 20% de descuento en tu entrada.',
    image_url: '/assets/g2.jpg',
    image_hint: 'student discount',
    available_in: ['Coacalco', 'Ecatepec', 'Vallejo']
  },
  {
    id: 'default-3',
    title: 'Domingo Familiar',
    description: 'Paquete familiar (2 adultos, 2 niños) por solo $750 la hora. ¡El plan perfecto para el fin de semana!',
    image_url: '/assets/g8.jpeg',
    image_hint: 'family fun',
    available_in: ['Todas las sucursales']
  },
  {
    id: 'default-4',
    title: 'Promo Cumpleañero',
    description: '¿Es tu mes de cumpleaños? Presenta tu INE y salta ¡GRATIS! en la compra de 3 accesos para tus amigos.',
    image_url: '/assets/g3.jpeg',
    image_hint: 'birthday person',
    available_in: ['Interlomas', 'La Cúspide', 'Cuernavaca']
  },
]

export default function PromocionesCarousel() {
  const [promotions, setPromotions] = useState<Promotion[]>(DEFAULT_PROMOTIONS)
  const [loading, setLoading] = useState(true)
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
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching promotions:', error)
          setPromotions(DEFAULT_PROMOTIONS)
        } else {
          setPromotions(data && data.length > 0 ? data : DEFAULT_PROMOTIONS)
        }
      } catch (err) {
        console.error('Error:', err)
        setPromotions(DEFAULT_PROMOTIONS)
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [supabase])

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
    <section className="w-full py-12 md:py-16 bg-white">
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
          <CarouselContent className="-ml-2 md:-ml-4">
            {promotions.map((promo) => (
              <CarouselItem key={promo.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full group border-2 hover:border-orange-500">
                  <CardHeader className="p-0 relative">
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image
                        src={promo.image_url || '/assets/g5.jpeg'}
                        alt={promo.title}
                        fill
                        data-ai-hint={promo.image_hint || promo.title}
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none">
                          <Ticket className="h-3 w-3 mr-1" />
                          Promoción
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <CardTitle className="font-headline text-xl mb-2 text-center">
                      {promo.title}
                    </CardTitle>
                    <CardDescription className="text-center mb-4 flex-grow">
                      {promo.description}
                    </CardDescription>
                    <div className="mt-auto">
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
      </div>
    </section>
  )
}

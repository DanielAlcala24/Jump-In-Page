"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from "react"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Ana García",
    title: "Mamá Satisfecha",
    quote: "¡A mis hijos les encantó! El personal es muy amable y las instalaciones son de primera. Definitivamente volveremos pronto.",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
  },
  {
    name: "Carlos Sánchez",
    title: "Adicto a la Adrenalina",
    quote: "Una experiencia increíblemente divertida. Las diferentes áreas de salto te retan y te mantienen activo. ¡Lo recomiendo al 100%!",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 5,
  },
  {
    name: "Laura Martínez",
    title: "Organizadora de Eventos",
    quote: "Celebramos el cumpleaños de mi sobrino aquí y fue todo un éxito. El paquete de fiesta es muy completo y los niños se la pasaron genial.",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 4,
  },
    {
    name: "Javier Rodríguez",
    title: "Visitante Frecuente",
    quote: "Jump-In es mi lugar favorito para desestresarme después del trabajo. Saltar es un excelente ejercicio y aquí lo hacen muy divertido.",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 5,
  },
  {
    name: "Sofía Hernández",
    title: "Entusiasta del Fitness",
    quote: "¡Qué manera tan original de hacer ejercicio! Me divertí tanto que ni sentí el esfuerzo. Las clases de fitness en trampolín son geniales.",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 4,
  }
]

const cardColors = [
    "bg-sky-500 border-sky-600",
    "bg-pink-500 border-pink-600",
    "bg-green-500 border-green-600",
    "bg-purple-500 border-purple-600",
    "bg-orange-500 border-orange-600",
]

const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-5 w-5",
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

export default function Testimonios() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  return (
    <section id="testimonios" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                    Opiniones
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-gray-900 dark:text-gray-50">
                    Lo que Nuestros Clientes Dicen
                </h2>
                <p className="max-w-[900px] text-gray-600 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    La confianza de nuestros visitantes es nuestra mejor carta de presentación.
                </p>
            </div>
        </div>
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto mt-12"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className={cn("h-full text-background border", cardColors[index % cardColors.length])}>
                    <CardHeader className="flex flex-row items-center gap-4 pb-4">
                        <Avatar>
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg font-headline text-background">{testimonial.name}</CardTitle>
                            <p className="text-sm text-background/80">{testimonial.title}</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base text-background mb-4">"{testimonial.quote}"</p>
                      {renderStars(testimonial.rating)}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-6">
            <CarouselPrevious className="relative static translate-y-0" />
            <CarouselNext className="relative static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}

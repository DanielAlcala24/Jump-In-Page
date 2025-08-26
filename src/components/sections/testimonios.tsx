"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Ana García",
    title: "Mamá Satisfecha",
    quote: "¡A mis hijos les encantó! El personal es muy amable y las instalaciones son de primera. Definitivamente volveremos pronto.",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    name: "Carlos Sánchez",
    title: "Adicto a la Adrenalina",
    quote: "Una experiencia increíblemente divertida. Las diferentes áreas de salto te retan y te mantienen activo. ¡Lo recomiendo al 100%!",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    name: "Laura Martínez",
    title: "Organizadora de Eventos",
    quote: "Celebramos el cumpleaños de mi sobrino aquí y fue todo un éxito. El paquete de fiesta es muy completo y los niños se la pasaron genial.",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
    {
    name: "Javier Rodríguez",
    title: "Visitante Frecuente",
    quote: "Jump-In es mi lugar favorito para desestresarme después del trabajo. Saltar es un excelente ejercicio y aquí lo hacen muy divertido.",
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  {
    name: "Sofía Hernández",
    title: "Entusiasta del Fitness",
    quote: "¡Qué manera tan original de hacer ejercicio! Me divertí tanto que ni sentí el esfuerzo. Las clases de fitness en trampolín son geniales.",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
]

export default function Testimonios() {
  return (
    <section id="testimonios" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                    Opiniones
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Lo que Nuestros Clientes Dicen
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    La confianza de nuestros visitantes es nuestra mejor carta de presentación.
                </p>
            </div>
        </div>
        <Carousel
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
                  <Card className="h-full">
                    <CardHeader className="flex flex-row items-center gap-4 pb-4">
                        <Avatar>
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg font-headline">{testimonial.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base text-gray-700 dark:text-gray-300">"{testimonial.quote}"</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-black" />
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-black" />
        </Carousel>
      </div>
    </section>
  )
}

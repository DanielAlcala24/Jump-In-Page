"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const images = [
    { src: "https://picsum.photos/600/400?random=1", alt: "Diversión en trampolines", hint: "trampoline fun" },
    { src: "https://picsum.photos/600/400?random=2", alt: "Saltos y piruetas", hint: "jumping tricks" },
    { src: "https://picsum.photos/600/400?random=3", alt: "Celebrando un cumpleaños", hint: "birthday party" },
    { src: "https://picsum.photos/600/400?random=4", alt: "Zona de espuma", hint: "foam pit" },
    { src: "https://picsum.photos/600/400?random=5", alt: "Amigos saltando juntos", hint: "friends jumping" },
    { src: "https://picsum.photos/600/400?random=6", alt: "Escalando el muro", hint: "climbing wall" },
    { src: "https://picsum.photos/600/400?random=7", alt: "Evento corporativo", hint: "corporate event" },
    { src: "https://picsum.photos/600/400?random=8", alt: "Risas y alegría", hint: "kids laughing" },
];

export default function Galeria() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true })
    )

    return (
        <section id="galeria" className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                            Nuestros Momentos
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                            Galería de Sonrisas
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Un vistazo a la diversión y energía que se vive en Jump-In.
                        </p>
                    </div>
                </div>
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full max-w-5xl mx-auto mt-12"
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                >
                    <CarouselContent>
                        {images.map((image, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="relative flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                                            <Image
                                                src={image.src}
                                                alt={image.alt}
                                                width={600}
                                                height={400}
                                                data-ai-hint={image.hint}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-4 mt-6">
                        <CarouselPrevious className="relative static translate-y-0 bg-orange-500 hover:bg-orange-600 text-white border-orange-600" />
                        <CarouselNext className="relative static translate-y-0 bg-orange-500 hover:bg-orange-600 text-white border-orange-600" />
                    </div>
                </Carousel>
            </div>
        </section>
    )
}

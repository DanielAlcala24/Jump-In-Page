"use client"
import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const images = [
    { src: "/assets/g1.jpg", alt: "Diversión en trampolines", hint: "trampoline fun" },
    { src: "/assets/g2.jpg", alt: "Saltos y piruetas", hint: "jumping tricks" },
    { src: "/assets/g3.jpg", alt: "Celebrando un cumpleaños", hint: "birthday party" },
    { src: "/assets/g4.jpg", alt: "Zona de espuma", hint: "foam pit" },
    { src: "/assets/g5.jpg", alt: "Amigos saltando juntos", hint: "friends jumping" },
    { src: "/assets/g6.jpg", alt: "Escalando el muro", hint: "climbing wall" },
    { src: "/assets/g7.jpg", alt: "Evento corporativo", hint: "corporate event" },
    { src: "/assets/g8.jpg", alt: "Risas y alegría", hint: "kids laughing" },
];

export default function Galeria() {
    return (
        <section id="galeria" className="w-full py-12 bg-gray-50 dark:bg-gray-900">
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

                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
                    {images.map((image, index) => (
                        <div key={index} className="overflow-hidden rounded-lg group shadow-lg transition-all hover:shadow-2xl">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={600}
                                height={800}
                                data-ai-hint={image.hint}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link href="/blog">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                            Visita Nuestro Blog
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

"use client"
import * as React from "react"
import Image from "next/image"
import BlogPosts from "./blog-posts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const images = [
    { src: "https://picsum.photos/800/600?random=1", alt: "Diversión en trampolines", hint: "trampoline fun" },
    { src: "https://picsum.photos/600/800?random=2", alt: "Saltos y piruetas", hint: "jumping tricks" },
    { src: "https://picsum.photos/800/600?random=3", alt: "Celebrando un cumpleaños", hint: "birthday party" },
    { src: "https://picsum.photos/600/800?random=4", alt: "Zona de espuma", hint: "foam pit" },
    { src: "https://picsum.photos/800/600?random=5", alt: "Amigos saltando juntos", hint: "friends jumping" },
    { src: "https://picsum.photos/600/800?random=6", alt: "Escalando el muro", hint: "climbing wall" },
    { src: "https://picsum.photos/800/600?random=7", alt: "Evento corporativo", hint: "corporate event" },
    { src: "https://picsum.photos/600/800?random=8", alt: "Risas y alegría", hint: "kids laughing" },
];

export default function Galeria() {
    return (
        <section id="galeria" className="w-full py-12 bg-white">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <Tabs defaultValue="galeria" className="w-full">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                                Nuestros Momentos y Noticias
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                                Explora Nuestra Comunidad
                            </h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Desde sonrisas en nuestra galería hasta consejos en nuestro blog, sumérgete en el universo Jump-In.
                            </p>
                        </div>
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="galeria">Galería</TabsTrigger>
                            <TabsTrigger value="blog">Blog</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="galeria">
                        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
                            {images.map((image, index) => (
                                <div key={index} className="overflow-hidden rounded-lg group">
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
                    </TabsContent>

                    <TabsContent value="blog">
                        <div className="mt-8">
                            <BlogPosts />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

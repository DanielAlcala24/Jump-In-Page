"use client"
import * as React from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

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

const blogPosts = [
    {
        title: "5 Beneficios de Saltar en Trampolín para tu Salud",
        description: "Descubre cómo saltar no solo es divertido, sino también una excelente forma de ejercicio cardiovascular que mejora tu equilibrio y fortalece tus músculos.",
        imageSrc: "https://picsum.photos/800/600?random=9",
        imageHint: "health fitness",
        href: "#",
        colorClass: "bg-sky-500 hover:bg-sky-600",
    },
    {
        title: "Ideas Creativas para tu Próxima Fiesta de Cumpleaños",
        description: "Desde fiestas temáticas hasta competencias amistosas, te damos ideas originales para que la próxima celebración de cumpleaños en Jump-In sea inolvidable.",
        imageSrc: "https://picsum.photos/800/600?random=10",
        imageHint: "party ideas",
        href: "#",
        colorClass: "bg-pink-500 hover:bg-pink-600",
    },
    {
        title: "Team Building en Jump-In: ¡Una Experiencia Única!",
        description: "Rompe la rutina de la oficina y fomenta la colaboración y la comunicación en tu equipo con nuestras actividades de team building llenas de energía y diversión.",
        imageSrc: "https://picsum.photos/800/600?random=11",
        imageHint: "team building",
        href: "#",
        colorClass: "bg-purple-500 hover:bg-purple-600",
    }
];

export default function Galeria() {
    return (
        <section id="galeria" className="w-full py-12 bg-white">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
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
                </div>
                <Tabs defaultValue="galeria" className="mt-12">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gray-100 h-auto">
                        <TabsTrigger value="galeria" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white rounded-md py-2 text-sm font-medium">Galería</TabsTrigger>
                        <TabsTrigger value="blog" className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md py-2 text-sm font-medium">Blog</TabsTrigger>
                    </TabsList>
                    <TabsContent value="galeria" className="mt-8">
                        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                    <TabsContent value="blog" className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           {blogPosts.map((post, index) => (
                                <div key={index} className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950">
                                    <Link href={post.href} className="block overflow-hidden">
                                        <Image
                                            src={post.imageSrc}
                                            alt={post.title}
                                            width={800}
                                            height={600}
                                            data-ai-hint={post.imageHint}
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </Link>
                                    <div className="flex flex-1 flex-col p-6">
                                        <h3 className="mb-2 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">{post.title}</h3>
                                        <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">{post.description}</p>
                                        <Link href={post.href}>
                                        <Button className={cn("mt-auto w-full text-white transition-transform group-hover:scale-105", post.colorClass)}>
                                            Leer Más
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                        </Link>
                                    </div>
                                </div>
                           ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

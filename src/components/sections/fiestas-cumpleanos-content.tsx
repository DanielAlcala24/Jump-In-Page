"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, ShieldCheck, Sparkles } from "lucide-react"
import Script from "next/script";

const offerItems = [
    {
      title: 'Diversión Garantizada',
      description: 'Prometemos una experiencia llena de adrenalina y risas para el cumpleañero y sus invitados, creando momentos inolvidables.',
      icon: <Sparkles className="h-10 w-10 text-pink-500" />
    },
    {
      title: 'Variedad de Actividades',
      description: 'Con más de 1,000 m² de trampolines, cuerdas y muros, aseguramos que todos encuentren algo emocionante que hacer.',
      icon: <Gift className="h-10 w-10 text-green-500" />
    },
    {
      title: 'Seguridad Primordial',
      description: 'Contamos con instalaciones de la más alta calidad y un equipo de colaboradores capacitados para garantizar la seguridad en todo momento.',
      icon: <ShieldCheck className="h-10 w-10 text-sky-500" />
    }
  ];

const galleryImages = [
    { src: '/assets/g3.jpeg', alt: 'Niños saltando en fiesta', hint: 'kids jumping party' },
    { src: '/assets/g8.jpeg', alt: 'Pastel de cumpleaños en Jump-In', hint: 'birthday cake' },
    { src: '/assets/g5.jpeg', alt: 'Grupo de amigos celebrando', hint: 'friends celebrating' },
    { src: '/assets/g7.jpeg', alt: 'Decoración de fiesta', hint: 'party decoration' },
]


export default function FiestasCumpleanosContent() {
    return (
        <section id="birthday-content" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-5xl px-4 md:px-6 space-y-16">
                
                {/* Offer Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Tu Fiesta de Cumpleaños Soñada</h2>
                    <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-lg">
                    Jump-In es el lugar donde la diversión extrema y la celebración se encuentran. Ofrecemos una experiencia única para personas de todas las edades, garantizando momentos inolvidables de felicidad.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {offerItems.map((item) => (
                        <Card key={item.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="items-center">
                                <div className="p-4 bg-primary/10 rounded-full">{item.icon}</div>
                                <CardTitle className="font-headline">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Gallery Section */}
                <div>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Galería de Fiestas</h2>
                        <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-lg">
                        Inspírate con momentos de celebraciones pasadas y visualiza la increíble fiesta que puedes tener.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryImages.map((image, index) => (
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
                </div>

                {/* Booking Form Section */}
                <Card className="shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="text-center p-8 bg-primary text-primary-foreground">
                        <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Reserva tu Fiesta</CardTitle>
                        <CardDescription className="text-primary-foreground/80 md:text-lg">
                            Completa el formulario para recibir una cotización. ¡Es fácil y rápido!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Script src="https://js.hsforms.net/forms/embed/48545315.js" defer></Script>
                        <div className="hs-form-frame" data-region="na1" data-form-id="ef6c0690-915a-47c1-84e9-5308f1284fd7" data-portal-id="48545315"></div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

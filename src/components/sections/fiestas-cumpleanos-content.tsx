"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, ShieldCheck, Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Script from "next/script";
import BirthdayGalleryCarousel from "@/components/sections/birthday-gallery-carousel"

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

export default function FiestasCumpleanosContent() {
    useEffect(() => {
        const createForm = () => {
            if ((window as any).hbspt) {
                (window as any).hbspt.forms.create({
                    region: 'na1',
                    portalId: '48545315',
                    formId: 'ef6c0690-915a-47c1-84e9-5308f1284fd7',
                    target: '#hubspot-form-birthday'
                });
            }
        };

        if ((window as any).hbspt) {
            createForm();
        }

        return () => {
            const container = document.getElementById('hubspot-form-birthday');
            if (container) container.innerHTML = '';
        };
    }, []);

    return (
        <section id="birthday-content" className="w-full pb-12 md:pb-24 pt-4 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-5xl px-4 md:px-6 space-y-16">

                {/* Gallery Section */}
                <div>
                    <BirthdayGalleryCarousel />

                    <div className="mt-8 flex justify-center">
                        <Button asChild className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-7 rounded-full text-lg font-bold shadow-xl transition-all hover:scale-105 flex items-center gap-3">
                            <Link
                                href="https://wa.me/525536441494?text=%C2%A1Hola!%20Me%20gustar%C3%ADa%20cotizar%20mi%20fiesta%20en%20Jump-In.%20Aqu%C3%AD%20est%C3%A1n%20mis%20datos%3A%0A%0A*%20Nombre%20completo%20del%20tutor%3A%20%0A*%20N%C3%BAmero%20de%20invitados%20ni%C3%B1os%3A%20%0A*%20N%C3%BAmero%20de%20invitados%20adultos%3A%20%0A*%20Correo%20electr%C3%B3nico%3A%20%0A*%20N%C3%BAmero%20de%20tel%C3%A9fono%3A%20%0A*%20Sucursal%3A%20%0A*%20Fecha%20del%20evento%3A%20%0A*%20Nombre%20del%20festejado(a)%3A%20%0A*%20Edad%20que%20cumple%3A%20%0A*%20Hora%20de%20ingreso%3A%20"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle className="h-7 w-7" />
                                Pedir Cotización por WhatsApp
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center mt-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Tu Fiesta en Jump-In</h2>
                        <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-lg">
                            Mira cómo es **celebrar en Jump-In** e inspírate para tener la mejor fiesta de cumpleaños con nosotros.
                        </p>
                    </div>
                </div>

                {/* Offer Section */}
                <div className="text-center pt-8">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">¿Quieres celebrar en Jump-In? Tu fiesta soñada</h2>
                    <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-lg">
                        El mejor **cumpleaños Jump-In** te espera. Somos el lugar donde la diversión extrema y la celebración se encuentran, garantizando momentos inolvidables para todas las edades.
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

                {/* Booking Form Section */}
                <Card className="shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="text-center p-8 bg-primary text-primary-foreground">
                        <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Cotizar en Jump-In es fácil</CardTitle>
                        <CardDescription className="text-primary-foreground/80 md:text-lg">
                            Completa el formulario para recibir una cotización para tu **fiesta en Jump-In**. ¡Es rápido y sencillo!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Script
                            src="https://js.hsforms.net/forms/embed/v2.js"
                            strategy="lazyOnload"
                            onLoad={() => {
                                if ((window as any).hbspt) {
                                    (window as any).hbspt.forms.create({
                                        region: 'na1',
                                        portalId: '48545315',
                                        formId: 'ef6c0690-915a-47c1-84e9-5308f1284fd7',
                                        target: '#hubspot-form-birthday'
                                    });
                                }
                            }}
                        />
                        <div id="hubspot-form-birthday"></div>
                    </CardContent>
                </Card>
            </div>
        </section >
    )
}

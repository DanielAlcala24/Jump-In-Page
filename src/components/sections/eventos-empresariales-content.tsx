"use client"

import { useEffect } from "react";
import Script from "next/script";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Zap, Gamepad2 } from "lucide-react"

const offerItems = [
    {
        title: 'Espacio Activo y Dinámico',
        description: 'Más de 1,000 m² de trampolines, cuerdas y muros en un entorno seguro con personal capacitado para una experiencia única.',
        icon: <Zap className="h-10 w-10 text-purple-500" />
    },
    {
        title: 'Fomenta el Team Building',
        description: 'Mejora la comunicación, el trabajo en equipo y el bienestar físico de tus empleados a través de actividades divertidas.',
        icon: <Users className="h-10 w-10 text-green-500" />
    },
    {
        title: 'Atracciones para la Integración',
        description: 'Actividades diseñadas para promover la interacción, el desafío colectivo y fortalecer la confianza en tu equipo.',
        icon: <Target className="h-10 w-10 text-sky-500" />
    }
];

const attractions = [
    { name: 'Dodgeball Extreme', description: 'Competencias divertidas y estratégicas entre equipos.' },
    { name: 'Ropes Course', description: 'Desafíos de altura y tirolesa para fomentar la confianza.' },
    { name: 'Climbing Wall', description: 'Supera retos individuales y de equipo.' },
    { name: 'Arena de Futbol', description: 'Para actividades más tradicionales y colaborativas.' },
    { name: 'Foampit', description: 'Libera estrés y diviértete de forma segura.' },
]

export default function EventosEmpresarialesContent() {
    useEffect(() => {
        // Function to create the form
        const createForm = () => {
            if ((window as any).hbspt) {
                (window as any).hbspt.forms.create({
                    region: 'na1',
                    portalId: '48545315',
                    formId: 'ef6c0690-915a-47c1-84e9-5308f1284fd7',
                    target: '#hubspot-form-corporate'
                });
            }
        };

        // If the script is already loaded, create the form immediately
        if ((window as any).hbspt) {
            createForm();
        }

        // Clean up or handle re-mounts if necessary
        return () => {
            const container = document.getElementById('hubspot-form-corporate');
            if (container) container.innerHTML = '';
        };
    }, []);

    return (
        <section id="corporate-content" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-5xl px-4 md:px-6 space-y-16">

                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Un Evento Empresarial Fuera de Serie</h2>
                    <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-lg">
                        Jump-In es el lugar ideal para poner a prueba habilidades físicas y mentales, fomentando la dinámica de equipo en un innovador centro de entretenimiento que combina diversión, ejercicio y deporte.
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

                <Card className="shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Atracciones para la Integración</CardTitle>
                        <CardDescription className="md:text-lg">Actividades que promueven la interacción y el desafío colectivo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {attractions.map((attraction) => (
                                <li key={attraction.name} className="flex items-start gap-4">
                                    <div className="p-2 bg-primary/10 rounded-full mt-1">
                                        <Gamepad2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold font-headline">{attraction.name}</h4>
                                        <p className="text-muted-foreground text-sm">{attraction.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Booking Form Section */}
                <Card className="shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="text-center p-8 bg-primary text-primary-foreground">
                        <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Reserva tu Fiesta</CardTitle>
                        <CardDescription className="text-primary-foreground/80 md:text-lg">
                            Completa el formulario para recibir una cotización. ¡Es fácil y rápido!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Script
                            src="https://js.hsforms.net/forms/embed/v2.js"
                            strategy="afterInteractive"
                            onLoad={() => {
                                if ((window as any).hbspt) {
                                    (window as any).hbspt.forms.create({
                                        region: 'na1',
                                        portalId: '48545315',
                                        formId: 'ef6c0690-915a-47c1-84e9-5308f1284fd7',
                                        target: '#hubspot-form-corporate'
                                    });
                                }
                            }}
                        />
                        <div id="hubspot-form-corporate"></div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

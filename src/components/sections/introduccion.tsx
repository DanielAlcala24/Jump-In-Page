import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

export default function Introduccion() {
    return (
      <section id="introduccion" className="w-full py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-lg border bg-white text-card-foreground shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
                <div className="p-6 md:p-8 order-2 md:order-1">
                    <div className="space-y-4 text-center">
                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                        ¿Quiénes Somos?
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                        Más que Solo Saltar
                        </h2>
                        <p className="text-muted-foreground md:text-lg/relaxed">
                        Jump-In es un innovador centro de entretenimiento que integra diversión, actividad física y deporte para todas las edades. Nuestro compromiso es ofrecer un entorno seguro con instalaciones de la más alta calidad y personal capacitado para que tu única preocupación sea disfrutar al máximo.
                        </p>
                        <p className="text-muted-foreground md:text-lg/relaxed">
                            Contamos con sucursales en <strong>CDMX</strong>, <strong>Estado de México</strong> y nuestra sucursal foránea en <strong>Cuernavaca</strong>.
                        </p>
                        <Link href="#precios-promociones" className="inline-flex">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                            <Ticket className="mr-2 h-5 w-5" />
                            Precios y Promociones
                        </Button>
                        </Link>
                    </div>
                </div>
                <div className="relative aspect-video pointer-events-none order-1 md:order-2 p-6 md:p-8">
                    <iframe
                        className="absolute inset-6 md:inset-8 w-[calc(100%-2*1.5rem)] md:w-[calc(100%-2*2rem)] h-[calc(100%-2*1.5rem)] md:h-[calc(100%-2*2rem)]"
                        src="https://www.youtube.com/embed/v5dFh5FjU8M?autoplay=1&mute=1&controls=0&loop=1&playlist=v5dFh5FjU8M"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    <div className="absolute inset-0 w-full h-full bg-transparent"></div>
                </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

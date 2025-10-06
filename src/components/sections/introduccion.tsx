import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

export default function Introduccion() {
    return (
      <section id="introduccion" className="w-full py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-lg border bg-white text-card-foreground shadow-lg overflow-hidden p-6 md:p-8">
            <div className="grid md:grid-cols-2 items-center gap-6 md:gap-8">
                <div className="order-2 md:order-1 flex flex-col items-center">
                    <div className="space-y-4 text-center">
                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                        ¿Quiénes Somos?
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                        Más que Solo Saltar
                        </h2>
                        <p className="text-muted-foreground md:text-lg/relaxed">
                        Jump-In es un innovador centro de entretenimiento que integra diversión, entretenimiento y deporte para todas las edades. Nuestro compromiso es ofrecer un entorno seguro y limpio con instalaciones de primer nivel y un equipo altamente capacitado, para que lo único que tengas que hacer sea disfrutar y pasar momentos inolvidables.
                        </p>
                        <p className="text-muted-foreground md:text-lg/relaxed">
                            Contamos con sucursales en <strong>CDMX</strong>, <strong>Estado de México</strong> y nuestra sucursal foránea en <strong>Cuernavaca</strong>.
                        </p>
                        <Link href="/precios-y-promociones?tab=Promociones" className="inline-flex md:hidden">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                            <Ticket className="mr-2 h-5 w-5" />
                            Precios y Promociones
                        </Button>
                        </Link>
                    </div>
                </div>
                <div className="order-1 md:order-2 flex flex-col items-center">
                    <div className="relative aspect-video pointer-events-none w-full overflow-hidden rounded-lg">
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/v5dFh5FjU8M?autoplay=1&mute=1&controls=0&loop=1&playlist=v5dFh5FjU8M"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <div className="absolute inset-0 w-full h-full bg-transparent"></div>
                    </div>
                    <Link href="/precios-y-promociones?tab=Promociones" className="hidden md:inline-flex mt-4">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                            <Ticket className="mr-2 h-5 w-5" />
                            Precios y Promociones
                        </Button>
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

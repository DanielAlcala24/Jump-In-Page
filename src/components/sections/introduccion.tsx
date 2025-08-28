import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

export default function Introduccion() {
    return (
      <section id="introduccion" className="w-full py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                  ¿Quiénes Somos?
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Más que Solo Saltar
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Jump-In es un innovador centro de entretenimiento que integra diversión, actividad física y deporte para todas las edades. Nuestro compromiso es ofrecer un entorno seguro con instalaciones de la más alta calidad y personal capacitado para que tu única preocupación sea disfrutar al máximo.
                </p>
                <Link href="#precios-promociones" className="inline-flex">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Ticket className="mr-2 h-5 w-5" />
                    Precios y Promociones
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-video pointer-events-none">
                <iframe
                    className="absolute inset-0 w-full h-full rounded-lg"
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
      </section>
    );
  }
  
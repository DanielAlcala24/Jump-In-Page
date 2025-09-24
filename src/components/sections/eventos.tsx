import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const eventItems = [
  {
    title: 'Fiestas de Cumpleaños',
    description: 'Celebra un día inolvidable con saltos, risas y pastel. ¡Nos encargamos de todo para que tú solo te diviertas!',
    videoUrl: 'https://www.youtube.com/embed/v5dFh5FjU8M?autoplay=1&mute=1&controls=0&loop=1&playlist=v5dFh5FjU8M',
    buttonText: 'Cotizar Fiesta',
    href: '/fiestas-y-eventos/fiestas-cumpleanos',
    colorClass: 'bg-orange-500 hover:bg-orange-600 border-orange-600',
  },
  {
    title: 'Eventos Empresariales',
    description: 'Fomenta el trabajo en equipo y desestresa a tu personal con una jornada llena de energía y actividades únicas.',
    videoUrl: 'https://www.youtube.com/embed/v5dFh5FjU8M?autoplay=1&mute=1&controls=0&loop=1&playlist=v5dFh5FjU8M',
    buttonText: 'Ver Paquetes',
    href: '/fiestas-y-eventos/eventos-empresariales',
    colorClass: 'bg-green-500 hover:bg-green-600 border-green-600',
  },
  {
    title: 'Nuestras Sucursales',
    description: 'Encuentra el Jump-In más cercano y prepárate para la acción. ¡Siempre hay uno cerca de ti esperándote!',
    videoUrl: 'https://www.youtube.com/embed/v5dFh5FjU8M?autoplay=1&mute=1&controls=0&loop=1&playlist=v5dFh5FjU8M',
    buttonText: 'Encontrar Sucursal',
    href: '/sucursales',
    colorClass: 'bg-purple-500 hover:bg-purple-600 border-purple-600',
  },
  {
    title: 'Nuestras Atracciones',
    description: 'Desde albercas de espuma hasta paredes de escalada, descubre todas las emocionantes áreas que tenemos para ti.',
    videoUrl: 'https://www.youtube.com/embed/v5dFh5FjU8M?autoplay=1&mute=1&controls=0&loop=1&playlist=v5dFh5FjU8M',
    buttonText: 'Explorar Atracciones',
    href: '#',
    colorClass: 'bg-sky-500 hover:bg-sky-600 border-sky-600',
  },
];

export default function Eventos() {
  return (
    <section id="eventos" className="w-full py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {eventItems.map((item) => (
            <div
              key={item.title}
              className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950"
            >
              <div className="relative aspect-video w-full overflow-hidden pointer-events-none">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={item.videoUrl}
                  title={`YouTube video: ${item.title}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="absolute inset-0 w-full h-full bg-transparent"></div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">{item.title}</h3>
                <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                <Link href={item.href}>
                  <Button className={cn("mt-auto w-full text-white transition-transform group-hover:scale-105", item.colorClass)}>
                    {item.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

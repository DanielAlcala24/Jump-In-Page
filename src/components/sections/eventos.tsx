import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const eventItems = [
  {
    title: 'Fiestas de Cumpleaños',
    description: 'Celebra un día inolvidable con saltos, risas y pastel. ¡Nos encargamos de todo para que tú solo te diviertas!',
    imageUrl: '/assets/g8-1.jpeg',
    imageHint: 'birthday party',
    buttonText: 'Cotizar Fiesta',
    href: '/fiestas-y-eventos/fiestas-cumpleanos',
    colorClass: 'bg-orange-500 hover:bg-orange-600 border-orange-600',
  },
  {
    title: 'Eventos Empresariales',
    description: 'Fomenta el trabajo en equipo y desestresa a tu personal con una jornada llena de energía y actividades únicas.',
    imageUrl: '/assets/teambuilding.jpg',
    imageHint: 'corporate event',
    buttonText: 'Ver Paquetes',
    href: '/fiestas-y-eventos/eventos-empresariales',
    colorClass: 'bg-orange-500 hover:bg-orange-600 border-orange-600',
  },
  {
    title: 'Nuestras Sucursales',
    description: 'Encuentra el Jump-In más cercano y prepárate para la acción. ¡Siempre hay uno cerca de ti esperándote!',
    imageUrl: '/assets/g1.jpg',
    imageHint: 'trampoline park',
    buttonText: 'Encontrar Sucursal',
    href: '/sucursales',
    colorClass: 'bg-orange-500 hover:bg-orange-600 border-orange-600',
  },
  {
    title: 'Nuestras Atracciones',
    description: 'Desde albercas de espuma hasta paredes de escalada, descubre todas las emocionantes áreas que tenemos para ti.',
    imageUrl: '/assets/g1.jpg',
    imageHint: 'climbing wall',
    buttonText: 'Explorar Atracciones',
    href: '/atracciones',
    colorClass: 'bg-orange-500 hover:bg-orange-600 border-orange-600',
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
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  data-ai-hint={item.imageHint}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
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

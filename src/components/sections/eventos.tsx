import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const eventItems = [
  {
    title: 'Fiestas de Cumpleaños',
    description: 'Celebra un día inolvidable con saltos, risas y pastel. ¡Nos encargamos de todo para que tú solo te diviertas!',
    videoUrl: 'https://www.youtube.com/embed/Nzi01h_e_Xg',
    buttonText: 'Cotizar Fiesta',
    href: '#',
  },
  {
    title: 'Eventos Empresariales',
    description: 'Fomenta el trabajo en equipo y desestresa a tu personal con una jornada llena de energía y actividades únicas.',
    videoUrl: 'https://www.youtube.com/embed/8_4119A9iYw',
    buttonText: 'Ver Paquetes',
    href: '#',
  },
  {
    title: 'Nuestras Sucursales',
    description: 'Encuentra el Jump-In más cercano y prepárate para la acción. ¡Siempre hay uno cerca de ti esperándote!',
    videoUrl: 'https://www.youtube.com/embed/yub524Xd09Y',
    buttonText: 'Encontrar Sucursal',
    href: '#',
  },
  {
    title: 'Nuestras Atracciones',
    description: 'Desde albercas de espuma hasta paredes de escalada, descubre todas las emocionantes áreas que tenemos para ti.',
    videoUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ',
    buttonText: 'Explorar Atracciones',
    href: '#',
  },
];

export default function Eventos() {
  return (
    <section id="eventos" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {eventItems.map((item) => (
            <div
              key={item.title}
              className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950"
            >
              <div className="relative aspect-[9/16] w-full overflow-hidden">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={item.videoUrl}
                  title={`YouTube video: ${item.title}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">{item.title}</h3>
                <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                <Link href={item.href}>
                  <Button className="mt-auto w-full transition-transform group-hover:scale-105">
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

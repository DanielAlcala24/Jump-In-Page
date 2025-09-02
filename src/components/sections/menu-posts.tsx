'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const menuItems = [
  {
    title: 'Pizza de Pepperoni',
    description: 'Clásica y deliciosa, con extra queso y pepperoni de primera.',
    price: '$180.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=1',
    imageHint: 'pepperoni pizza',
  },
  {
    title: 'Hamburguesa Jump-In',
    description:
      'Jugosa carne de res, queso cheddar, tocino crujiente y nuestros aderezos secretos.',
    price: '$150.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=2',
    imageHint: 'classic burger',
  },
  {
    title: 'Hot Dog Especial',
    description: 'Salchicha jumbo, pan artesanal y tus toppings favoritos.',
    price: '$90.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=3',
    imageHint: 'special hotdog',
  },
  {
    title: 'Nuggets de Pollo',
    description:
      'Crujientes por fuera, tiernos por dentro. Acompañados de papas a la francesa.',
    price: '$120.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=4',
    imageHint: 'chicken nuggets',
  },
  {
    title: 'Malteada de Chocolate',
    description:
      'Cremosa y refrescante, el postre perfecto después de tanto saltar.',
    price: '$70.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=5',
    imageHint: 'chocolate milkshake',
  },
  {
    title: 'Refresco de Sabores',
    description:
      'La bebida ideal para recargar energías y seguir la diversión.',
    price: '$40.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=6',
    imageHint: 'soda drink',
  },
];

export default function MenuPosts() {
  return (
    <section id="menu" className="w-full py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-100 dark:bg-gray-800/50 overflow-hidden transition-all duration-300 ease-in-out transform-gpu hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
              style={{ perspective: '1000px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-300" style={{ transform: 'translateZ(-1px)' }}></div>

              <div className="relative w-48 h-48 mb-6 transform-gpu group-hover:scale-110 transition-transform duration-500 ease-out">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={400}
                  height={400}
                  data-ai-hint={item.imageHint}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="relative text-center flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="mb-2 text-2xl font-bold font-headline text-gray-900 dark:text-gray-50">
                        {item.title}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                        {item.description}
                    </p>
                </div>
                <div className="mt-4 flex flex-col items-center gap-4 w-full">
                    <p className="text-2xl font-bold text-primary dark:text-orange-400">{item.price}</p>
                    <Button
                        className={cn(
                        'w-full bg-gradient-to-r from-orange-500 to-accent text-white transition-all duration-300 transform-gpu group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-accent/50 hover:from-orange-600 hover:to-accent'
                        )}
                    >
                        Ordenar
                    </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
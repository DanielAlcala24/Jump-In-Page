'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';

const menuItems = [
  {
    title: 'Pizza de Pepperoni',
    description: 'Clásica y deliciosa, con extra queso y pepperoni de primera.',
    price: '$180.00 MXN',
    imageSrc: 'https://picsum.photos/600/400?random=1',
    imageHint: 'pepperoni pizza',
  },
  {
    title: 'Hamburguesa Jump-In',
    description:
      'Jugosa carne de res, queso cheddar, tocino crujiente y nuestros aderezos secretos.',
    price: '$150.00 MXN',
    imageSrc: 'https://picsum.photos/600/400?random=2',
    imageHint: 'classic burger',
  },
  {
    title: 'Hot Dog Especial',
    description: 'Salchicha jumbo, pan artesanal y tus toppings favoritos.',
    price: '$90.00 MXN',
    imageSrc: 'https://picsum.photos/600/400?random=3',
    imageHint: 'special hotdog',
  },
  {
    title: 'Nuggets de Pollo',
    description:
      'Crujientes por fuera, tiernos por dentro. Acompañados de papas a la francesa.',
    price: '$120.00 MXN',
    imageSrc: 'https://picsum.photos/600/400?random=4',
    imageHint: 'chicken nuggets',
  },
  {
    title: 'Malteada de Chocolate',
    description:
      'Cremosa y refrescante, el postre perfecto después de tanto saltar.',
    price: '$70.00 MXN',
    imageSrc: 'https://picsum.photos/600/400?random=5',
    imageHint: 'chocolate milkshake',
  },
  {
    title: 'Refresco de Sabores',
    description:
      'La bebida ideal para recargar energías y seguir la diversión.',
    price: '$40.00 MXN',
    imageSrc: 'https://picsum.photos/600/400?random=6',
    imageHint: 'soda drink',
  },
];

export default function MenuPosts() {
  return (
    <section id="menu" className="w-full py-12 bg-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="group flex flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950"
            >
              <div className="overflow-hidden">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={600}
                  height={400}
                  data-ai-hint={item.imageHint}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">
                  {item.title}
                </h3>
                <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">{item.price}</p>
                    <Button
                        className={cn(
                        'bg-orange-500 hover:bg-orange-600 text-white transition-transform group-hover:scale-105'
                        )}
                    >
                        Ordenar
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

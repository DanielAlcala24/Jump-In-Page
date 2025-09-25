'use client';
import { useState } from 'react';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  {
    title: 'Pizza de Pepperoni',
    description: 'Clásica y deliciosa, con extra queso y pepperoni de primera.',
    price: '$180.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'pepperoni pizza',
    category: 'Alimentos',
  },
  {
    title: 'Hamburguesa Jump-In',
    description:
      'Jugosa carne de res, queso cheddar, tocino crujiente y nuestros aderezos secretos.',
    price: '$150.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'classic burger',
    category: 'Alimentos',
  },
  {
    title: 'Hot Dog Especial',
    description: 'Salchicha jumbo, pan artesanal y tus toppings favoritos.',
    price: '$90.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'special hotdog',
    category: 'Alimentos',
  },
  {
    title: 'Nuggets de Pollo',
    description:
      'Crujientes por fuera, tiernos por dentro. Acompañados de papas a la francesa.',
    price: '$120.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'chicken nuggets',
    category: 'Snacks',
  },
  {
    title: 'Palomitas de Maíz',
    description: 'Recién hechas, con el toque justo de mantequilla y sal.',
    price: '$60.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'popcorn bucket',
    category: 'Snacks',
  },
  {
    title: 'Malteada de Chocolate',
    description:
      'Cremosa y refrescante, el postre perfecto después de tanto saltar.',
    price: '$70.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'chocolate milkshake',
    category: 'Bebidas',
  },
  {
    title: 'Refresco de Sabores',
    description:
      'La bebida ideal para recargar energías y seguir la diversión.',
    price: '$40.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'soda drink',
    category: 'Bebidas',
  },
  {
    title: 'Gomitas Acidas',
    description: 'Una explosión de sabor que te hará hacer caras divertidas.',
    price: '$50.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'sour gummies',
    category: 'Dulces',
  },
  {
    title: 'Barra de Chocolate',
    description: 'El clásico que nunca falla para un antojo dulce.',
    price: '$35.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'chocolate bar',
    category: 'Dulces',
  },
];

const categories = ['Alimentos', 'Bebidas', 'Snacks', 'Dulces'];

export default function MenuPosts() {
  const [selectedCategory, setSelectedCategory] = useState('Alimentos');

  const filteredItems = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <section id="menu" className="w-full py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-2 md:px-6">
        <div className="sticky top-14 z-30 py-4 mb-8">
           <div className="flex justify-center">
            <div className="inline-flex flex-wrap justify-center items-center bg-white border border-gray-200 rounded-full p-1 shadow-lg">
              {categories.map((category, index) => (
                <React.Fragment key={category}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'transition-colors duration-300 text-base font-medium h-auto py-2 px-2',
                      'focus-visible:ring-transparent whitespace-nowrap',
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'text-primary hover:bg-primary/10',
                      'rounded-full'
                    )}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                  {index < categories.length - 1 && (
                    <Separator orientation="vertical" className="h-6 bg-gray-200 last-of-type:hidden" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950 text-center p-6 hover:-translate-y-2"
            >
              <div className="relative w-40 h-40 mb-4 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={400}
                  height={400}
                  data-ai-hint={item.imageHint}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="mb-2 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">
                  {item.title}
                </h3>
                <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
                <div className="mt-auto">
                  <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-base font-bold text-primary font-headline">
                    {item.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

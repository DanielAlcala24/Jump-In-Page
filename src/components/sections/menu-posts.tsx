'use client';
import { useState } from 'react';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  //Alimentos
  {
    title: 'Alitas',
    description: '300g. BBQ, Red hot, Mango habanero ó Mix',
    price: '$140.00 MXN',
    imageSrc: '/assets/menu/alimentos/alitas.png',
    imageHint: 'Alitas',
    category: 'Alimentos',
  },
  {
    title: 'Boneless',
    description: '300g. BBQ, Red hot, Mango habanero ó Mix',
    price: '$150.00 MXN',
    imageSrc: '/assets/menu/alimentos/boneless.png',
    imageHint: 'Alitas',
    category: 'Alimentos',
  },

  //Snacks
  {
    title: 'Nuggets de Pollo',
    description:
      'Crujientes por fuera, tiernos por dentro. Acompañados de papas a la francesa.',
    price: '$120.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'chicken nuggets',
    category: 'Snacks',
  },

  //Bebidas
  {
    title: 'Agua',
    description:
      '600ml.',
    price: '$30.00 MXN',
    imageSrc: '/assets/menu/bebidas/agua600.png',
    imageHint: 'agua600ml',
    category: 'Bebidas',
  },
  {
    title: 'Agua',
    description:
      '1L.',
    price: '$40.00 MXN',
    imageSrc: '/assets/menu/bebidas/aguaL.png',
    imageHint: 'agua1l.',
    category: 'Bebidas',
  },
  {
    title: 'Gatorade',
    description:
      '500ml.',
    price: '$45.00 MXN',
    imageSrc: '/assets/menu/bebidas/gatorade.png',
    imageHint: 'Gatorade',
    category: 'Bebidas',
  },
  {
    title: 'Jumex Fresh',
    description:
      '400ml.',
    price: '$25.00 MXN',
    imageSrc: '/assets/menu/bebidas/jugo.png',
    imageHint: 'jumex fresh',
    category: 'Bebidas',
  },
  {
    title: 'Refresco',
    description:
      '355ml. Botella o lata de varios sabores.',
    price: '$30.00 MXN',
    imageSrc: '/assets/menu/bebidas/refresco.png',
    imageHint: 'Refresco',
    category: 'Bebidas',
  },
  {
    title: 'Soda Pitufo',
    description:
      '414ml. Blue berry.',
    price: '$45.00 MXN',
    imageSrc: '/assets/menu/bebidas/sodaPitufo.png',
    imageHint: 'Soda Pitufo',
    category: 'Bebidas',
  },
  {
    title: 'Soda Pantera Rosa',
    description:
      '414ml. Pink Lemonade.',
    price: '$45.00 MXN',
    imageSrc: '/assets/menu/bebidas/sodaPanteraRosa.png',
    imageHint: 'Soda Pantera Rosa',
    category: 'Bebidas',
  },
  {
    title: 'Soda Wazowski',
    description:
      '414ml. Manzana verde.',
    price: '$45.00 MXN',
    imageSrc: '/assets/menu/bebidas/sodaWazowski.png',
    imageHint: 'Soda Wazowski',
    category: 'Bebidas',
  },
  {
    title: 'Agua',
    description:
      '2L. Natural.',
    price: '$40.00 MXN',
    imageSrc: '/assets/menu/bebidas/jarraAgua.png',
    imageHint: 'Agua 2L.',
    category: 'Bebidas',
  },
  {
    title: 'Agua',
    description:
      '2L. Horchata, jamaica, limón ó naranja.',
    price: '$60.00 MXN',
    imageSrc: '/assets/menu/bebidas/jarraSabores.png',
    imageHint: 'Agua 2L Sabores.',
    category: 'Bebidas',
  },

  //Dulces
  {
    title: 'Gomitas Acidas',
    description: 'Una explosión de sabor que te hará hacer caras divertidas.',
    price: '$50.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'sour gummies',
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
              className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  data-ai-hint={item.imageHint}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 text-center">
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
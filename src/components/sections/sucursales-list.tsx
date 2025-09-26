
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import React from 'react';

const sucursalesData = [
  {
    category: 'Estado de México',
    locations: [
      { name: 'Coacalco', image: '/assets/g1.jpg', link: '/sucursales/coacalco' },
      { name: 'Ecatepec', image: '/assets/g2.jpg', link: '/sucursales/ecatepec' },
      { name: 'Interlomas', image: '/assets/g3.jpeg', link: '/sucursales/interlomas' },
      { name: 'La Cúspide', image: '/assets/g4.jpeg', link: '/sucursales/cuspide' },
    ],
  },
  {
    category: 'CDMX',
    locations: [
      { name: 'Churubusco', image: '/assets/g5.jpeg', link: '/sucursales/churubusco' },
      { name: 'Miramontes', image: '/assets/g6.jpeg', link: '/sucursales/miramontes' },
      { name: 'Vallejo', image: '/assets/g7.jpeg', link: '/sucursales/vallejo' },
    ],
  },
  {
    category: 'Morelos',
    locations: [
      { name: 'Cuernavaca', image: '/assets/g8.jpeg', link: '/sucursales/cuernavaca' },
    ],
  },
];

const categories = sucursalesData.map(g => g.category);

export default function SucursalesList() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    
    const filteredSucursales = selectedCategory
        ? sucursalesData.filter(group => group.category === selectedCategory)
        : sucursalesData;

  return (
    <section id="sucursales-list" className="w-full py-6 md:py-6 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="sticky top-16 z-30 py-4 mb-10">
           <div className="flex justify-center">
            <div className="inline-flex flex-wrap justify-center items-center bg-white border border-gray-200 rounded-full p-1 shadow-lg">
              {categories.map((category, index) => (
                <React.Fragment key={category}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'transition-colors duration-300 text-base font-medium h-auto py-2 px-4',
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

        {filteredSucursales.map((group) => (
          <div key={group.category} className="mb-16">
            {selectedCategory === null && (
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                        {group.category}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                        Encuéntranos en {group.category}
                    </h2>
                </div>
            )}
            <div className="flex flex-wrap justify-center gap-8">
              {group.locations.map((sucursal) => (
                <div
                  key={sucursal.name}
                  className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950 text-center w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
                >
                  <Link href={sucursal.link} className="block overflow-hidden">
                    <Image
                      src={sucursal.image}
                      alt={`Sucursal ${sucursal.name}`}
                      width={600}
                      height={400}
                      data-ai-hint="trampoline park"
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-4 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">
                      {sucursal.name}
                    </h3>
                    <Link href={sucursal.link} className="mt-auto">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-transform group-hover:scale-105">
                        <MapPin className="mr-2 h-4 w-4" />
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

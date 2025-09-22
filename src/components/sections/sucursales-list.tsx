'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const sucursalesData = [
  {
    category: 'Estado de México',
    locations: [
      { name: 'Coacalco', image: 'https://picsum.photos/seed/coacalco/600/400', link: '#' },
      { name: 'Ecatepec', image: 'https://picsum.photos/seed/ecatepec/600/400', link: '#' },
      { name: 'Interlomas', image: 'https://picsum.photos/seed/interlomas/600/400', link: '#' },
      { name: 'La Cúspide', image: 'https://picsum.photos/seed/cuspide/600/400', link: '#' },
    ],
  },
  {
    category: 'CDMX',
    locations: [
      { name: 'Churubusco', image: 'https://picsum.photos/seed/churubusco/600/400', link: '#' },
      { name: 'Miramontes', image: 'https://picsum.photos/seed/miramontes/600/400', link: '#' },
      { name: 'Vallejo', image: 'https://picsum.photos/seed/vallejo/600/400', link: '#' },
    ],
  },
  {
    category: 'Morelos',
    locations: [
      { name: 'Cuernavaca', image: 'https://picsum.photos/seed/cuernavaca/600/400', link: '#' },
    ],
  },
];

export default function SucursalesList() {
  return (
    <section id="sucursales-list" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {sucursalesData.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-16">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                    {group.category}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Encuéntranos en {group.category}
                </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {group.locations.map((sucursal, index) => (
                <div
                  key={index}
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

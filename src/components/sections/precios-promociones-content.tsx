'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const sucursales = [
    { name: 'Coacalco', image: '/assets/g1.jpg', link: '/sucursales/coacalco', hint: 'trampoline park' },
    { name: 'Ecatepec', image: '/assets/g2.jpg', link: '/sucursales/ecatepec', hint: 'trampoline park' },
    { name: 'Interlomas', image: '/assets/g3.jpeg', link: '/sucursales/interlomas', hint: 'trampoline park' },
    { name: 'La Cúspide', image: '/assets/g4.jpeg', link: '/sucursales/cuspide', hint: 'trampoline park' },
    { name: 'Churubusco', image: '/assets/g5.jpeg', link: '/sucursales/churubusco', hint: 'trampoline park' },
    { name: 'Miramontes', image: '/assets/g6.jpeg', link: '/sucursales/miramontes', hint: 'trampoline park' },
    { name: 'Vallejo', image: '/assets/g7.jpeg', link: '/sucursales/vallejo', hint: 'trampoline park' },
    { name: 'Cuernavaca', image: '/assets/g8.jpeg', link: '/sucursales/cuernavaca', hint: 'trampoline park' },
];

const promotions = [
  {
    title: 'Martes 2x1',
    description: '¡Los martes son de amigos! Compra una hora de salto y obtén la segunda gratis para un acompañante.',
    image: '/assets/g5.jpeg',
    hint: 'friends jumping',
    availableIn: ['Todas las sucursales']
  },
  {
    title: 'Jueves de Estudiantes',
    description: 'Presenta tu credencial de estudiante vigente y obtén un 20% de descuento en tu entrada.',
    image: '/assets/g2.jpg',
    hint: 'student discount',
    availableIn: ['Coacalco', 'Ecatepec', 'Vallejo']
  },
  {
    title: 'Domingo Familiar',
    description: 'Paquete familiar (2 adultos, 2 niños) por solo $750 la hora. ¡El plan perfecto para el fin de semana!',
    image: '/assets/g8.jpeg',
    hint: 'family fun',
    availableIn: ['Todas las sucursales']
  },
  {
    title: 'Promo Cumpleañero',
    description: '¿Es tu mes de cumpleaños? Presenta tu INE y salta ¡GRATIS! en la compra de 3 accesos para tus amigos.',
    image: '/assets/g3.jpeg',
    hint: 'birthday person',
    availableIn: ['Interlomas', 'La Cúspide', 'Cuernavaca']
  },
];


const categories = ['Precios', 'Promociones'];

function PreciosPromocionesContentComponent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'Promociones' ? 'Promociones' : 'Precios';
  const [selectedCategory, setSelectedCategory] = useState(initialTab);

  useEffect(() => {
    const newTab = searchParams.get('tab');
    if (newTab && categories.includes(newTab)) {
      setSelectedCategory(newTab);
    }
  }, [searchParams]);

  return (
    <section id="content" className="w-full py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-2 md:px-6">
        <div className="sticky top-14 z-30 py-4 mb-8">
           <div className="flex justify-center">
            <div className="inline-flex flex-wrap justify-center items-center bg-white border border-gray-200 rounded-full p-1 shadow-lg">
              {categories.map((category, index) => (
                <>
                  <Button
                    key={category}
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
                </>
              ))}
            </div>
          </div>
        </div>

        {selectedCategory === 'Precios' && (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {sucursales.map((sucursal, index) => (
                    <Card key={index} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group">
                        <CardHeader className="p-0">
                            <Image src={sucursal.image} alt={`Sucursal ${sucursal.name}`} width={600} height={400} data-ai-hint={sucursal.hint} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
                        </CardHeader>
                        <CardContent className="p-6 flex-grow flex flex-col items-center text-center">
                            <CardTitle className="font-headline text-xl">{sucursal.name}</CardTitle>
                        </CardContent>
                         <CardFooter className="p-4">
                            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                              <Link href={sucursal.link}>
                                Checar Precios
                                <ArrowRight className="ml-2 h-4 w-4"/>
                              </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
           </div>
        )}

        {selectedCategory === 'Promociones' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {promotions.map((promo, index) => (
                    <Card key={index} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                        <CardHeader className="p-0">
                            <Image src={promo.image} alt={promo.title} width={600} height={400} data-ai-hint={promo.hint} className="w-full h-48 object-cover"/>
                        </CardHeader>
                        <CardContent className="p-6 flex-grow">
                            <CardTitle className="font-headline text-xl">{promo.title}</CardTitle>
                            <CardDescription className="my-2">{promo.description}</CardDescription>
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold flex items-center mb-2"><MapPin className="mr-1 h-4 w-4 text-muted-foreground"/>Disponible en:</h4>
                              <div className="flex flex-wrap gap-2">
                                {promo.availableIn.map(sucursal => (
                                  <Badge key={sucursal} variant="secondary">{sucursal}</Badge>
                                ))}
                              </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
           </div>
        )}
      </div>
    </section>
  );
}

export default function PreciosPromocionesContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreciosPromocionesContentComponent />
    </Suspense>
  );
}

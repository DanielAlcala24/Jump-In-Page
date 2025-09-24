'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Calendar, Users, PartyPopper } from 'lucide-react';

const prices = [
  {
    title: 'Salto Individual (1 Hora)',
    price: '$250 MXN',
    description: 'Acceso completo a todas las áreas de trampolines. ¡Ideal para una dosis rápida de diversión!',
    image: 'https://picsum.photos/seed/price1/600/400',
    hint: 'person jumping'
  },
  {
    title: 'Pase de Día Completo',
    price: '$500 MXN',
    description: 'Salta sin límites durante todo el día. ¡La mejor opción para los verdaderos entusiastas!',
    image: 'https://picsum.photos/seed/price2/600/400',
    hint: 'group jumping'
  },
  {
    title: 'Paquete Amigos (4 Personas)',
    price: '$800 MXN / hora',
    description: 'Trae a tu squad y ahorren juntos. Más amigos, más diversión, mejor precio.',
    image: 'https://picsum.photos/seed/price3/600/400',
    hint: 'friends fun'
  },
  {
    title: 'Pase Anual VIP',
    price: '$3,500 MXN',
    description: 'Acceso ilimitado por todo un año, descuentos en alimentos y eventos especiales.',
    image: 'https://picsum.photos/seed/price4/600/400',
    hint: 'vip pass'
  },
];

const promotions = [
  {
    title: 'Martes 2x1',
    description: '¡Los martes son de amigos! Compra una hora de salto y obtén la segunda gratis para un acompañante.',
    icon: <Users className="h-10 w-10 text-pink-500" />,
    color: 'bg-pink-500/10'
  },
  {
    title: 'Jueves de Estudiantes',
    description: 'Presenta tu credencial de estudiante vigente y obtén un 20% de descuento en tu entrada.',
    icon: <Ticket className="h-10 w-10 text-green-500" />,
    color: 'bg-green-500/10'
  },
  {
    title: 'Domingo Familiar',
    description: 'Paquete familiar (2 adultos, 2 niños) por solo $750 la hora. ¡El plan perfecto para el fin de semana!',
    icon: <Calendar className="h-10 w-10 text-sky-500" />,
    color: 'bg-sky-500/10'
  },
  {
    title: 'Promo Cumpleañero',
    description: '¿Es tu mes de cumpleaños? Presenta tu INE y salta ¡GRATIS! en la compra de 3 accesos para tus amigos.',
    icon: <PartyPopper className="h-10 w-10 text-orange-500" />,
    color: 'bg-orange-500/10'
  },
];


const categories = ['Precios', 'Promociones'];

export default function PreciosPromocionesContent() {
  const [selectedCategory, setSelectedCategory] = useState('Precios');

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
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {prices.map((item, index) => (
                    <Card key={index} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <CardHeader className="p-0">
                            <Image src={item.image} alt={item.title} width={600} height={400} data-ai-hint={item.hint} className="w-full h-48 object-cover"/>
                        </CardHeader>
                        <CardContent className="p-6">
                            <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                            <p className="text-2xl font-bold text-primary my-2">{item.price}</p>
                            <CardDescription>{item.description}</CardDescription>
                        </CardContent>
                         <CardFooter>
                            <Button className="w-full bg-orange-500 hover:bg-orange-600">Comprar Ahora</Button>
                        </CardFooter>
                    </Card>
                ))}
           </div>
        )}

        {selectedCategory === 'Promociones' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {promotions.map((promo, index) => (
                    <Card key={index} className="flex flex-col text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="items-center">
                            <div className={cn("p-4 rounded-full", promo.color)}>{promo.icon}</div>
                            <CardTitle className="font-headline">{promo.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{promo.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                                Ver detalles
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
           </div>
        )}
      </div>
    </section>
  );
}

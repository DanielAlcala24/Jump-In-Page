import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Salto Básico',
    price: '$15',
    period: '/ hora',
    features: ['Acceso a todas las zonas de salto', 'Calcetines antideslizantes incluidos'],
    isFeatured: false,
  },
  {
    name: 'Pase de Día',
    price: '$40',
    period: '/ día',
    features: ['Acceso ilimitado por un día', 'Calcetines antideslizantes incluidos', '1 botella de agua gratis'],
    isFeatured: true,
  },
  {
    name: 'Membresía VIP',
    price: '$80',
    period: '/ mes',
    features: ['Acceso ilimitado mensual', 'Acceso prioritario', '10% de descuento en eventos'],
    isFeatured: false,
  },
];

export default function HazTuCompra() {
  return (
    <section id="compra" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
            Nuestros Precios
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            Elige tu Aventura de Salto
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Tenemos opciones flexibles para todos, desde una hora de diversión hasta pases de día completo y membresías.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.isFeatured ? 'border-primary ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <CardTitle className="font-headline">{tier.name}</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${!tier.isFeatured && 'bg-accent text-accent-foreground hover:bg-accent/90'}`} size="lg">
                  Comprar Ahora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import { HandHeart, Heart, Gift, Sparkles, Handshake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const causes = [
  {
    name: 'Mundo Imayina',
    description: 'Proyectos de inclusión y apoyo social.',
    icon: <HandHeart className="h-8 w-8 text-pink-500" />,
  },
  {
    name: 'FUCAM',
    description: 'Lucha contra el cáncer de mama.',
    icon: <Heart className="h-8 w-8 text-red-500" />,
  },
  {
    name: 'Juguetón',
    description: 'Alegría y juguetes para niñas y niños que más lo necesitan.',
    icon: <Gift className="h-8 w-8 text-yellow-500" />,
  },
  {
    name: 'Antes de Partir',
    description: 'Acompañamiento y esperanza para pacientes con enfermedades terminales.',
    icon: <Sparkles className="h-8 w-8 text-purple-500" />,
  },
  {
    name: 'Iluminemos',
    description: 'Concientización y apoyo a personas con autismo.',
    icon: <Handshake className="h-8 w-8 text-blue-500" />,
  },
];

export default function SocialCommitment() {
  return (
    <section id="commitment" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <Card className="shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center bg-gray-100 dark:bg-gray-800 p-8">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline mx-auto">
              Nuestra Misión
            </div>
            <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline mt-2">
              Cada Salto Transforma Vidas
            </CardTitle>
            <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-lg">
              En Jump-In creemos que cada salto puede transformar vidas. Por eso, además de ser el primer trampoline park en México, nos sumamos a causas que generan un cambio positivo en la sociedad.
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold font-headline text-center mb-6">
              Fundaciones y Causas que Apoyamos
            </h3>
            <ul className="space-y-6">
              {causes.map((cause) => (
                <li key={cause.name} className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-full bg-primary/10 p-3">
                    {cause.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg font-headline">{cause.name}</h4>
                    <p className="text-muted-foreground">{cause.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t text-center">
              <h3 className="text-xl font-bold font-headline">Tu Participación Cuenta</h3>
              <p className="mt-2 text-muted-foreground">
                Al visitarnos, te sumas a estas iniciativas y ayudas a que juntos sigamos iluminando sonrisas dentro y fuera de nuestros parques.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

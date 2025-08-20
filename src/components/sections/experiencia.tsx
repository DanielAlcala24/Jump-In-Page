import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function Experiencia() {
  return (
    <section id="experiencia" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                La Experiencia
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Más que Solo Saltar
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre un mundo de diversión con nuestras diversas zonas de salto, desde canchas de dodgeball hasta fosos de espuma y paredes de escalada. La aventura te espera en cada rincón.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg">
                Descubre las Atracciones
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <Card className="overflow-hidden rounded-xl">
            <CardContent className="p-0">
               <Image
                  alt="Atracciones de JumpZone"
                  className="aspect-video w-full object-cover"
                  height="400"
                  src="https://placehold.co/600x400.png"
                  width="600"
                  data-ai-hint="trampoline action"
                />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

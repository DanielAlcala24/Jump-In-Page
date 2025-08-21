import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

export default function Inicio() {
  return (
    <section
      id="inicio"
      className="relative flex h-screen w-full flex-col items-center justify-center text-center text-white"
    >
      <div className="relative z-10 mx-4 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold tracking-tighter text-background sm:text-7xl md:text-8xl lg:text-9xl font-headline">
          Salta a la Diversión
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-background/90 md:text-xl">
          Jump-In: El Primer Trampoline Park en México. Diversión, ejercicio y deporte para toda la familia.
        </p>
        <Link href="#compra" className="mt-8">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Reserva tu Salto
            <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

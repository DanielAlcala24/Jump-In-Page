import { Button } from '@/components/ui/button';
import { FerrisWheel, Cake, Briefcase, MapPin, Ticket, ChevronDown } from 'lucide-react';
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
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="#experiencia">
            <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-sky-500/30 hover:bg-sky-500/40">
              <FerrisWheel className="mr-2 h-5 w-5" />
              Conocer Atracciones
            </Button>
          </Link>
          <Link href="#eventos">
            <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-pink-500/30 hover:bg-pink-500/40">
              <Cake className="mr-2 h-5 w-5" />
              Fiestas de Cumpleaños
            </Button>
          </Link>
          <Link href="#eventos">
            <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-green-500/30 hover:bg-green-500/40">
              <Briefcase className="mr-2 h-5 w-5" />
              Eventos Empresariales
            </Button>
          </Link>
          <Link href="#">
            <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-purple-500/30 hover:bg-purple-500/40">
              <MapPin className="mr-2 h-5 w-5" />
              Sucursales
            </Button>
          </Link>
          <Link href="#">
            <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-orange-500/30 hover:bg-orange-500/40">
              <Ticket className="mr-2 h-5 w-5" />
              Promociones
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-10 z-10 flex flex-col items-center">
          <Link href="#experiencia" aria-label="Scroll down">
            <ChevronDown className="h-10 w-10 animate-bounce text-background/80" />
          </Link>
        </div>
    </section>
  );
}
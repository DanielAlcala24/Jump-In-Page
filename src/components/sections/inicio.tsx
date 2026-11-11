import { Button } from '@/components/ui/button';
import { FerrisWheel, Cake, Briefcase, MapPin, Ticket, ChevronDown, UserPlus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Inicio() {
  return (
    <section
      id="inicio"
      className="relative flex h-screen w-full flex-col items-center justify-center text-center text-white"
    >
      <div className="relative z-10 mx-4 flex flex-col items-center">
        <p className="mb-2 text-sm font-semibold text-white md:text-base">Descarga nuestra app</p>
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <Link
            href="https://play.google.com/store/apps/details?id=com.jumpinapp.app"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/assets/play_store.png"
              alt="Descargar en Google Play"
              width={150}
              height={50}
              className="h-10 w-auto md:h-12"
            />
          </Link>
          <Link
            href="https://apps.apple.com/mx/app/jump-in/id6745444409"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/assets/apps_store.png"
              alt="Descargar en App Store"
              width={150}
              height={50}
              className="h-10 w-auto md:h-12"
            />
          </Link>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl font-headline">
          ¡Salta a la Diversión!
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white md:text-xl">
          Jump-In: El mejor <strong>parque de trampolines</strong> y <strong>trampoline park</strong> en México. Diversión, entretenimiento y deporte para toda la familia.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/fiestas-y-eventos/fiestas-cumpleanos">
            <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-pink-500/30 hover:bg-pink-500/40">
              <Cake className="mr-2 h-5 w-5" />
              Fiestas de Cumpleaños
            </Button>
          </Link>
          <Link href="/fiestas-y-eventos/eventos-empresariales">
            <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-green-500/30 hover:bg-green-500/40">
              <Briefcase className="mr-2 h-5 w-5" />
              Eventos Empresariales
            </Button>
          </Link>
          <Link href="/precios-y-promociones?tab=Promociones">
            <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-orange-500/30 hover:bg-orange-500/40">
              <Ticket className="mr-2 h-5 w-5" />
              Promociones
            </Button>
          </Link>
          <Link href="https://databiz.mx:300/Jump-in_Waiver/registroResponsable.aspx" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-blue-500/30 hover:bg-blue-500/40">
              <UserPlus className="mr-2 h-5 w-5" />
              Registro digital
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-5 z-10 flex flex-col items-center">
        <Link href="#introduccion" aria-label="Scroll down">
          <ChevronDown className="h-10 w-10 animate-bounce text-background/80" />
        </Link>
      </div>
    </section>
  );
}

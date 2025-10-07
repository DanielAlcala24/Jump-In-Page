
import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import Footer from '@/components/footer';
import { ChevronDown, Cake, Briefcase } from 'lucide-react';
import Link from 'next/link';
import FiestasEventosIntro from '@/components/sections/fiestas-eventos-intro';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function FiestasYEventosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <section className="relative flex h-[50vh] w-full flex-col items-center justify-center text-center text-white">
          <div className="relative z-10 mx-4 flex flex-col items-center">
            <div className="flex justify-center items-center gap-1 mb-2">
              <Image 
                src="/assets/bongo.png" 
                alt="Mascota Bongo" 
                width={50} 
                height={50}
                className="h-auto w-10 md:w-20"
              />
               <Image 
                src="/assets/maya.png" 
                alt="Mascota Maya" 
                width={50} 
                height={50}
                className="h-auto w-10 md:w-20"
              />
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl font-headline">
              Fiestas y Eventos
            </h1>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/fiestas-y-eventos/fiestas-cumpleanos">
                <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-pink-500/30 hover:bg-pink-500/40">
                  <Cake className="mr-2 h-5 w-5" />
                  Cotiza tu Cumpleaños
                </Button>
              </Link>
              <Link href="/fiestas-y-eventos/eventos-empresariales">
                <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-green-500/30 hover:bg-green-500/40">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Cotiza tu Evento
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 z-10 flex flex-col items-center">
            <Link href="#events-intro" aria-label="Scroll down">
              <ChevronDown className="h-10 w-10 animate-bounce text-background/80" />
            </Link>
          </div>
        </section>
        <FiestasEventosIntro />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

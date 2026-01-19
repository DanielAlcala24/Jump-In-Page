
import AboutUs from '@/components/sections/about-us';
import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import Footer from '@/components/footer';
import { ChevronDown, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiénes Somos | Jump-In',
  description: 'Conoce más sobre Jump-In, el primer Trampoline Park en México. Diversión, deporte y entretenimiento seguro para todas las edades.',
  keywords: 'nosotros, historia, Jump-In, misión, visión, trampoline park México',
};

export default function NosotrosPage() {
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
                className="h-auto w-10 md:w-10"
              />
              <Image
                src="/assets/maya.png"
                alt="Mascota Maya"
                width={50}
                height={50}
                className="h-auto w-10 md:w-10"
              />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Nosotros
            </h1>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/compromiso-social">
                <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-orange-500/30 hover:bg-orange-500/40">
                  <Heart className="mr-2 h-5 w-5" />
                  Compromiso Social
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 z-10 flex flex-col items-center">
            <Link href="#about" aria-label="Scroll down">
              <ChevronDown className="h-10 w-10 animate-bounce text-background/80" />
            </Link>
          </div>
        </section>
        <AboutUs />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

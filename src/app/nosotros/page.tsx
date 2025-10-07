
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

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <section className="relative flex h-[50vh] w-full flex-col items-center justify-center text-center text-white">
          <div className="relative z-10 mx-4 flex flex-col items-center">
             <div className="flex justify-center items-end gap-4 mb-4">
              <Image 
                src="/assets/bongo.png" 
                alt="Mascota Bongo" 
                width={120} 
                height={120}
                className="h-auto w-24 md:w-32"
              />
              <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl font-headline">
                Nosotros
              </h1>
               <Image 
                src="/assets/maya.png" 
                alt="Mascota Maya" 
                width={120} 
                height={120}
                className="h-auto w-24 md:w-32"
              />
            </div>
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

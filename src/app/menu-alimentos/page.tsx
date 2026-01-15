
import MenuPosts from '@/components/sections/menu-posts';
import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import Footer from '@/components/footer';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MenuAlimentosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <section className="relative flex h-[80vh] w-full flex-col items-center justify-center text-center text-white">
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
              Nuestro Menú
            </h1>
          </div>
          <div className="absolute bottom-0 z-10 flex flex-col items-center">
            <Link href="#menu" aria-label="Scroll down">
              <ChevronDown className="h-10 w-10 animate-bounce text-background/80" />
            </Link>
          </div>
        </section>
        <MenuPosts />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

import { Metadata } from 'next';
import FiestasCumpleanosContent from '@/components/sections/fiestas-cumpleanos-content';
import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import Footer from '@/components/footer';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Fiestas de Cumpleaños en Jump-In | Cotizar y Celebrar en Grande',
  description: 'Celebra el mejor cumpleaños en Jump-In. Cotiza tu fiesta con nosotros y disfruta de trampolines, juegos y diversión extrema. ¡La mejor opción para celebrar en familia!',
  keywords: ['cumpleaños jumpin', 'cotizar en jumpin', 'fiesta en jumpin', 'celebrar en jumpin', 'fiestas infantiles', 'trampoline park mexico'],
  openGraph: {
    title: 'Fiestas de Cumpleaños en Jump-In | Diversión Extrema',
    description: '¿Buscas dónde celebrar tu fiesta? Cotiza en Jump-In y vive una experiencia inolvidable con trampolines y mucha adrenalina.',
    images: [{ url: '/assets/logo_jumpin_red.png' }],
  },
};

export default function FiestasCumpleanosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Fiestas de Cumpleaños en Jump-In",
    "description": "Servicio de organización de fiestas de cumpleaños en Jump-In Trampoline Park. Incluye acceso a atracciones, área de comida y diversión garantizada.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Jump-In",
      "image": "/assets/logo_jumpin_red.png"
    },
    "areaServed": "Mexico",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Paquetes de Fiesta",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Fiesta Cumpleaños Jump-In"
          }
        }
      ]
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoBackground videoSrc="/assets/Cumple.mp4" />
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
                priority
                className="h-auto w-10 md:w-10"
              />
              <Image
                src="/assets/maya.png"
                alt="Mascota Maya"
                width={50}
                height={50}
                priority
                className="h-auto w-10 md:w-10"
              />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Fiestas de Cumpleaños
            </h1>
          </div>
          <div className="absolute bottom-0 z-10 flex flex-col items-center">
            <Link href="#birthday-content" aria-label="Scroll down">
              <ChevronDown className="h-10 w-10 animate-bounce text-background/80" />
            </Link>
          </div>
        </section>
        <FiestasCumpleanosContent />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

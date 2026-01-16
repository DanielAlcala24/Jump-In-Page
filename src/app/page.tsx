import Footer from '@/components/footer';
import Header from '@/components/header';
import FaqServer from '@/components/sections/faq-server';
import Eventos from '@/components/sections/eventos';
import Galeria from '@/components/sections/galeria';
import Inicio from '@/components/sections/inicio';
import Introduccion from '@/components/sections/introduccion';
import Testimonios from '@/components/sections/testimonios';
import PromocionesCarousel from '@/components/sections/promociones-carousel';
import SocialIcons from '@/components/social-icons';
import VideoBackground from '@/components/video-background';
import WhatsappButton from '@/components/whatsapp-button';
import WavyDivider from '@/components/wavy-divider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jump-In | El Primer Trampoline Park en México',
  description: 'Jump-In: El Primer Trampoline Park en México. Diversión, entretenimiento y deporte para toda la familia. Ven a saltar, reír y pasarla increíble.',
  keywords: 'trampoline park, parque de trampolines, diversión familiar, entretenimiento, deporte, México, Ciudad de México, Jump-In, sucursales, quiénes somos',
  openGraph: {
    title: 'Jump-In | El Primer Trampoline Park en México',
    description: 'Diversión, entretenimiento y deporte para toda la familia',
    type: 'website',
    url: 'https://jump-in.com.mx',
    images: [
      {
        url: '/assets/g5.jpeg',
        width: 1200,
        height: 630,
        alt: 'Jump-In Trampoline Park',
      },
    ],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Quiénes Somos",
        "url": "https://jump-in.com.mx/nosotros"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Sucursales",
        "url": "https://jump-in.com.mx/sucursales"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Atracciones",
        "url": "https://jump-in.com.mx/atracciones"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Precios y Promociones",
        "url": "https://jump-in.com.mx/precios-y-promociones"
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <Inicio />
        <PromocionesCarousel />
        <WavyDivider fromColor="bg-white" />
        <Introduccion />
        <WavyDivider fromColor="bg-gray-50" />
        <Eventos />
        <Galeria />
        <WavyDivider fromColor="bg-gray-50" />
        <Testimonios />
        <FaqServer />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

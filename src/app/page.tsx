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
import PromocionesForm from '@/components/sections/promociones-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jump-In | Parque de Trampolines y Trampoline Park en México',
  description: 'Jump-In es el parque de trampolines y trampoline park líder en México. Ofrecemos diversión familiar, fiestas de cumpleaños inolvidables y las mejores atracciones de salto.',
  keywords: 'parque de trampolines, trampoline park, Jump-In, diversión familia México, fiestas de cumpleaños, saltar, entrenamiento cdmx, parque de diversiones, trampolines méxico',
  openGraph: {
    title: 'Jump-In | El Mejor Parque de Trampolines en México',
    description: 'La mejor experiencia de salto en México para toda la familia.',
    type: 'website',
    url: 'https://jumpin.com.mx',
    images: [
      {
        url: '/assets/logojumpin.png',
        width: 1200,
        height: 630,
        alt: 'Jump-In Parque de Trampolines',
      },
    ],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AmusementPark",
    "name": "Jump-In",
    "description": "El mejor parque de trampolines en México con múltiples sucursales, atracciones y paquetes para fiestas.",
    "url": "https://jumpin.com.mx",
    "logo": "https://jumpin.com.mx/assets/logojumpin.png",
    "sameAs": [
      "https://www.facebook.com/JumpInMexico",
      "https://www.instagram.com/jumpinmexico"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MX"
    }
  };

  const navJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Quiénes Somos",
        "url": "https://jumpin.com.mx/nosotros"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Sucursales",
        "url": "https://jumpin.com.mx/sucursales"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Atracciones",
        "url": "https://jumpin.com.mx/atracciones"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Precios y Promociones",
        "url": "https://jumpin.com.mx/precios-y-promociones"
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navJsonLd) }}
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
        <div className="content-visibility-auto">
          <Galeria />
        </div>
        <WavyDivider fromColor="bg-gray-50" />
        <div className="content-visibility-auto">
          <Testimonios />
        </div>
        <div className="content-visibility-auto">
          <FaqServer />
        </div>
        <WavyDivider fromColor="bg-gray-50" />
        <PromocionesForm />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

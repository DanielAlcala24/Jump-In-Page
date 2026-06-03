import { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WhatsappButton from '@/components/whatsapp-button';
import SocialIcons from '@/components/social-icons';
import CasaFutbolHero from '@/components/sections/casafutbol-hero';
import CasaFutbolTeaser from '@/components/sections/casafutbol-teaser';
import CasaFutbolAtracciones from '@/components/sections/casafutbol-atracciones';

export const metadata: Metadata = {
  title: 'Jump-In × Casa Fútbol | Una Colaboración Exclusiva',
  description:
    'Dos mundos se unen. Una colaboración exclusiva de Jump-In y Casa Fútbol. La gravedad del trampoline park combinada con la pasión de la cancha. Próximamente en nuestras sucursales.',
  openGraph: {
    title: 'Jump-In × Casa Fútbol | El Juego Está Por Cambiar',
    description:
      'Una colaboración exclusiva diseñada para romper la rutina. Algo totalmente nuevo está llegando a nuestras sucursales.',
    type: 'website',
    url: 'https://jumpin.com.mx/casafutbol',
    images: [
      {
        url: '/assets/logojumpin.png',
        width: 1200,
        height: 630,
        alt: 'Jump-In × Casa Fútbol',
      },
    ],
  },
};

export default function CasaFutbolPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <CasaFutbolHero />
        <CasaFutbolTeaser />
        <CasaFutbolAtracciones />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

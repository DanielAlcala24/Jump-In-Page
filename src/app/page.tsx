import Footer from '@/components/footer';
import Header from '@/components/header';
import FaqServer from '@/components/sections/faq-server';
import Eventos from '@/components/sections/eventos';
import Galeria from '@/components/sections/galeria';
import Inicio from '@/components/sections/inicio';
import Introduccion from '@/components/sections/introduccion';
import Testimonios from '@/components/sections/testimonios';
import SocialIcons from '@/components/social-icons';
import VideoBackground from '@/components/video-background';
import WhatsappButton from '@/components/whatsapp-button';
import WavyDivider from '@/components/wavy-divider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jump-In | El Primer Trampoline Park en México',
  description: 'Jump-In: El Primer Trampoline Park en México. Diversión, entretenimiento y deporte para toda la familia. Ven a saltar, reír y pasarla increíble.',
  keywords: 'trampoline park, parque de trampolines, diversión familiar, entretenimiento, deporte, México, Ciudad de México, Jump-In',
  openGraph: {
    title: 'Jump-In | El Primer Trampoline Park en México',
    description: 'Diversión, entretenimiento y deporte para toda la familia',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <Inicio />
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

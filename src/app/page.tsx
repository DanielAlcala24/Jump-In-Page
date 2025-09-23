import Footer from '@/components/footer';
import Header from '@/components/header';
import Faq from '@/components/sections/faq';
import Eventos from '@/components/sections/eventos';
import Galeria from '@/components/sections/galeria';
import Inicio from '@/components/sections/inicio';
import Introduccion from '@/components/sections/introduccion';
import Testimonios from '@/components/sections/testimonios';
import SocialIcons from '@/components/social-icons';
import VideoBackground from '@/components/video-background';
import WhatsappButton from '@/components/whatsapp-button';
import WavyDivider from '@/components/wavy-divider';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <Inicio />
        <Introduccion />
        <WavyDivider fromColor="bg-gray-50" toColor="text-gray-100" />
        <Eventos />
        <Galeria />
        <WavyDivider fromColor="bg-gray-50" toColor="text-gray-100" />
        <Testimonios />
        <Faq />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

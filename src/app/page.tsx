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

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <Inicio />
        <Introduccion />
        <Eventos />
        <Galeria />
        <Testimonios />
        <Faq />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}
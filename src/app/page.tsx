import Footer from '@/components/footer';
import Header from '@/components/header';
import Eventos from '@/components/sections/eventos';
import Faq from '@/components/sections/faq';
import Inicio from '@/components/sections/inicio';
import Introduccion from '@/components/sections/introduccion';
import Testimonios from '@/components/sections/testimonios';
import SocialIcons from '@/components/social-icons';
import VideoBackground from '@/components/video-background';
import WhatsappButton from '@/components/whatsapp-button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <Inicio />
        <Introduccion />
        <Testimonios />
        <Faq />
        <Eventos />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

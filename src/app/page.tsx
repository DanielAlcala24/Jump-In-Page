import Footer from '@/components/footer';
import Header from '@/components/header';
import Eventos from '@/components/sections/eventos';
import Experiencia from '@/components/sections/experiencia';
import Inicio from '@/components/sections/inicio';
import SocialIcons from '@/components/social-icons';
import SocialIconsMobile from '@/components/social-icons-mobile';
import VideoBackground from '@/components/video-background';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <SocialIconsMobile />
      <main className="flex-1">
        <Inicio />
        <Experiencia />
        <Eventos />
      </main>
      <Footer />
    </div>
  );
}

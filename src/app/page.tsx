import Header from '@/components/header';
import Eventos from '@/components/sections/eventos';
import Experiencia from '@/components/sections/experiencia';
import HazTuCompra from '@/components/sections/haz-tu-compra';
import Inicio from '@/components/sections/inicio';
import SocialIcons from '@/components/social-icons';
import VideoBackground from '@/components/video-background';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <Inicio />
        <HazTuCompra />
        <Experiencia />
        <Eventos />
      </main>
    </div>
  );
}

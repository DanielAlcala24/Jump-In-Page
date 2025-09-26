
import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import Footer from '@/components/footer';
import { ChevronDown, FileText } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AvisoDePrivacidadPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <section className="relative flex h-[50vh] w-full flex-col items-center justify-center text-center text-white">
          <div className="relative z-10 mx-4 flex flex-col items-center">
            <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl font-headline">
              Aviso de Privacidad
            </h1>
          </div>
          <div className="absolute bottom-0 z-10 flex flex-col items-center">
            <Link href="#privacy-content" aria-label="Scroll down">
              <ChevronDown className="h-10 w-10 animate-bounce text-background/80" />
            </Link>
          </div>
        </section>
        <section id="privacy-content" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-4xl px-4 md:px-6">
                <Card className="shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <FileText className="w-8 h-8 text-primary" />
                            <CardTitle className="text-2xl font-bold font-headline">Aviso de Privacidad</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-6 md:text-lg/relaxed">
                       <p>JUMP WORLD, S.A. de C.V., (en adelante JUMP–IN), con domicilio en Circuito Empresarial número 13, locales 10 y 11, Colonia Villa De Las Palmas, Código Postal 52787, Municipio de Huixquilucan, Estado de México, es responsable del uso y protección de sus datos personales.</p>
                       
                       <div>
                         <h3 className="font-bold text-foreground mb-2">Los datos personales son recabados para los siguientes fines:</h3>
                         <p className="font-bold text-foreground mb-2">GENÉRICOS:</p>
                         <p>Económicos, personales, laborales, educativos, bancarios, recreativos, publicitarios y de prestación de servicios.</p>
                       </div>

                       <div>
                         <p className="font-bold text-foreground mb-2">ESPECÍFICOS:</p>
                         <p>Integrar la base de datos de clientes, proveedores y trabajadores, registro de entrada y uso de nuestras instalaciones y servicios, pagos, organización de actividades en general, prestación de servicios de entretenimiento, videojuegos, salas de juegos, fiestas, eventos infantiles, actividades deportivas y equipamiento de áreas para entretenimiento en general, y reproducción con fines publicitarios y promocionales, ya sea físicos como en redes sociales.</p>
                       </div>

                       <div>
                         <p className="font-bold text-foreground mb-2">ADICIONALES:</p>
                         <p>Conocer sus necesidades de servicios y ofrecerle los que más se adecuen a sus requerimientos y preferencias; integrar el expediente de identificación de clientes y proveedores, dar avisos de actividades vulnerables en términos de la ley aplicable, comunicarle informes, actualizaciones y publicidad en general, convocarlo a eventos de acuerdo a su perfil, atender quejas y aclaraciones, solventar sus necesidades y requerimientos vinculados a nuestros servicios, contactarlo vía telefónica, telegráfica o por correo postal o electrónico, pago de nómina y emisión de cartas de recomendación, publicitar y anunciar nuestros juegos y eventos, así como material promocional.</p>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </section>
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

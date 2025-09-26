
import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import Footer from '@/components/footer';
import { ChevronDown, FileText } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TerminosCondicionesPage() {
  const terms = [
    "Válida en todas las sucursales de Jump-In.",
    "EL uso de calceta antiderrapante para nuestras instalaciones y atracciones es de carácter obligatorio.",
    "Sujeto a disponibilidad, aforo y horario de la sucursal.",
    "Los horarios están sujetos a cambios sin previo aviso.",
    "Para el ingreso a nuestras instalaciones es necesario portar cubrebocas de manera correcta y cumplir con las medidas sanitarias establecidas.",
    "La promoción es valida por persona, no es intercambiable o transferible.",
    "Solo se podrá aplicar una promoción al día por persona.",
    "El uso de las instalaciones de Jump-In este sujeto a los reglamentos internos de la compañía.",
    "Promoción no aplica con otra promoción.",
    "En temporada vacacional y días festivos las promociones entre semana no aplican."
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <section className="relative flex h-[50vh] w-full flex-col items-center justify-center text-center text-white">
          <div className="relative z-10 mx-4 flex flex-col items-center">
            <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl font-headline">
              Términos y Condiciones
            </h1>
          </div>
          <div className="absolute bottom-0 z-10 flex flex-col items-center">
            <Link href="#terms-content" aria-label="Scroll down">
              <ChevronDown className="h-10 w-10 animate-bounce text-background/80" />
            </Link>
          </div>
        </section>
        <section id="terms-content" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-4xl px-4 md:px-6">
                <Card className="shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <FileText className="w-8 h-8 text-primary" />
                            <CardTitle className="text-2xl font-bold font-headline">Términos y condiciones de promociones</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-4 md:text-lg/relaxed">
                       <ul className="list-disc list-inside space-y-2">
                            {terms.map((term, index) => (
                                <li key={index}>{term}</li>
                            ))}
                       </ul>
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

import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import Footer from '@/components/footer';
import { ChevronDown, Users, Building2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FacturacionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <section className="relative flex h-[50vh] w-full flex-col items-center justify-center text-center text-white">
          <div className="relative z-10 mx-4 flex flex-col items-center">
            <div className="flex justify-center items-center gap-1 mb-2">
              <Image 
                src="/assets/bongo.png" 
                alt="Mascota Bongo" 
                width={50} 
                height={50}
                className="h-auto w-10 md:w-20"
              />
               <Image 
                src="/assets/maya.png" 
                alt="Mascota Maya" 
                width={50} 
                height={50}
                className="h-auto w-10 md:w-20"
              />
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl font-headline">
              Facturación
            </h1>
          </div>
          <div className="absolute bottom-0 z-10 flex flex-col items-center">
            <Link href="#facturacion-content" aria-label="Scroll down">
              <ChevronDown className="h-10 w-10 animate-bounce text-background/80" />
            </Link>
          </div>
        </section>

        <section id="facturacion-content" className="w-full py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tarjeta de Clientes */}
              <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group">
                <CardHeader className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8">
                  <div className="flex items-center justify-center mb-4">
                    <Users className="h-16 w-16" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-center font-headline">
                    Clientes
                  </CardTitle>
                  <CardDescription className="text-center text-orange-50 mt-2">
                    Emisión y recuperación de facturas para clientes
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <Alert className="mb-6 border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-sm text-orange-800">
                      <strong>Importante:</strong> Tu factura debe realizarse en el mes en el que se realizó la compra.
                    </AlertDescription>
                  </Alert>
                  <div className="flex-grow flex items-end">
                    <Link 
                      href="https://www.decmanager.com/DM_Kiosko_AF_PV_V2/Home.aspx?TOKEN=7C92E526-33DC-4372-AEF0-26E3F592CB53"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" size="lg">
                        Acceder al Portal de Clientes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Tarjeta de Proveedores */}
              <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group">
                <CardHeader className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8">
                  <div className="flex items-center justify-center mb-4">
                    <Building2 className="h-16 w-16" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-center font-headline">
                    Proveedores
                  </CardTitle>
                  <CardDescription className="text-center text-blue-50 mt-2">
                    Portal de acceso para proveedores
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex-grow flex items-end">
                  <Link 
                    href="https://decmanager.com/DM_proveedores/Anonima.aspx?TOKEN=7C92E526-33DC-4372-AEF0-26E3F592CB53"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" size="lg">
                      Acceder al Portal de Proveedores
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Si tienes alguna duda o necesitas asistencia con el proceso de facturación, 
                no dudes en contactarnos a través de nuestros canales de atención.
              </p>
            </div>
          </div>
        </section>
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}



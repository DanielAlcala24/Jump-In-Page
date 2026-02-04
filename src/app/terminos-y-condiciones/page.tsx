
import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import Footer from '@/components/footer';
import { ChevronDown, FileText } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function TerminosCondicionesPage() {
  const terms = [
    "Válida en todas las sucursales de Jump-In.",
    "El uso de calceta antiderrapante para nuestras instalaciones y atracciones es de carácter obligatorio.",
    "Sujeto a disponibilidad, aforo y horario de la sucursal.",
    "Los horarios están sujetos a cambios sin previo aviso.",
    "Para el ingreso a nuestras instalaciones es necesario portar cubrebocas de manera correcta y cumplir con las medidas sanitarias establecidas.",
    "La promoción es valida por persona, no es intercambiable o transferible.",
    "Solo se podrá aplicar una promoción al día por persona.",
    "El uso de las instalaciones de Jump-In este sujeto a los reglamentos internos de la compañía.",
    "Promoción no aplica con otra promoción.",
    "En temporada vacacional y días festivos las promociones entre semana no aplican.",
    "Estas restricciones serán actualizadas de así requerirse.",
    "Es responsabilidad del cliente la consulta de estas restricciones para la correcta utilización de estas.",
    "El acceso es personal e intransferible.",
    "ACCESSO ILIMITADO (Se refiere a acceso ilimitado a todas las atracciones durante el día de la compra siempre y cuando no se abandonen las instalaciones de Jump-In Trampoline Park).",
    "Acceso 2 hrs (se refiere a la compra de una entrada por persona en su modalidad de tiempo limitado a 2 hrs, válido solo el día de su visita).",
    "Las promociones no son acumulables, válido 1 promoción por ticket.",
    "Las promociones son vigentes en el año en curso, y hasta que la publicación se retire de ser publicada en la página de internet, solo aplican el día de la visita.",
    "Ninguna de nuestras promociones incluye el uso de calcetines antiderrapantes.",
    "El uso de calcetas antiderrapantes es obligatorio.",
    "Todo menor de edad deberá entrar acompañado de un adulto que acredite la mayoría de edad con identificación oficial vigente, y que firme la carta liberación de responsabilidad (WAIVER).",
    "Promoción válida sólo en accesos, no aplica cafetería.",
    "Aplica en todas las sucursales, salvo que la promoción sea exclusiva de región o en específico de sucursal.",
    "El llenado y firmado de la carta liberación de responsabilidad (WAIVER) es obligatorio, y en cada visita que se realice.",
    "Queda prohibida la venta de estas promociones, así como el mal uso de ellas",
    "Prohibida la reventa de promociones y/o accesos, hacerlo es un delito y en caso de detectarse Jump-In puede invalidar la promoción y/o acceso.",
    "No aplican en días festivos.",
    "Los usuarios de estas promociones se obligan a cumplir con las reglas del establecimiento, las cuales se pueden consultar en www.jumpin.com.mx.",
    "El consumo de cerveza está limitado a 4 cervezas por cliente, y siempre con consumo de alimento.",
    "Queda prohibido introducir alimentos y/o bebidas ajenas al establecimiento.",
    "El uso de calcetas antiderrapantes es obligatorio.",
    "Por seguridad las promociones están limitadas al aforo de la sucursal.",
    "En caso de que la sucursal no abra por evento privado, no aplica ninguna promoción.",
    "El cierre de sucursal, por evento privado, mantenimiento o por causa de fuerza mayor, exime por completo a Jump-In Trampoline Park del cumplimiento de todas las promociones.",
  ];

  const descuentoCumple = [
    "Sólo aplica en paquete de personas que pasan a saltar.",
    "El descuento sólo aplica en el paquete cotizado, los extras cotizados a manera posterior se cobran a precio de lista.",
    "El descuento sólo se aplica si se reserva con un 50% del monto total cotizado.",
    "Una vez realizada la reservación, no hay devoluciones.",
  ];

  const cupones = [
    "Su uso es personal.",
    "No aplica en grupos mayores a 6 personas.",
    "La vigencia no es negociable.",
    "No son canjeables por dinero en efectivo.",
    "Cupón o Diplomas estudiantiles (CD 10, SNTE y otros). Es indispensalle que esté sellado por la onstutución que emite, sólo aplican en grados menores a bachillerato, no aplica en grupos mayores a 6 personas. Es necesario presentar credencial de estudiante.",
  ];


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
                className="h-auto w-10 md:w-10"
              />
              <Image
                src="/assets/maya.png"
                alt="Mascota Maya"
                width={50}
                height={50}
                className="h-auto w-10 md:w-10"
              />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
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
            <Card className="shadow-lg rounded-2xl overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-primary" />
                  <CardTitle className="text-2xl font-bold font-headline">Descuento en cumpleaños</CardTitle>
                </div>

              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 md:text-lg/relaxed">
                <ul className="list-disc list-inside space-y-2">
                  {descuentoCumple.map((descuentoCumple, index) => (
                    <li key={index}>{descuentoCumple}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-lg rounded-2xl overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-primary" />
                  <CardTitle className="text-2xl font-bold font-headline">Cupones</CardTitle>
                </div>

              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 md:text-lg/relaxed">
                <ul className="list-disc list-inside space-y-2">
                  {cupones.map((cupones, index) => (
                    <li key={index}>{cupones}</li>
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

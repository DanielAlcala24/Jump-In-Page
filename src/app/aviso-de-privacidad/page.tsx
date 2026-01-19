
import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import Footer from '@/components/footer';
import { ChevronDown, FileText } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function AvisoDePrivacidadPage() {
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
                <div>
                  <h3 className="font-bold text-foreground mb-2">JUMP–IN recaba los siguientes datos personales:</h3>
                  <p>Nombre, domicilio, RFC, CURP, número de seguridad social, correo electrónico, estado civil, edad, nacionalidad, fecha y lugar de nacimiento, teléfono, fijo y móvil, datos de documentos de identificación, nombre del cónyuge, nombre de los hijos, educación, información comercial, corporativa, financiera y contable.</p>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Datos sensibles recabados:</h3>
                  <p>JUMP–IN recaba los siguientes datos considerados como sensibles, de acuerdo a la ley de la materia: estado de salud presente o futuro, información genética (tipo de sangre) y afiliación sindical.</p>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Formas de recabar datos personales:</h3>
                  <p>Para las finalidades señaladas en el presente aviso de privacidad, JUMP–IN recaba sus datos personales de distintas formas: cuando Usted los proporciona directamente; cuando visita nuestro sitio de Internet o utiliza nuestros servicios en línea; y cuando obtenemos información a través de otras fuentes permitidas por la ley, tales como alianzas, directorios telefónicos o laborales, entre otras, así como por conducto de nuestra pagina electrónica, mediante web – beacons, (Google analyties), únicamente para monitoreo de la misma.</p>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Transferencia de datos:</h3>
                  <p>Los Datos pueden ser transferidos a terceros o proveedores de JUMP–IN o autoridades gubernamentales, tanto dentro de territorio nacional, como en el extranjero, para los mismos fines, con el objeto de cumplir con disposiciones legales aplicables o coadyuvar en la prestación de nuestros servicios, de acuerdo a los fines previstos en este aviso de privacidad.</p>
                  <p className="mt-4">Si Usted no manifiesta su oposición para que sus datos personales sean transferidos, se entenderá que otorga su consentimiento para ello.</p>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Tratamiento y protección de datos:</h3>
                  <p>Los Datos serán tratados de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, su Reglamento y Lineamientos adicionales.</p>
                  <p className="mt-4">La confidencialidad de los Datos está garantizada y los mismos están protegidos por medidas de seguridad administrativas, técnicas y físicas, para evitar su daño, pérdida, alteración, destrucción, uso, acceso o divulgación indebida.</p>
                </div>
                <div>
                  <p>Únicamente las personas autorizadas tendrán acceso a sus Datos.</p>
                </div>
                <div>
                  <p>En caso de existir alguna modificación al presente Aviso de Privacidad se hará de su conocimiento en nuestro sitio de Internet: https://www.jumpin.com.mx/avisodeprivacidad</p>
                </div>
                <div>
                  <p>Para el ejercicio de sus derechos ARCO (acceso, rectificación, cancelación u oposición) al tratamiento de sus Datos Personales, así como para revocar el consentimiento que nos ha otorgado, deberá presentar su solicitud a través del correo electrónico: privacidadjump-in@gmail.com, proporcionando al efecto los siguientes datos personales de identificación: nombre, domicilio o medio de contacto, dirección de correo electrónico, documento que acredite su personalidad, descripción clara y precisa de los datos personales motivo de dicha petición y número de membresía o adscripción a JUMP-IN, cuando así proceda.</p>
                </div>
                <div>
                  <p>JUMP-IN emitirá la respuesta correspondiente en un plazo máximo de 20 días hábiles, prorrogable, en caso necesario en otros 20 días hábiles adicionales.</p>
                </div>
                <div>
                  <p>JUMP-IN se reserva como periodo de bloqueo para la cancelación de los datos personales, el término de seis meses posteriores al agotamiento o extinción de los efectos de la relación jurídica vinculante con el titular de los mismos.</p>
                </div>
                <div>
                  <p className="mt-4 font-bold text-foreground">Fecha de Actualización: 14 de Diciembre de 2017</p>
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

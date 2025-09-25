import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Target, Eye, ShieldCheck, Heart } from 'lucide-react';
import Image from 'next/image';

const values = [
  { name: 'Diversión', color: 'text-pink-500' },
  { name: 'Seguridad', color: 'text-green-500' },
  { name: 'Calidad', color: 'text-sky-500' },
  { name: 'Familia', color: 'text-purple-500' },
  { name: 'Innovación', color: 'text-orange-500' },
];

export default function AboutUs() {
  return (
    <section id="about" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 md:px-6 space-y-12">
        <Card className="shadow-lg rounded-2xl overflow-hidden">
          <Image
            src="/assets/g7.jpeg"
            alt="Nosotros"
            width={1200}
            height={400}
            data-ai-hint="team fun"
            className="w-full h-auto object-cover"
          />
          <CardHeader>
            <div className="flex items-center gap-4">
              <Building className="w-10 h-10 text-primary" />
              <CardTitle className="text-3xl font-bold font-headline">¿Quiénes Somos?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground md:text-lg/relaxed">
            <p>
              Jump-In es el primer trampoline park en México, un centro de entretenimiento innovador que combina diversión, actividad física y deporte para todas las edades. En más de 1,000 m² de trampolines, cuerdas, muros y otras actividades, ofrecemos una experiencia única. La seguridad es nuestro factor primordial, respaldada por rigurosos procesos, instalaciones de primera y personal altamente capacitado.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader className="flex flex-col items-center gap-4">
                <Target className="w-10 h-10 text-primary" />
                <CardTitle className="text-2xl font-bold font-headline">Misión</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-center">
              <p>"Crear momentos inolvidables de felicidad a través de una experiencia de entretenimiento única e innovadora generada por nuestro equipo para todas las familias que nos visitan".</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-2xl">
            <CardHeader className="flex flex-col items-center gap-4">
                <Eye className="w-10 h-10 text-primary" />
                <CardTitle className="text-2xl font-bold font-headline">Visión</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-center">
              <p>"Seguir siendo el 1er Trampoline Park de México, con un crecimiento sustentable con la mayor cantidad de sonrisas generadas".</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg rounded-2xl overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-10 h-10 text-primary" />
              <CardTitle className="text-3xl font-bold font-headline">Compromiso con la Seguridad</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground md:text-lg/relaxed">
            <p>
              La diversión siempre va de la mano de la seguridad. Cada visita está acompañada por nuestro equipo de staff capacitado, quienes no solo animan y guían la experiencia, sino que también vigilan cada área para asegurar que todos disfruten sin riesgos. Además, contamos con protocolos de seguridad especiales en todas nuestras sucursales, diseñados para proteger a los más pequeños: ningún menor puede salir del parque si no está acompañado por el adulto con el que ingresó.
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg rounded-2xl overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Heart className="w-10 h-10 text-primary" />
              <CardTitle className="text-3xl font-bold font-headline">Nuestros Valores</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {values.map((value) => (
                <div key={value.name} className="flex flex-col items-center space-y-2">
                  <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 ${value.color}`}>
                    <span className="text-2xl font-bold">{value.name.charAt(0)}</span>
                  </div>
                  <span className={`font-semibold ${value.color}`}>{value.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

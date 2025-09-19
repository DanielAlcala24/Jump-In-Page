import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Cake, Briefcase } from "lucide-react";

const images = [
  { src: 'https://picsum.photos/600/800?random=31', alt: 'Fiesta de cumpleaños en Jump-In', hint: 'birthday party' },
  { src: 'https://picsum.photos/600/800?random=32', alt: 'Evento empresarial en Jump-In', hint: 'corporate event' },
  { src: 'https://picsum.photos/600/800?random=33', alt: 'Amigos divirtiéndose en trampolines', hint: 'friends jumping' },
  { src: 'https://picsum.photos/600/800?random=34', alt: 'Niños celebrando', hint: 'kids celebrating' },
];

export default function FiestasEventosIntro() {
  return (
    <section id="events-intro" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <Card className="shadow-2xl rounded-2xl overflow-hidden bg-white">
          <CardHeader className="text-center p-8">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline mx-auto">
              Momentos Inolvidables
            </div>
            <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline mt-2">
              Celebra a lo Grande, Salta con Energía
            </CardTitle>
            <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-lg">
              En Jump-In creemos que cada momento especial merece vivirse a lo grande y con mucha energía. Nuestras sucursales no solo son un lugar para saltar, también son el escenario perfecto para crear recuerdos inolvidables con tus amigos, tu familia o tu equipo de trabajo.
            </p>
             <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-lg">
              Imagina un espacio donde la diversión y la adrenalina se mezclan con la emoción de estar rodeado de quienes más quieres. Aquí, tanto los cumpleaños como los eventos empresariales se transforman en experiencias únicas: con áreas de juego seguras, trampolines interminables, retos dinámicos y un ambiente vibrante que hace que todos participen y disfruten.
            </p>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mt-8 mb-12">
              {images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg group shadow-lg transition-all hover:shadow-2xl">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={800}
                    data-ai-hint={image.hint}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-center">
              <Link href="/fiestas-cumpleanos">
                <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white w-64">
                  <Cake className="mr-2 h-5 w-5" />
                  Fiestas de Cumpleaños
                </Button>
              </Link>
              <Link href="/eventos-empresariales">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white w-64">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Eventos Empresariales
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

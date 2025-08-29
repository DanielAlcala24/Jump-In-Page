'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const blogPosts = [
  {
    title: '5 Beneficios de Saltar en Trampolín para tu Salud',
    description:
      'Descubre cómo saltar no solo es divertido, sino también una excelente forma de ejercicio cardiovascular que mejora tu equilibrio y fortalece tus músculos.',
    imageSrc: 'https://picsum.photos/800/600?random=9',
    imageHint: 'health fitness',
    href: '#',
    colorClass: 'bg-sky-500 hover:bg-sky-600',
  },
  {
    title: 'Ideas Creativas para tu Próxima Fiesta de Cumpleaños',
    description:
      'Desde fiestas temáticas hasta competencias amistosas, te damos ideas originales para que la próxima celebración de cumpleaños en Jump-In sea inolvidable.',
    imageSrc: 'https://picsum.photos/800/600?random=10',
    imageHint: 'party ideas',
    href: '#',
    colorClass: 'bg-pink-500 hover:bg-pink-600',
  },
  {
    title: 'Team Building en Jump-In: ¡Una Experiencia Única!',
    description:
      'Rompe la rutina de la oficina y fomenta la colaboración y la comunicación en tu equipo con nuestras actividades de team building llenas de energía y diversión.',
    imageSrc: 'https://picsum.photos/800/600?random=11',
    imageHint: 'team building',
    href: '#',
    colorClass: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    title: 'La Seguridad es Primero: Nuestras Medidas en Jump-In',
    description:
      'Conoce todas las medidas de seguridad que implementamos para garantizar que tu única preocupación sea divertirte al máximo.',
    imageSrc: 'https://picsum.photos/800/600?random=12',
    imageHint: 'safety measures',
    href: '#',
    colorClass: 'bg-green-500 hover:bg-green-600',
  },
  {
    title: '¿Por Qué Saltar es el Mejor Remedio Contra el Estrés?',
    description:
      'Libera tensiones y mejora tu estado de ánimo con una buena sesión de saltos. Te explicamos la ciencia detrás de este divertido antiestrés.',
    imageSrc: 'https://picsum.photos/800/600?random=13',
    imageHint: 'stress relief',
    href: '#',
    colorClass: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    title: 'Alimentación y Energía: ¿Qué Comer Antes de Saltar?',
    description:
      'Te damos algunos consejos sobre qué alimentos y bebidas te darán la energía que necesitas para una jornada de saltos sin parar.',
    imageSrc: 'https://picsum.photos/800/600?random=14',
    imageHint: 'healthy food',
    href: '#',
    colorClass: 'bg-red-500 hover:bg-red-600',
  },
];

export default function BlogPosts() {
  return (
    <section id="blog" className="w-full py-12 bg-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
              Nuestro Blog
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Noticias, Tips y Más
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Sumérgete en el universo Jump-In y no te pierdas ninguna de
              nuestras novedades.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950"
            >
              <Link href={post.href} className="block overflow-hidden">
                <Image
                  src={post.imageSrc}
                  alt={post.title}
                  width={800}
                  height={600}
                  data-ai-hint={post.imageHint}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">
                  {post.title}
                </h3>
                <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>
                <Link href={post.href}>
                  <Button
                    className={cn(
                      'mt-auto w-full text-white transition-transform group-hover:scale-105',
                      post.colorClass
                    )}
                  >
                    Leer Más
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

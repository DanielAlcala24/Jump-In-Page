
import { getStrapiMedia } from '@/lib/strapi';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import Footer from '@/components/footer';
import { cn } from '@/lib/utils';

// Placeholder data
const posts = [
  {
    id: 1,
    attributes: {
      title: 'Título del Blog de Ejemplo 1',
      slug: 'ejemplo-1',
      description: 'Esta es una descripción de ejemplo para la primera entrada del blog. El contenido se llenará cuando se conecte a Strapi.',
      coverImage: {
        data: {
          attributes: {
            url: '/assets/g1.jpg'
          }
        }
      },
      imageHint: 'blog post'
    }
  },
  {
    id: 2,
    attributes: {
      title: 'Título del Blog de Ejemplo 2',
      slug: 'ejemplo-2',
      description: 'Esta es una descripción de ejemplo para la segunda entrada del blog. El contenido se llenará cuando se conecte a Strapi.',
       coverImage: {
        data: {
          attributes: {
            url: '/assets/g2.jpg'
          }
        }
      },
      imageHint: 'blog ideas'
    }
  },
    {
    id: 3,
    attributes: {
      title: 'Título del Blog de Ejemplo 3',
      slug: 'ejemplo-3',
      description: 'Esta es una descripción de ejemplo para la tercera entrada del blog. El contenido se llenará cuando se conecte a Strapi.',
       coverImage: {
        data: {
          attributes: {
            url: '/assets/g3.jpeg'
          }
        }
      },
      imageHint: 'blog content'
    }
  }
];


export default async function BlogPage() {

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
              Nuestro Blog
            </h1>
          </div>
          <div className="absolute bottom-0 z-10 flex flex-col items-center">
            <Link href="#blog" aria-label="Scroll down">
              <ChevronDown className="h-10 w-10 animate-bounce text-background/80" />
            </Link>
          </div>
        </section>
        
        <section id="blog" className="w-full py-12 pt-12 bg-white">
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
                {posts.map((post) => (
                    <div
                    key={post.id}
                    className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950"
                    >
                    <Link href={`/blog`} className="block overflow-hidden">
                        <Image
                        src={post.attributes.coverImage.data.attributes.url || '/assets/g1.jpg'}
                        alt={post.attributes.title}
                        width={800}
                        height={600}
                        data-ai-hint={post.attributes.imageHint}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>
                    <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-2 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">
                        {post.attributes.title}
                        </h3>
                        <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">
                        {post.attributes.description}
                        </p>
                        <Link href={`/blog`}>
                        <Button
                            className={cn(
                            'mt-auto w-full text-white transition-transform group-hover:scale-105',
                            'bg-orange-500 hover:bg-orange-600'
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
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

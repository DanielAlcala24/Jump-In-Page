'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getStrapiMedia, type Post } from '@/lib/strapi';
import { useEffect, useState } from 'react';

export default function BlogPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog');
        if (!res.ok) {
          console.error('Failed to fetch posts');
          return;
        }
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    fetchPosts();
  }, []);

  return (
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
              <Link href={`/blog/${post.attributes.slug}`} className="block overflow-hidden">
                <Image
                  src={getStrapiMedia(post.attributes.coverImage.data.attributes.url) || '/assets/g1.jpg'}
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
                <Link href={`/blog/${post.attributes.slug}`}>
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
  );
}

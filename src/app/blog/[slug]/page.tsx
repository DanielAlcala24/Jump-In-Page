import { createServerComponentClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import VideoBackground from '@/components/video-background'
import Header from '@/components/header'
import SocialIcons from '@/components/social-icons'
import WhatsappButton from '@/components/whatsapp-button'
import Footer from '@/components/footer'
import { notFound } from 'next/navigation'

interface Post {
  id: string
  title: string
  slug: string
  description: string
  content: string
  cover_image: string
  created_at: string
  updated_at?: string
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createServerComponentClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, description, cover_image')
    .eq('slug', params.slug)
    .single()

  if (!post) {
    return {
      title: 'Post no encontrado | Jump-In',
    }
  }

  return {
    title: `${post.title} | Jump-In Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.cover_image ? [post.cover_image] : [],
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createServerComponentClient()
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !post) {
    notFound()
  }

  // Structured Data (JSON-LD) para SEO - BlogPosting
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": post.cover_image || '',
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "author": {
      "@type": "Organization",
      "name": "Jump-In"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Jump-In",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jumpin.com.mx'}/assets/logojumpin.png`
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <div className="flex flex-col min-h-screen">
        <VideoBackground />
        <Header />
        <SocialIcons />
        <main className="flex-1">
          {/* Hero Section */}
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
              <h1 className="text-3xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline mb-4">
                {post.title}
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                {post.description}
              </p>
              <div className="mt-4 text-sm text-white/60">
                Publicado el {new Date(post.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="w-full py-12 bg-white">
            <div className="container mx-auto max-w-4xl px-4 md:px-6">
              {/* Cover Image */}
              {post.cover_image && (
                <div className="mb-8">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    width={1200}
                    height={600}
                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Back Button */}
              <div className="mt-12 text-center">
                <Link href="/blog">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Blog
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <WhatsappButton />
        <Footer />
      </div>
    </>
  )
}

import BlogPosts from '@/components/sections/blog-posts';
import Footer from '@/components/footer';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import VideoBackground from '@/components/video-background';

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <section className="relative flex h-[50vh] w-full flex-col items-center justify-center text-center text-white md:h-96">
          <div className="relative z-10 mx-4 flex flex-col items-center">
            <h1 className="text-5xl font-extrabold tracking-tighter text-background sm:text-7xl md:text-8xl font-headline">
              Nuestro Blog
            </h1>
          </div>
        </section>
        <BlogPosts />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

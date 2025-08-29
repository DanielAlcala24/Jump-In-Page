import BlogPosts from '@/components/sections/blog-posts';
import VideoBackground from '@/components/video-background';

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <main className="flex-1 pt-24">
        <section className="relative flex h-[50vh] w-full flex-col items-center justify-center text-center text-white">
          <div className="relative z-10 mx-4 flex flex-col items-center">
            <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl font-headline">
              Nuestro Blog
            </h1>
          </div>
        </section>
        <BlogPosts />
      </main>
    </div>
  );
}

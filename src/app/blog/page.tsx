import BlogPosts from '@/components/sections/blog-posts';
import Footer from '@/components/footer';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <SocialIcons />
      <main className="flex-1 pt-24">
        <BlogPosts />
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

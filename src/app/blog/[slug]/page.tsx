import { getPostBySlug, getStrapiMedia } from '@/lib/strapi';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import Footer from '@/components/footer';

// This is a basic markdown to HTML converter. 
// For a production app, you might want a more robust library like 'marked' or 'react-markdown'.
function renderContent(content: any[]) {
    return content.map((block, index) => {
        if (block.type === 'paragraph') {
            return (
                <p key={index} className="mb-4 text-lg/relaxed">
                    {block.children.map((child: any, childIndex: number) => {
                         if (child.type === 'text') {
                            let textElement: React.ReactNode = child.text;
                            if (child.bold) {
                                textElement = <strong>{textElement}</strong>;
                            }
                            if (child.italic) {
                                textElement = <em>{textElement}</em>;
                            }
                            if (child.underline) {
                                textElement = <u>{textElement}</u>;
                            }
                            return <React.Fragment key={childIndex}>{textElement}</React.Fragment>;
                        }
                        return null;
                    })}
                </p>
            );
        }
        if (block.type === 'heading') {
            const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return (
                <Tag key={index} className="mt-6 mb-2 text-2xl font-bold font-headline">
                    {block.children.map((child: any) => child.text).join('')}
                </Tag>
            )
        }
        if (block.type === 'list') {
            const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
            return (
                <ListTag key={index} className={`mb-4 pl-6 ${block.format === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
                    {block.children.map((listItem: any, listItemIndex: number) => (
                         <li key={listItemIndex} className="mb-2">
                           {listItem.children.map((child: any, childIndex: number) => child.text)}
                         </li>
                    ))}
                </ListTag>
            )
        }
        // Add more block types as needed (e.g., images, quotes)
        return null;
    });
}


export default async function PostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    const imageUrl = getStrapiMedia(post.attributes.coverImage.data.attributes.url);

    return (
        <div className="flex flex-col min-h-screen">
          <VideoBackground />
          <Header />
          <SocialIcons />
          <main className="flex-1 pt-24">
             <section id="post-content" className="w-full py-12 md:py-16 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <div className="container mx-auto max-w-4xl px-4 md:px-6">
                    <article>
                        <Card className="shadow-lg rounded-2xl overflow-hidden">
                            {imageUrl && (
                                <Image
                                    src={imageUrl}
                                    alt={post.attributes.title}
                                    width={1200}
                                    height={600}
                                    className="w-full h-auto max-h-[500px] object-cover"
                                    priority
                                />
                            )}
                            <CardHeader className="p-6 md:p-8">
                                <CardTitle className="text-3xl md:text-4xl font-extrabold font-headline text-center">
                                    {post.attributes.title}
                                </CardTitle>
                                <p className="text-center text-muted-foreground mt-2">
                                    Publicado el {new Date(post.attributes.publishedAt).toLocaleDateString('es-MX', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </CardHeader>
                            <CardContent className="px-6 md:px-8 pb-8 text-muted-foreground">
                                <div className="prose prose-lg max-w-none">
                                   {renderContent(post.attributes.content)}
                                </div>
                            </CardContent>
                        </Card>
                    </article>
                </div>
            </section>
          </main>
          <WhatsappButton />
          <Footer />
        </div>
    );
}

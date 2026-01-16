
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog | Noticias y Tips',
    description: 'Mantente al día con las últimas noticias, eventos y tips de seguridad y diversión en Jump-In México.',
    keywords: 'blog, noticias, eventos, tips de salto, trampoline park blog',
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

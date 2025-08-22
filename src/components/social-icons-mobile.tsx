import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.528 8.003c-.223-.008-.446-.013-.672-.013-4.142 0-7.5 3.358-7.5 7.5 0 .227.005.45.013.672h-2.013v-3.333c0-2.485 2.015-4.5 4.5-4.5h3.672v3.674z" />
      <path d="M16.5 4.5c0-2.485-2.015-4.5-4.5-4.5s-4.5 2.015-4.5 4.5v12.083c.008.227.013.45.013.672 4.142 0 7.5-3.358 7.5-7.5 0-.227-.005-.45-.013-.672h2.013v-3.333c0-2.485-2.015-4.5-4.5-4.5z" />
    </svg>
  );

const socialLinks = [
  { href: '#', icon: <TikTokIcon />, label: 'TikTok' },
  { href: '#', icon: <Instagram />, label: 'Instagram' },
  { href: '#', icon: <Facebook />, label: 'Facebook' },
  { href: '#', icon: <Youtube />, label: 'YouTube' },
];

export default function SocialIconsMobile() {
  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2 md:hidden">
      {socialLinks.map((social) => (
        <Button key={social.label} variant="ghost" size="icon" asChild className="rounded-full backdrop-blur-xl bg-orange-500/70 hover:bg-orange-500/40 shadow-2xl text-background transition-transform duration-300 ease-in-out hover:scale-110 shadow-black/50">
          <Link href={social.href} aria-label={social.label}>
            {social.icon}
          </Link>
        </Button>
      ))}
    </div>
  );
}

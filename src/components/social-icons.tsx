import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const socialLinks = [
  { href: 'https://www.tiktok.com/@jumpin_mx', icon: <Image src="/assets/svg/tiktok.png" alt="TikTok" width={24} height={24} />, label: 'TikTok' },
  { href: 'https://www.instagram.com/jumpin_mx', icon: <Instagram />, label: 'Instagram' },
  { href: 'https://www.facebook.com/JumpInMX/?locale=es_LA', icon: <Facebook />, label: 'Facebook' },
  { href: 'https://www.youtube.com/channel/UCQ0A6bqmDR1EThKl1o0l1Zg', icon: <Youtube />, label: 'YouTube' },
];

export default function SocialIcons() {
  return (
    <div className="fixed right-4 top-1/2 z-40 -translate-y-1/2 hidden flex-col gap-2 md:flex">
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

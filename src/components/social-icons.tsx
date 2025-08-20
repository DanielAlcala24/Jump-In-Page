import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const socialLinks = [
  { href: '#', icon: <Facebook />, label: 'Facebook' },
  { href: '#', icon: <Instagram />, label: 'Instagram' },
  { href: '#', icon: <Twitter />, label: 'Twitter' },
];

export default function SocialIcons() {
  return (
    <div className="fixed right-4 top-1/2 z-40 -translate-y-1/2 hidden flex-col gap-2 md:flex">
      {socialLinks.map((social) => (
        <Button key={social.label} variant="outline" size="icon" asChild className="rounded-full bg-accent/20 backdrop-blur-xl">
          <Link href={social.href} aria-label={social.label}>
            {social.icon}
          </Link>
        </Button>
      ))}
    </div>
  );
}

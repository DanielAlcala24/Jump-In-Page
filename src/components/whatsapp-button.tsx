import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function WhatsappButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        size="icon"
        asChild
        className="rounded-full bg-transparent hover:bg-transparent w-14 h-14 shadow-lg transition-transform duration-300 ease-in-out hover:scale-110"
      >
        <Link href="https://wa.me/5215555555555" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <Image 
                src="/assets/gifs/icons-whatsapp.gif" 
                alt="WhatsApp" 
                width={56} 
                height={56} 
                data-ai-hint="whatsapp gif"
                className="rounded-full"
            />
        </Link>
      </Button>
    </div>
  );
}

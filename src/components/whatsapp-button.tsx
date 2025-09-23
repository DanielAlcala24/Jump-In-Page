import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function WhatsappButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        size="icon"
        asChild
        className="rounded-full bg-transparent hover:bg-transparent w-14 h-14 shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 p-0"
      >
        <Link href="https://wa.me/525536441494" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <Image 
                src="/assets/svg/whatsapp.svg" 
                alt="WhatsApp" 
                width={56} 
                height={56} 
                data-ai-hint="whatsapp icon"
                className=""
            />
        </Link>
      </Button>
    </div>
  );
}

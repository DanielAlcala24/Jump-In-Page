import Link from 'next/link';
import { Button } from '@/components/ui/button';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.654 4.227 1.905 5.817l-1.06 3.864 3.952-1.042z" />
  </svg>
);

export default function WhatsappButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        size="icon"
        asChild
        className="rounded-full bg-green-500 hover:bg-green-600 text-white w-14 h-14 shadow-lg transition-transform duration-300 ease-in-out hover:scale-110"
      >
        <Link href="https://wa.me/5215555555555" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <WhatsAppIcon className="h-7 w-7" />
        </Link>
      </Button>
    </div>
  );
}

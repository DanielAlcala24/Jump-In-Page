import Link from 'next/link';
import { Facebook, Youtube, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';

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

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
             <Image 
                src="/assets/logojumpin.png"
                alt="Jump-in Trampoline Park Logo"
                width={90}
                height={90}
                data-ai-hint="logo jump"
                className="h-auto"
              />
             <p className="text-sm text-gray-400">
                El Primer Trampoline Park en México. Diversión, ejercicio y deporte para toda la familia.
             </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-headline">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Facturación</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Contacto</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Trabaja con nosotros</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Aviso de Privacidad</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Términos y Condiciones</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-headline">Síguenos</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="TikTok" className="text-gray-400 hover:text-orange-500 transition-colors"><TikTokIcon /></Link>
              <Link href="#" aria-label="Instagram" className="text-gray-400 hover:text-orange-500 transition-colors"><Instagram /></Link>
              <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-orange-500 transition-colors"><Facebook /></Link>
              <Link href="#" aria-label="YouTube" className="text-gray-400 hover:text-orange-500 transition-colors"><Youtube /></Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Jump-In. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

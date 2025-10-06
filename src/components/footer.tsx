
import Link from 'next/link';
import { Facebook, Youtube, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';

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
                El Primer Trampoline Park en México. Diversión, entretenimiento y deporte para toda la familia.
             </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-headline">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Facturación</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Contacto</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Trabaja con nosotros</Link></li>
              <li><Link href="/aviso-de-privacidad" className="hover:text-orange-500 transition-colors">Aviso de Privacidad</Link></li>
              <li><Link href="/terminos-y-condiciones" className="hover:text-orange-500 transition-colors">Términos y Condiciones</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-headline">Síguenos</h3>
            <div className="flex items-center space-x-4">
              <Link href="https://www.tiktok.com/@jumpin_mx" aria-label="TikTok" className="text-white hover:text-orange-500 transition-colors">
                <Image src="/assets/svg/tiktok.png" alt="TikTok" width={16} height={16} />
              </Link>
              <Link href="https://www.instagram.com/jumpin_mx" aria-label="Instagram" className="text-white hover:text-orange-500 transition-colors"><Instagram size={16} /></Link>
              <Link href="https://www.facebook.com/JumpInMX/?locale=es_LA" aria-label="Facebook" className="text-white hover:text-orange-500 transition-colors"><Facebook size={16} /></Link>
              <Link href="https://www.youtube.com/channel/UCQ0A6bqmDR1EThKl1o0l1Zg" aria-label="YouTube" className="text-white hover:text-orange-500 transition-colors"><Youtube size={16} /></Link>
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

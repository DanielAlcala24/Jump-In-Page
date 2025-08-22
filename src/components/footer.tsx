import Link from 'next/link';
import { Facebook, Youtube, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
             <h3 className="text-2xl font-bold font-headline text-orange-500">Jump-In</h3>
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
              <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-orange-500 transition-colors"><Facebook /></Link>
              <Link href="#" aria-label="YouTube" className="text-gray-400 hover:text-orange-500 transition-colors"><Youtube /></Link>
              <Link href="#" aria-label="Instagram" className="text-gray-400 hover:text-orange-500 transition-colors"><Instagram /></Link>
              <Link href="#" aria-label="Twitter" className="text-gray-400 hover:text-orange-500 transition-colors"><Twitter /></Link>
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
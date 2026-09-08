'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

// Rutas donde el botón NO se muestra: la propia tienda (el cliente ya está ahí, incluye
// /shop/success) y el panel de administración.
const RUTAS_OCULTAS = ['/shop', '/admin'];

/**
 * Botón flotante de la tienda en línea. Va montado una sola vez en el layout raíz
 * (no página por página como <WhatsappButton>) porque debe salir en todas las
 * secciones públicas y decidir por sí mismo dónde esconderse.
 */
export default function ShopButton() {
  const pathname = usePathname() || '';

  const oculto = RUTAS_OCULTAS.some(
    (ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`)
  );
  if (oculto) return null;

  return (
    // Espejo del botón de WhatsApp (bottom-4 right-4), del lado izquierdo.
    <div className="fixed bottom-4 left-4 z-50">
      {/* En móvil va más compacto; a partir de md iguala el tamaño del de WhatsApp (h-14). */}
      <Link
        href="/shop"
        aria-label="Compra tus entradas en línea"
        className="flex h-11 items-center gap-1.5 rounded-full bg-orange-500 px-3.5 text-background shadow-lg shadow-black/30 transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-orange-600 md:h-14 md:gap-2 md:px-5"
      >
        <ShoppingCart className="h-5 w-5 flex-shrink-0 md:h-6 md:w-6" />
        <span className="font-headline text-xs font-bold leading-tight md:text-sm">
          Compra tus entradas
        </span>
      </Link>
    </div>
  );
}

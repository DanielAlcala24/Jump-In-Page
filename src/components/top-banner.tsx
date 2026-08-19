'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const DISMISS_KEY = 'jumpin-top-banner-dismissed';

/** Alto máximo por defecto (px) al mostrar la imagen de móvil en PC */
export const DEFAULT_DESKTOP_MAX_HEIGHT = 200;

export interface TopBannerProps {
  /** Imagen para PC. Si falta, se usa la de móvil con franjas negras a los costados */
  desktopImageUrl?: string | null;
  /** Imagen para móvil. Si falta, se usa la de PC en todas las pantallas */
  mobileImageUrl?: string | null;
  imageAlt?: string | null;
  linkUrl?: string | null;
  isDismissible?: boolean;
  /** Alto máximo (px) de la imagen de móvil cuando se muestra en PC */
  desktopMaxHeight?: number | null;
  /** Firma de la configuración: si cambia, el banner cerrado vuelve a mostrarse */
  version: string;
}

export default function TopBanner({
  desktopImageUrl,
  mobileImageUrl,
  imageAlt,
  linkUrl,
  isDismissible = true,
  desktopMaxHeight,
  version,
}: TopBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Si el visitante ya lo cerró en esta sesión, no lo volvemos a mostrar
  useEffect(() => {
    if (!isDismissible) return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === version) {
        setDismissed(true);
      }
    } catch {
      // sessionStorage bloqueado (modo privado / cookies deshabilitadas)
    }
  }, [isDismissible, version]);

  // Publicamos la altura real del banner para que el header flotante se recorra
  useEffect(() => {
    const root = document.documentElement;

    if (dismissed) {
      root.style.setProperty('--banner-h', '0px');
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const apply = () => root.style.setProperty('--banner-h', `${el.offsetHeight}px`);
    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(el);

    return () => {
      observer.disconnect();
      root.style.removeProperty('--banner-h');
    };
  }, [dismissed]);

  if (dismissed) return null;

  const hasDesktop = !!desktopImageUrl;
  const hasMobile = !!mobileImageUrl;

  if (!hasDesktop && !hasMobile) return null;

  // Solo hay imagen de móvil: en PC la centramos a un alto máximo y quedan
  // franjas negras a los costados, en lugar de estirarla a todo lo ancho.
  const pillarbox = hasMobile && !hasDesktop;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, version);
    } catch {
      // sessionStorage bloqueado
    }
  };

  const isExternal = /^https?:\/\//i.test(linkUrl || '');
  const altText = imageAlt || 'Banner promocional de Jump-In';

  const images = (
    <>
      {hasMobile && (
        // eslint-disable-next-line @next/next/no-img-element -- respetamos la proporción original del banner
        <img
          src={mobileImageUrl!}
          alt={altText}
          className={cn(
            'block h-auto w-full',
            // Hay imagen propia de PC: esta solo se ve en pantallas chicas
            hasDesktop && 'md:hidden',
            // Sin imagen de PC: se centra con alto máximo (franjas negras)
            pillarbox && 'md:mx-auto md:h-auto md:w-auto md:max-h-[var(--banner-max-h)] md:max-w-full'
          )}
          fetchPriority="high"
        />
      )}
      {hasDesktop && (
        // eslint-disable-next-line @next/next/no-img-element -- respetamos la proporción original del banner
        <img
          src={desktopImageUrl!}
          alt={altText}
          className={cn('block h-auto w-full', hasMobile && 'hidden md:block')}
          fetchPriority="high"
        />
      )}
    </>
  );

  return (
    // z-30: debajo del popup y los diálogos (z-50) para no tapar su botón de cierre
    <div
      ref={containerRef}
      className="relative z-30 w-full bg-black"
      style={
        {
          '--banner-max-h': `${desktopMaxHeight || DEFAULT_DESKTOP_MAX_HEIGHT}px`,
        } as CSSProperties
      }
      data-testid="top-banner"
    >
      {linkUrl ? (
        <Link
          href={linkUrl}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="block"
          aria-label={imageAlt || 'Ver más'}
        >
          {images}
        </Link>
      ) : (
        images
      )}

      {isDismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Cerrar banner"
          className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:right-4 md:h-8 md:w-8"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

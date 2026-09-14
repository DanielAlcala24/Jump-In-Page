'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoSrc?: string;
  /** Versión vertical (9:16) para pantallas en portrait. Opcional. */
  mobileVideoSrc?: string;
  /** Imagen (primer frame del video) que se ve mientras carga o si el video no se puede reproducir. */
  poster?: string;
  mobilePoster?: string;
}

// Si no se pasa `videoSrc`, se usa este video con sus variantes.
const DEFAULT_VIDEO = {
  videoSrc: '/assets/CasaFut.mp4',
  mobileVideoSrc: '/assets/CasaFut-mobile.mp4',
  poster: '/assets/CasaFut-poster.jpg',
  mobilePoster: '/assets/CasaFut-mobile-poster.jpg',
};

// Teléfonos (y tablets verticales) reciben la versión 9:16: pesa menos y object-cover no la recorta tanto.
const PORTRAIT_QUERY = '(orientation: portrait)';

export default function VideoBackground(props: VideoBackgroundProps) {
  const { videoSrc, mobileVideoSrc, poster, mobilePoster } = props.videoSrc ? props : DEFAULT_VIDEO;
  const videoRef = useRef<HTMLVideoElement>(null);
  // El src se elige en el cliente para que el teléfono no descargue también la versión de escritorio.
  const [src, setSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const isPortrait = mobileVideoSrc && window.matchMedia(PORTRAIT_QUERY).matches;
    setSrc(isPortrait ? mobileVideoSrc : videoSrc ?? null);
  }, [videoSrc, mobileVideoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // iOS solo permite autoplay si el video está silenciado; se fuerza la propiedad por si acaso.
    video.muted = true;
    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay bloqueado (p. ej. modo de ahorro de batería en iOS): se queda la imagen de fondo.
      });
    };
    tryPlay();

    // Si el navegador bloqueó el autoplay, se reintenta con el primer toque del usuario.
    const onGesture = () => {
      if (video.paused) tryPlay();
    };
    window.addEventListener('touchstart', onGesture, { once: true, passive: true });
    window.addEventListener('click', onGesture, { once: true });
    return () => {
      window.removeEventListener('touchstart', onGesture);
      window.removeEventListener('click', onGesture);
    };
  }, [src]);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden bg-black" aria-hidden="true">
      {/* La imagen siempre está debajo: si el video tarda, falla o no se reproduce, nunca queda en negro. */}
      {poster && (
        <picture>
          {mobilePoster && <source media={PORTRAIT_QUERY} srcSet={mobilePoster} />}
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
      )}
      <video
        ref={videoRef}
        src={src ?? undefined}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onPlaying={() => setIsPlaying(true)}
        // Invisible hasta que realmente reproduce: así tampoco se ve el botón de "play" que pone iOS.
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div className="absolute inset-0 z-10 bg-black/50" />
    </div>
  );
}

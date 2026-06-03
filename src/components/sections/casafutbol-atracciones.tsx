'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MousePointerClick } from 'lucide-react';

const cards = [
  { id: 0, image: '/assets/fut.jpg',                                      alt: 'Atracción 1' },
  { id: 1, image: '/assets/atracciones/exclusivas/arenaFutbol.jpg',       alt: 'Atracción 2' },
  { id: 2, image: '/assets/atracciones/trampolines/mainCourt.jpg',        alt: 'Atracción 3' },
  { id: 3, image: '/assets/atracciones/extremas/ninja.jpg',               alt: 'Atracción 4' },
];

export default function CasaFutbolAtracciones() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <>
      <style>{`
        .flip-scene {
          perspective: 1200px;
        }
        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1);
        }
        @media (hover: hover) and (pointer: fine) {
          .flip-scene:hover .flip-inner {
            transform: rotateY(180deg);
          }
        }
        .flip-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 4px;
          overflow: hidden;
        }
        .flip-face-back {
          transform: rotateY(180deg);
        }
        @keyframes proximamente-pulse {
          0%, 100% { letter-spacing: 0.25em; opacity: 0.9; }
          50%       { letter-spacing: 0.35em; opacity: 1; }
        }
        .prox-text {
          animation: proximamente-pulse 3s ease-in-out infinite;
        }
      `}</style>

      <section className="relative bg-black py-24 px-4">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="max-w-6xl mx-auto">
          <p className="text-center text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4 font-headline">
            Nuevas Atracciones
          </p>
          <h2 className="text-center text-3xl md:text-4xl font-extrabold font-headline text-white mb-3 tracking-tight">
            ¿Qué se viene?
          </h2>
          <p className="text-center text-white/30 text-sm mb-14 flex items-center justify-center gap-2">
            <MousePointerClick className="h-4 w-4 shrink-0" />
            <span className="hidden md:inline">Pasa el ratón sobre cada tarjeta para revelar</span>
            <span className="md:hidden">Toca cada tarjeta para revelar</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {cards.map(({ id, image, alt }) => (
              <div
                key={id}
                className="flip-scene cursor-pointer"
                style={{ height: '320px' }}
                onClick={() => toggle(id)}
                role="button"
                aria-label={`Revelar atracción ${id + 1}`}
                aria-pressed={flipped.has(id)}
              >
                <div className={`flip-inner${flipped.has(id) ? ' is-flipped' : ''}`}>

                  {/* ── FRENTE ── */}
                  <div className="flip-face">
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    {/* Overlay oscuro con degradado */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
                    {/* Borde interior sutil */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-sm" />

                    {/* Contenido centrado */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                      <div className="flex flex-col items-center">
                        <span className="text-6xl font-black text-white/20 select-none">?</span>
                        <p className="text-white/40 text-xs font-mono tracking-[0.3em] uppercase mt-2">
                          Clasificado
                        </p>
                      </div>
                    </div>

                    {/* Número de tarjeta */}
                    <span className="absolute top-5 left-5 text-xs font-mono text-white/25 tracking-widest z-10">
                      [ 0{id + 1} ]
                    </span>
                  </div>

                  {/* ── REVERSO ── */}
                  <div className="flip-face flip-face-back">
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      className="object-cover scale-105 blur-[2px]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    {/* Overlay más denso */}
                    <div className="absolute inset-0 bg-black/80" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/15 rounded-sm" />

                    {/* Contenido centrado */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-6 text-center">
                      <span className="inline-block border border-white/20 text-[10px] tracking-[0.3em] uppercase text-white/40 px-4 py-1 font-mono mb-2">
                        Jump-In × Casa Fútbol
                      </span>
                      <p className="prox-text text-3xl md:text-4xl font-extrabold font-headline text-white uppercase">
                        Próximamente
                      </p>
                      <p className="text-white/30 text-xs tracking-widest font-mono mt-1">
                        Estamos afinando los últimos detalles
                      </p>
                    </div>

                    {/* Número */}
                    <span className="absolute top-5 left-5 text-xs font-mono text-white/25 tracking-widest z-10">
                      [ 0{id + 1} ]
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </section>
    </>
  );
}

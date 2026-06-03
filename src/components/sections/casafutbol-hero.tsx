'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const LAUNCH_DATE = new Date('2026-06-20T00:00:00');

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export default function CasaFutbolHero() {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);

  return (
    <>
      <style>{`
        @keyframes glitch-clip-1 {
          0%   { clip-path: inset(40% 0 61% 0); transform: translate(-4px, 2px); }
          20%  { clip-path: inset(92% 0 1% 0);  transform: translate(4px, -2px); }
          40%  { clip-path: inset(15% 0 70% 0); transform: translate(0px, 3px); }
          60%  { clip-path: inset(55% 0 28% 0); transform: translate(-3px, 0px); }
          80%  { clip-path: inset(5% 0 84% 0);  transform: translate(3px, 2px); }
          100% { clip-path: inset(40% 0 61% 0); transform: translate(-4px, 2px); }
        }
        @keyframes glitch-clip-2 {
          0%   { clip-path: inset(65% 0 10% 0); transform: translate(4px, -3px); }
          20%  { clip-path: inset(25% 0 54% 0); transform: translate(-4px, 1px); }
          40%  { clip-path: inset(80% 0 5% 0);  transform: translate(2px, -1px); }
          60%  { clip-path: inset(10% 0 76% 0); transform: translate(-2px, 3px); }
          80%  { clip-path: inset(48% 0 32% 0); transform: translate(4px, -2px); }
          100% { clip-path: inset(65% 0 10% 0); transform: translate(4px, -3px); }
        }
        @keyframes scanline-scroll {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes flicker {
          0%, 94%, 100% { opacity: 1; }
          95%  { opacity: 0.6; }
          96%  { opacity: 1; }
          97%  { opacity: 0.4; }
          98%  { opacity: 1; }
        }
        @keyframes counter-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.04); }
        }
        .glitch-title {
          position: relative;
          animation: flicker 7s infinite;
        }
        .glitch-title::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: #00e5ff;
          animation: glitch-clip-1 4s infinite;
          opacity: 0.65;
          pointer-events: none;
        }
        .glitch-title::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: #ff1744;
          animation: glitch-clip-2 4s infinite 0.18s;
          opacity: 0.65;
          pointer-events: none;
        }
        .countdown-digit {
          animation: counter-pulse 1s ease-in-out infinite;
        }
      `}</style>

      <section className="relative flex h-screen w-full flex-col items-center justify-center text-center text-white overflow-hidden">
        {/* Video con el overlay oscuro encima */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/assets/jumpincasafutbol.mp4" type="video/mp4" />
        </video>

        {/* Overlay negro denso */}
        <div className="absolute inset-0 bg-black/82" />

        {/* Grid decorativo */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Línea de escaneo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-[0.04]">
          <div
            className="w-full h-1 bg-white"
            style={{ animation: 'scanline-scroll 9s linear infinite' }}
          />
        </div>

        {/* Contenido principal */}
        <div className="relative z-20 flex flex-col items-center px-4 max-w-5xl mx-auto">

          {/* Co-branding: Jump-In × Casa Fútbol */}
          <div className="flex items-center justify-center gap-5 md:gap-10 mb-10 md:mb-14">
            <Image
              src="/assets/logojumpin.png"
              alt="Jump-In"
              width={160}
              height={64}
              className="h-10 md:h-14 w-auto object-contain"
              priority
            />
            <span className="text-4xl md:text-5xl font-black text-white/80 font-headline select-none">
              ✕
            </span>
            <Image
              src="/assets/Logo_CasaFut.png"
              alt="Casa Fútbol"
              width={160}
              height={64}
              className="h-10 md:h-14 w-auto object-contain"
              priority
            />
          </div>

          {/* H1 con efecto glitch */}
          <h1
            className="glitch-title text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-[3.4rem] font-headline leading-tight mb-6 uppercase"
            data-text="DOS MUNDOS SE UNEN. EL JUEGO ESTÁ POR CAMBIAR."
          >
            DOS MUNDOS SE UNEN.<br />
            <span className="text-white/80">EL JUEGO ESTÁ POR CAMBIAR.</span>
          </h1>

          {/* Subtexto */}
          <p className="max-w-xl text-base md:text-lg text-white/55 mb-10 leading-relaxed">
            Una colaboración exclusiva diseñada para romper la rutina.{' '}
            <span className="text-white/90 font-semibold">
              Algo totalmente nuevo está llegando a nuestras sucursales.
            </span>
          </p>

          {/* Etiqueta cuenta regresiva */}
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/30 mb-5 font-headline">
            — Lanzamiento en —
          </p>

          {/* Cuenta regresiva */}
          <div className="flex gap-3 md:gap-5">
            {[
              { value: days, label: 'Días' },
              { value: hours, label: 'Horas' },
              { value: minutes, label: 'Min' },
              { value: seconds, label: 'Seg' },
            ].map(({ value, label }, i) => (
              <div
                key={label}
                className="flex flex-col items-center border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-3 md:px-7 md:py-4 min-w-[64px] md:min-w-[90px] rounded-sm"
              >
                <span
                  className="countdown-digit text-3xl md:text-5xl font-black font-headline tabular-nums leading-none"
                  style={{ animationDelay: `${i * 0.25}s` }}
                >
                  {String(value).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs text-white/35 uppercase tracking-widest mt-2 font-headline">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Degradado inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      </section>
    </>
  );
}

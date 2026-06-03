import { Zap, Users, Clock } from 'lucide-react';

const teasers = [
  {
    icon: Zap,
    tag: '01',
    title: 'Adrenalina Pura',
    body: 'La gravedad de Jump-In combinada con la pasión de la cancha de fútbol.',
    gradientFrom: 'from-[#006847]/20',
    border: 'border-[#006847]/30 hover:border-[#006847]/70',
    iconColor: 'text-[#00a86b]',
    tagColor: 'text-[#006847]/60',
  },
  {
    icon: Users,
    tag: '02',
    title: 'Experiencia Única',
    body: 'Un concepto interactivo diseñado para retas con amigos donde cada partida es una nueva oportunidad de superar tu puntaje.',
    gradientFrom: 'from-white/10',
    border: 'border-white/20 hover:border-white/50',
    iconColor: 'text-white/80',
    tagColor: 'text-white/30',
  },
  {
    icon: Clock,
    tag: '03',
    title: 'Próximamente',
    body: 'Estamos afinando los últimos detalles en la cancha.',
    gradientFrom: 'from-[#CE1126]/20',
    border: 'border-[#CE1126]/30 hover:border-[#CE1126]/70',
    iconColor: 'text-[#ff3347]',
    tagColor: 'text-[#CE1126]/60',
  },
];

export default function CasaFutbolTeaser() {
  return (
    <section className="relative bg-black py-24 px-4">
      {/* Separador superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <p className="text-center text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4 font-headline">
          Primeras Pistas
        </p>
        <h2 className="text-center text-3xl md:text-4xl font-extrabold font-headline text-white mb-16 tracking-tight">
          ¿Qué puedes esperar?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {teasers.map(({ icon: Icon, tag, title, body, gradientFrom, border, iconColor, tagColor }) => (
            <div
              key={tag}
              className={`relative group rounded-sm border ${border} bg-gradient-to-b ${gradientFrom} to-transparent p-8 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.03]`}
            >
              {/* Grid de fondo */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />

              <div className="relative z-10">
                <span className={`text-xs font-mono ${tagColor} tracking-widest mb-5 block`}>
                  [ {tag} ]
                </span>
                <Icon className={`${iconColor} h-7 w-7 mb-5`} strokeWidth={1.5} />
                <h3 className="text-xl font-bold font-headline text-white mb-3 tracking-wide">
                  {title}
                </h3>
                <p className="text-white/50 leading-relaxed text-sm md:text-base">
                  {body}
                </p>
              </div>

              {/* Línea decorativa inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Separador inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}

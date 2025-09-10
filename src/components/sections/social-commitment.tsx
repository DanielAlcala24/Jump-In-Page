import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const logos = [
  { src: 'https://picsum.photos/150/80?random=1', alt: 'Mundo Imayina Logo', hint: 'Mundo Imayina' },
  { src: 'https://picsum.photos/150/80?random=2', alt: 'FUCAM Logo', hint: 'FUCAM logo' },
  { src: 'https://picsum.photos/150/80?random=3', alt: 'Juguetón Logo', hint: 'Jugueton logo' },
  { src: 'https://picsum.photos/150/80?random=4', alt: 'Antes de Partir Logo', hint: 'Antes Partir' },
  { src: 'https://picsum.photos/150/80?random=5', alt: 'Iluminemos Logo', hint: 'Iluminemos logo' },
];

export default function SocialCommitment() {
  const extendedLogos = [...logos, ...logos];

  return (
    <section id="commitment" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <Card className="shadow-2xl rounded-2xl overflow-hidden bg-white">
          <CardHeader className="text-center p-8 bg-white">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline mx-auto">
              Nuestra Misión
            </div>
            <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline mt-2">
              Cada Salto Transforma Vidas
            </CardTitle>
            <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-lg">
              En Jump-In creemos que cada salto puede transformar vidas. Por eso, además de ser el primer trampoline park en México, nos sumamos a causas que generan un cambio positivo en la sociedad.
            </p>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            <h3 className="text-2xl font-bold font-headline text-center mb-6">
              Fundaciones y Causas que Apoyamos
            </h3>
            <div
              className="relative w-full overflow-hidden"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              }}
            >
              <div className="flex w-max animate-[scroll_20s_linear_infinite] hover:[animation-play-state:paused]">
                {extendedLogos.map((logo, index) => (
                  <div key={index} className="w-52 h-24 flex items-center justify-center mx-4">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={150}
                      height={80}
                      data-ai-hint={logo.hint}
                      className="object-contain max-w-full max-h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t text-center">
              <h3 className="text-xl font-bold font-headline">Tu Participación Cuenta</h3>
              <p className="mt-2 text-muted-foreground">
                Al visitarnos, te sumas a estas iniciativas y ayudas a que juntos sigamos iluminando sonrisas dentro y fuera de nuestros parques.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function Introduccion() {
    return (
      <section id="introduccion" className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                ¿Quiénes Somos?
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Más que Solo Saltar
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Jump-In es un innovador centro de entretenimiento que integra diversión, actividad física y deporte para todas las edades. Nuestro compromiso es ofrecer un entorno seguro con instalaciones de la más alta calidad y personal capacitado para que tu única preocupación sea disfrutar al máximo.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
import Image from "next/image";

const media = [
    { type: 'video', src: 'https://www.youtube.com/embed/v5dFh5FjU8M?autoplay=1&mute=1&controls=0&loop=1&playlist=v5dFh5FjU8M', alt: 'Video de apoyo social' },
    { type: 'image', src: 'https://picsum.photos/600/800?random=21', alt: 'Evento benéfico', hint: 'charity event' },
    { type: 'video', src: 'https://www.youtube.com/embed/v5dFh5FjU8M?autoplay=1&mute=1&controls=0&loop=1&playlist=v5dFh5FjU8M', alt: 'Video de voluntariado' },
    { type: 'image', src: 'https://picsum.photos/600/800?random=22', alt: 'Niños sonriendo', hint: 'children smiling' },
];

export default function CommitmentGallery() {
    return (
        <section id="commitment-gallery" className="w-full py-12 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                            Nuestras Acciones
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                            Momentos de Solidaridad
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Imágenes y videos que capturan el espíritu de nuestra labor social.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8">
                    {media.map((item, index) => (
                        <div key={index} className="overflow-hidden rounded-lg group shadow-lg transition-all hover:shadow-2xl">
                           {item.type === 'image' ? (
                             <Image
                                 src={item.src}
                                 alt={item.alt}
                                 width={600}
                                 height={800}
                                 data-ai-hint={item.hint}
                                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                             />
                           ) : (
                            <div className="relative aspect-[3/4] w-full overflow-hidden pointer-events-none">
                                <iframe
                                    className="absolute inset-0 h-full w-full"
                                    src={item.src}
                                    title={item.alt}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                                <div className="absolute inset-0 w-full h-full bg-transparent"></div>
                            </div>
                           )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

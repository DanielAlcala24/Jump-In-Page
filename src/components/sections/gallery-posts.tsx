'use client';
import Image from "next/image"

const images = [
    { src: "/assets/g1.jpg", alt: "Diversión en trampolines", hint: "trampoline fun" },
    { src: "/assets/g2.jpg", alt: "Saltos y piruetas", hint: "jumping tricks" },
    { src: "/assets/g3.jpeg", alt: "Celebrando un cumpleaños", hint: "birthday party" },
    { src: "/assets/g4.jpeg", alt: "Zona de espuma", hint: "foam pit" },
    { src: "/assets/g5.jpeg", alt: "Amigos saltando juntos", hint: "friends jumping" },
    { src: "/assets/g6.jpeg", alt: "Escalando el muro", hint: "climbing wall" },
    { src: "/assets/g7.jpeg", alt: "Evento corporativo", hint: "corporate event" },
    { src: "/assets/g8.jpeg", alt: "Risas y alegría", hint: "kids laughing" },
];

export default function GalleryPosts() {
  return (
    <section id="gallery" className="w-full py-12 bg-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
            {images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg group shadow-lg transition-all hover:shadow-2xl">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={600}
                        height={800}
                        data-ai-hint={image.hint}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}


'use client';
import Image from "next/image";
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };


  return (
    <section id="gallery" className="w-full py-12 bg-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
            {images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg group shadow-lg transition-all hover:shadow-2xl cursor-pointer" onClick={() => openLightbox(index)}>
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
      {lightboxOpen && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="bg-black/80 border-none p-0 max-w-none w-screen h-screen flex items-center justify-center">
            <div className="relative w-full h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:text-white/80 hover:bg-black/50 rounded-full"
                onClick={closeLightbox}
              >
                <X className="h-8 w-8" />
                <span className="sr-only">Cerrar</span>
              </Button>
              <div className="flex items-center justify-center h-full w-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-white/80 hover:bg-black/50 rounded-full h-12 w-12", { 'hidden': images.length <= 1 })}
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-10 w-10" />
                  <span className="sr-only">Anterior</span>
                </Button>
                <div className="relative w-full max-w-4xl h-full max-h-[80vh]">
                  <Image
                    src={images[selectedImageIndex].src}
                    alt={images[selectedImageIndex].alt}
                    fill
                    className="object-contain"
                    quality={100}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-white/80 hover:bg-black/50 rounded-full h-12 w-12", { 'hidden': images.length <= 1 })}
                  onClick={goToNext}
                >
                  <ChevronRight className="h-10 w-10" />
                  <span className="sr-only">Siguiente</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

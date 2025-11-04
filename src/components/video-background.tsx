'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const images = [
    { src: "/assets/g1.jpg", alt: "Background image of people jumping in a trampoline park", hint: "trampoline park" },
    { src: "/assets/g2.jpg", alt: "Background image of people doing tricks on trampolines", hint: "jumping tricks" },
    { src: "/assets/g3.jpeg", alt: "Background image of a birthday party at Jump-In", hint: "birthday party" },
    { src: "/assets/g4.jpeg", alt: "Background image of a foam pit", hint: "foam pit" },
    { src: "/assets/g5.jpeg", alt: "Background image of friends jumping together", hint: "friends jumping" },
    { src: "/assets/g6.jpeg", alt: "Background image of a person on a climbing wall", hint: "climbing wall" },
];

export default function VideoBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          className={cn(
            "object-cover transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
          priority={index === 0}
          quality={80}
          data-ai-hint={image.hint}
        />
      ))}
      <div className="absolute inset-0 z-10 bg-black/80" />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const desktopImages = [
    { src: "/assets/g1.jpg", alt: "Background image of people jumping in a trampoline park", hint: "trampoline park" },
    { src: "/assets/g2.jpg", alt: "Background image of people doing tricks on trampolines", hint: "jumping tricks" },
    { src: "/assets/g4.jpeg", alt: "Background image of a foam pit", hint: "foam pit" },
    { src: "/assets/g5.jpeg", alt: "Background image of friends jumping together", hint: "friends jumping" },
];

const mobileImages = [
    { src: "/assets/g3.jpeg", alt: "Background image of a birthday party at Jump-In", hint: "birthday party" },
    { src: "/assets/g6.jpeg", alt: "Background image of a person on a climbing wall", hint: "climbing wall" },
    { src: "/assets/g7.jpeg", alt: "Background image of an event at Jump-In", hint: "event jump-in" },
    { src: "/assets/g8.jpeg", alt: "Background image of kids smiling", hint: "kids smiling" },
];


export default function VideoBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const images = isMobile ? mobileImages : desktopImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

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
      <div className="absolute inset-0 z-10 bg-black/50" />
    </div>
  );
}

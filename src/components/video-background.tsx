'use client';

import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  videoSrc?: string;
}

export default function VideoBackground({
  videoSrc = "/assets/Jumpindron.mp4"
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video play failed:", error);
      });
    }
  }, [videoSrc]);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        aria-label="Video de fondo de Jump-In"
      >
        <source src={videoSrc} type="video/mp4" />
        {videoSrc === "/assets/Jumpindron.mp4" && (
          <source src="/assets/JumpinDron.mp4" type="video/mp4" />
        )}
      </video>
      <div className="absolute inset-0 z-10 bg-black/50" />
    </div>
  );
}

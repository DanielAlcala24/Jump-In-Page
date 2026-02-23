'use client';

interface VideoBackgroundProps {
  videoSrc?: string;
}

export default function VideoBackground({
  videoSrc = "/assets/Jumpindron.mp4"
}: VideoBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        aria-label="Video de fondo de Jump-In"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-10 bg-black/50" />
    </div>
  );
}

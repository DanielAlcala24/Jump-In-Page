import Image from "next/image";

export default function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/50" />
      <Image
        src="/assets/g1.jpg"
        alt="Fondo de Jump-In"
        fill
        className="object-cover"
        quality={80}
        priority
      />
    </div>
  );
}

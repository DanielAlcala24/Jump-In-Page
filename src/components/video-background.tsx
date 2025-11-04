import Image from 'next/image';

export default function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/50" />
      <Image
        src="/assets/g1.jpg"
        alt="Background image of people jumping in a trampoline park"
        fill
        className="object-cover"
        priority
        quality={80}
        data-ai-hint="trampoline park"
      />
    </div>
  );
}

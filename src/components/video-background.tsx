export default function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/50" />
      <video
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2"
        autoPlay
        loop
        muted
        playsInline
        src="/assets/video-bg-optimized.mp4"
      ></video>
    </div>
  );
}

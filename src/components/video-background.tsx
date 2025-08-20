export default function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/60" />
      <video
        src="https://videos.pexels.com/video-files/8290333/8290333-hd_1920_1080_25fps.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    </div>
  );
}

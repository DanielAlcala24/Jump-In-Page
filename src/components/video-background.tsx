export default function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/60" />
      <video
        src="https://videos.pexels.com/video-files/33536871/14260757_1920_1080_30fps.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    </div>
  );
}

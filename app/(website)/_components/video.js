export function Video() {
  return (
    <video
      className="absolute w-[60%] inset-0 h-full mx-auto object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    >
      <source src="/more (1).mp4" type="video/mp4" />
    </video>
  );
}
export function Video() {
  return (
    <video
      className="absolute inset-0 h-full
       w-[60%] mx-auto object-cover md:w-full"
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
export function Video() {
  return (
    <video
      className="lg:hidden w-full
       h-full object-cover
       brightness-30 absolute top-0 left-0 -z-10"
      autoPlay
      muted
      loop
      playsInline
      preload="none"
    >
      <source src="/Hero Video.mp4" type="video/mp4" />
    </video>
  );
}

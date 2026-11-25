export function Video() {
  return (
    <video
      className="absolute inset-0 h-full w-[50%] mx-auto object-cover bg-[#0B2E1E]"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    >
      <source src="/more.mp4" type="video/mp4" />
    </video>
  );
}
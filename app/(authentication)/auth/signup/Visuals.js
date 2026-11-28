import { Video } from "@/app/(website)/_components/video";

export default function Visuals() {
  return (
    <div
      className="relative h-[60vh]  w-full overflow-hidden
      md:flex md:h-full md:w-1/2 md:items-center md:justify-center"
    >
      {/* Mobile: fills the panel. Desktop: a smaller rounded frame */}
      <div
        className="relative h-full w-full
         md:w-[75%] md:overflow-hidden md:rounded-2xl md:shadow-xl"
      >
        <Video />
      </div>
    </div>
  );
}
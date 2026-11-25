import Link from "next/link";
import { Video } from "./video";

function HomeGrossaryPlus() {
  return (
    <div className="hidden md:flex flex-col lg:flex-row-reverse h-fit lg:h-screen lg:border border-[#dbd5d5]">
      {/* Media Section (right on large screens, top on mobile) */}
      <div className="relative h-[60vh] lg:h-full w-full lg:w-[60%] bg-[#0B2E1E]">
        <Video />
      </div>

      {/* Text Section (left on large screens, bottom on mobile) */}
      <div className="flex flex-col justify-center w-full lg:w-[60%] p-6 lg:p-12 text-[#1a1a1a]">
        <h2 className="font-semibold text-[24px] mb-4">
          Grossary Plus, No more flipping through ClicFlyer
        </h2>
        <p className="mb-4">
          Get personalized recommendations on which store/s to shop at for the
          best prices based on your list, budget, and location.
        </p>
        <Link
          href="/features/grossaryplus"
          className="flex flex-row text-[#A2B06D] underline"
        >
          Learn More &rarr;
        </Link>
      </div>
    </div>
  );
}

export default HomeGrossaryPlus;
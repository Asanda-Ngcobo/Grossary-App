import Link from "next/link";

function HomeGrossaryPlus() {
  return (
    <div className="lg:flex flex-col lg:flex-row-reverse h-fit lg:h-screen lg:border border-1 border-[#dbd5d5]">
      {/* Image Section (appears right on large screens, top on mobile) */}
      <div className="h-[60vh] lg:h-full  bg-[#041527] w-full" />

      {/* Text Section (left on large screens, bottom on mobile) */}
      <div className="flex flex-col justify-center lg:w-[60%] p-6 lg:p-12 text-[#1a1a1a] w-full">
        <h2 className="font-semibold text-[24px] mb-4">
          Grossary Plus, No more flipping through ClicFlyer
        </h2>
        <p className="mb-4">
          Get personalized recommendations on which store(s) to shop at for the best prices based on your list, budget, and location.
        </p>
        <Link href="/grossaryplus" className="text-[#A2B06D] underline">
          <span className="flex flex-row">Learn More &rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export default HomeGrossaryPlus;



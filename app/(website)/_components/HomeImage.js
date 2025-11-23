'use client'
import SignUpButton from "./SignUpButton";
import Link from "next/link";
import { Quicksand } from "next/font/google";
import Image from "next/image";
import HeroPic from '@/public/shopping with phone.jpg'
import { Video } from "./video";

const HeaderFont = Quicksand({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

function HomeImage() {
  return (
    <div className="h-[100vh] text-white relative -mt-20 overflow-hidden">

      {/* Desktop Image */}
      <Image
        src={HeroPic}
        fill
        alt=""
        className="object-cover -z-10 brightness-30 hidden lg:block"
      />

      {/* Mobile Video */}
      <Video />

      {/* Text Content */}
      <div className="flex-col justify-center pt-[75%] lg:pt-[15%]
       relative z-1">
        <div className={`${HeaderFont.className}
         lg:text-[60px] text-[30px] font-bold flex-col justify-center p-0`}>
          <h1 className="text-center">Plan.</h1>
          <h1 className="text-center">Shop.</h1>
          <h1 className="text-center">Save More.</h1>
        </div>

        <div className="text-center w-[90%] mx-[5%] lg:w-[70%] lg:text-xl text-sm lg:mx-[15%]">
          <p>
            Forgetting the small stuff and always asking for void?
            Not with Grossary. Remember every item and stay on budget, every trip.
          </p>
        </div>

        <div className="flex justify-center py-2">
          <Link href='/auth/signup'>
            <SignUpButton>
              <span className="px-10">Get Started</span>
            </SignUpButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeImage;

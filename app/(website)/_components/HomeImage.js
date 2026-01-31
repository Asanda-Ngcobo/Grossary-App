'use client'
import SignUpButton from "./SignUpButton";
import Link from "next/link";
import { Quicksand } from "next/font/google";
import Image from "next/image";
import HeroPic from '@/public/Home image.png'
import { Video } from "./video";
import { Suspense } from "react";
import Loading from "../loading";

const HeaderFont = Quicksand({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

function HomeImage() {
  return (
    <div className="h-[100vh] text-white relative -mt-20 overflow-hidden">
 <Suspense fallback={<Loading/>}>
       {/* Desktop Image */}
      <Image
        src={HeroPic}
        fill
        alt=""
        className="object-cover -z-10 brightness-30  lg:block"
      />

      {/* Mobile Video */}
      {/* <Video /> */}

 </Suspense>
 

      {/* Text Content */}
      <div className="flex flex-row justify-between pt-[100%] lg:pt-[15%]
       relative z-1">
        <div className={`${HeaderFont.className}
         lg:text-[60px] text-[30px] font-bold lg:w-[60%]
         hidden lg:black lg:flex flex-col justify-center p-0`}>
          <h1 className="text-center">Plan.</h1>
          <h1 className="text-center">Shop.</h1>
          <h1 className="text-center">Save More.</h1>
        </div>

        <div className="text-center w-[90%] mx-[5%] lg:w-[25%]  lg:mx-[15%]">
          <p className="lg:text-xl text-lg py-2">
            Forgetting the small stuff and always going budget?
            Not with Grossary. Remember every item and stay on budget, every trip.
          </p>
           <div className="flex justify-center py-7">
          <Link href='/auth/signup'>
            <SignUpButton>
              <span className="px-10">Get Started</span>
            </SignUpButton>
          </Link>
        </div>
        </div>

       
      </div>
    </div>
  );
}

export default HomeImage;

import MainBunner from "./MainBunner";
import SignUpButton from "./SignUpButton";
import Link from "next/link";
import {  Quicksand } from "next/font/google";
import Image from "next/image";
import HeroPic from '@/public/shopping with phone.jpg'

const HeaderFont = Quicksand({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


function HomeImage() {
    return (
       <div className="h-[100vh]  text-white ">
                  <Image src={HeroPic} fill alt="" 
                   className="object-cover -z-10 brightness-30"/>
                   <div className="flex-col justify-center pt-[20%] lg:pt-[5%]">
                    <div className={`${HeaderFont.className}
                    text-[80px] flex-col justify-center
                   p-0 `}>
                      <h1 className="text-center">Plan.</h1>
                      <h1 className="text-center">Shop.</h1>
                      <h1 className="text-center">Save More.</h1>
                      
                      </div>
                      <p className="text-center lg:w-[60%]
                      lg:text-xl lg:mx-[20%] ">Whether you are a student, new graduate adjusting to independence or a parent managing a household, Grossary gives you the tools to make grocery shopping efficient, 
                        affordable, and stress-free.</p>
                        <div className="flex justify-center py-2">
              <Link href='/auth/signup'><SignUpButton><span className="px-10">Get Started</span></SignUpButton></Link>
                        </div>
                 
                   </div>
              </div>
      
    )
}

export default HomeImage

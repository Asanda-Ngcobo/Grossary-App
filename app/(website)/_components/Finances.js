import { Quicksand } from "next/font/google";
import Image from "next/image";
import Spending from '@/public/Spending.png'
import Monthly_Spending from '@/public/Shopped Lists.png'
import SignUpButton from "./SignUpButton";
import Link from "next/link";

const HeaderFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});

export default function Finances() {
    return (
        // Main Container
        <div className="w-full h-[100vh] bg-[#041527] lg:flex justify-center 
        items-center gap-3 ">
            {/* Content Container */}
            <div className="lg:w-[30%]  ">
                <h1 className={`${HeaderFont.className} text-[#ACF532]
            text-center text-2xl lg:text-4xl`}>
                Get A Clear Picture of Your Monthly Grocery Spending.</h1>

   <p className="text-white text-center py-2">We don’t just help you track your spending in real time — we also give you a clear overview of your monthly grocery expenses, 
                        so you can understand your spending habits better.</p>
                        <div className="flex justify-center pt-6">
  <Link href='/auth/signup'><SignUpButton><span className="px-10">Get Started</span></SignUpButton></Link>  
                        </div>
                               
            </div>

            {/* Picture Container */}
                <div className=" py-3 flex gap-4 justify-center">
                    <Image src={Monthly_Spending} alt="Monthly Spending"
                    className=" w-[180px] lg:w-[300px]"/>
                      <Image src={Spending} width={300} alt="Monthly Spending"
                      className="w-[180px] lg:w-[300px]"/>
                 
                </div>
        </div>
    )
}


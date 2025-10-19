import MainBunner from "./MainBunner";
import SignUpButton from "./SignUpButton";
import Link from "next/link";
import {  Quicksand } from "next/font/google";
import { CheckCircle } from "@deemlol/next-icons";
import PrimaryBunner from "./PrimaryBunner";
import PicturesCarousel from "./PicturesCorousel";

const HeaderFont = Quicksand({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


function HomeImage() {
    return (
        <section className="h-fit
         lg:h-[100vh] mb-3">

<PrimaryBunner>
      <MainBunner>   <h1 className={`text-black text-[24px]
       font-extrabold text-left
         pb-2 xl:text-[60px]  ${HeaderFont.className}  `}>
            No more till surprices, no more asking for void.</h1>
            <ul className="py-2 text-black ">
                <h2 className={`${HeaderFont.className} font-semibold`}>Try Grossary
                     </h2>
                     <p>A  simple, all-in-one grocery app that helps you:</p>
                <li className="flex gap-2 py-1"> <CheckCircle color="#A2B06D"/>Create & store your lists </li>
                <li className="flex gap-2 py-1"> <CheckCircle color="#A2B06D"/> Track prices as you shop</li>
                <li className="flex gap-2 py-1"> <CheckCircle color="#A2B06D"/>Staying under budget </li>
                <li className="flex gap-2 py-1"> <CheckCircle color="#A2B06D"/> Reuse old lists to save time</li>
                <p className="py-1"> No more mental math or forgotten items. Just smooth, stress-free grocery shopping.</p>
            </ul>
          

           <Link href='/auth/signup'>
           <SignUpButton><span className="px-10
           ">Get Started</span></SignUpButton></Link></MainBunner>
                
                <PicturesCarousel/>
          
          {/* <div className="flex justify-center">
<Image src={ListImageMobile}  
                 width={370}
                 height={500}
          
          className="  md:hidden bottom-0 py-3 "  alt="List Mock up" />
          
          </div> */}
           
</PrimaryBunner>
        
         
     
    
        </section>
      
    )
}

export default HomeImage

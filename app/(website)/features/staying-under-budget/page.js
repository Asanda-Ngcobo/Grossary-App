import Link from "next/link"
import MainBunner from "../../_components/MainBunner"
import PrimaryBunner from "../../_components/PrimaryBunner"
import SignUpButton from "../../_components/SignUpButton"
import Image from "next/image"
import { Quicksand } from "next/font/google"
import AddingItems from '@/public/Finishing_shopping-removebg-preview.png'


const HeaderFont = Quicksand({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
function page() {
    return (
           <section className="h-[100vh] py-30">

<PrimaryBunner>
      <MainBunner>   <h1 className={`text-[#041527] text-[24px] font-semibold text-left
         pb-2 sm:text-[36px] sm:font-medium ${HeaderFont.className}  `}>
            Set Your Budget & Stick to it</h1>
            <p className="text-[#041527] w-[30%] text-[18px] py-5">Choose your weekly or monthly grocery limit. Grossary can help you stay within your budget without sacrificing essentials.</p>
        
           <Link href='/signup'>
           <SignUpButton><span className="px-10">Get Started</span></SignUpButton></Link>
           </MainBunner>
        
           <Image src={AddingItems}  
                            width={250}
                            height={500}
                     
                     className=" mr-10 hidden md:flex"  alt="List Mock up" />
</PrimaryBunner>
        
         
     
    
        </section>
    )
}

export default page

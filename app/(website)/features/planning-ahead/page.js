import { Quicksand } from "next/font/google";
import MainBunner from "../../_components/MainBunner"
import PrimaryBunner from "../../_components/PrimaryBunner"
import Link from "next/link";
import SignUpButton from "../../_components/SignUpButton";
import Image from "next/image";
import AddingItems from '@/public/adding_items-removebg-preview.png'


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
            Plan Ahead with Lists</h1>
            <p className="text-[#041527] w-[30%] text-[18px] py-5">Add everything you need as you remember, from staples to treats. No more forgetting items or doubling up.</p>
        
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

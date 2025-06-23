
import Image from "next/image"
import BackgroundPhoto from "@/public/women grocery shopping.jpg";
import BackgroundPhotoMobile from "@/public/mother shopping.jpg";
import Link from "next/link";

function ShoppingReimagined() {
    return (
        <div className="grid grid-col justify-center items-center ">
          <div className="w-full ">
            <Image src={BackgroundPhoto} 
            
            alt='a woman grocery shopping'
            className="brightness-50 hidden lg:flex"/>

            <Image src={BackgroundPhotoMobile} 
            
            alt='a woman grocery shopping'
            className="brightness-50 lg:hidden"/>

        </div>
        <div className="absolute w-[80%] ml-[10%] items-center lg:w-[40%] lg:mx-[30%]">
            <h1 className="text-[20px] font-bold mb-8
             text-center text-[#A2B06D]">Re-imagine Grocery Shopping</h1>
             <div className="flex flex-col gap-20 items-center ">
             <p className=" text-white text-[18px] ">Grossary is your no-fuss, no cluster tool for weekly or monthly grocery runs. 
             Whether youre budgeting for one, meal prepping for two, or hosting dinner with friends.</p>
             <Link href='/signup' className="text-[#A2B06D] underline flex items-center">
          Get started &rarr;
        </Link>
             </div>
          
           
        </div>
        </div>
      
        
    )
}

export default ShoppingReimagined

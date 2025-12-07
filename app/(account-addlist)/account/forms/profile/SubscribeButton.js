import { Lexend_Deca } from "next/font/google";
import Link from "next/link";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: "swap",
});

export default function SubscribeButton() {
  return (
    <div  className={`${ButtonFont.className} bg-[#A2B06D]
     min-w-[100px] h-[35px] px-2 rounded-[20px] text-white font-light
      cursor-pointer flex justify-center items-center`}>

       
      
      
     
       
     <Link href="/account/forms/subscribe">Subscribe</Link>
    </div>
  );
}

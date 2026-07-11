import { LogIn, User } from "@deemlol/next-icons";
import { Lexend_Deca } from "next/font/google";



const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});
function SignInButton() {
    return (
        <>
          <button className={`${ButtonFont.className} bg-white
           w-[100px]
         h-[30px] rounded-[15px]
         text-[14px]
         font-semibold
         cursor-pointer
         active:text-[#ACF532]
         hover:text-[#ACF532]
         justify-center items-center
          lg:flex gap-2`}>
            <span>Sign In</span>
            
        </button>

   </>
      
    )
}

export default SignInButton

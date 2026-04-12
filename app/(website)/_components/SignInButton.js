import { User } from "@deemlol/next-icons";
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
         h-[40px] rounded-[20px]
         text-[14px]
         font-semibold
         cursor-pointer
         border-2
         border-[#0B2E1E]
         active:border-[#1EC677]
         hover
         hover:border-gray-400
         justify-center items-center
          lg:flex`}>
            Sign In
            
        </button>

   </>
      
    )
}

export default SignInButton

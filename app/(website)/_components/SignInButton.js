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
         border
         border-gray-300
         hover
         hover:border-gray-400
         justify-center items-center
         hidden lg:flex`}>
            Sign In
            
        </button>

        <button className="lg:hidden h-[40px] w-[40px]
        flex justify-center items-center
        rounded-full bg-white
         border
         border-gray-300
         active:bg-gray-400">
<User/>
        </button></>
      
    )
}

export default SignInButton

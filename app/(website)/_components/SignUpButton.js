'use client'
import { Lexend_Deca } from "next/font/google";



const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});
function SignUpButton({children}) {
    return (
        <button className={`${ButtonFont.className}
         bg-amber-700 min-w-[100px]
       
         h-[40px] rounded-[20px]
         text-gray-900
         cursor-pointer
         font-semibold
         hover
         hover:opacity-60
         `}>
            {children}
        </button>
    )
}

export default SignUpButton

'use client'

import SpinnerMini from "@/app/(website)/_components/SpinnerMini";
import { Lexend_Deca } from "next/font/google";
import { useFormStatus } from "react-dom";



const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});
function SubmitButton({children}) {
    const { pending } = useFormStatus();
    return (
        <button className={`${ButtonFont.className}
         bg-amber-700
        
        w-[90%]
        mx-auto
        mt-10
        lg:w-[60%] lg:ml-[20%]
         h-[50px] rounded-4xl
         text-gray-900
         cursor-pointer
         font-semibold
         hover
         hover:bg-amber-400
         flex justify-center items-center
         text-xl`}
         
         disabled={pending}
         >
            {pending? <SpinnerMini/>  : children}
            
        </button>
    )
}

export default SubmitButton

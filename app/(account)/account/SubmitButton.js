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
        
        w-[60%]
        mx-[20%]
        mt-10
        lg:w-[60%] lg:ml-[20%]
         h-[50px] rounded-[10px]
         text-gray-900
         cursor-pointer
         font-semibold
         hover
         hover:bg-amber-400
         flex justify-center items-center`}
         
         disabled={pending}
         >
            {pending? <SpinnerMini/>  : children}
            
        </button>
    )
}

export default SubmitButton

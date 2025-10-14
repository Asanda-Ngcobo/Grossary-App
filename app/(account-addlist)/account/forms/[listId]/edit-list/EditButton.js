'use client'


import SpinnerMini from "@/app/(website)/_components/SpinnerMini";
import { Lexend_Deca } from "next/font/google";
import { useFormStatus } from "react-dom";



const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});
function EditButton({children}) {
    const { pending } = useFormStatus();
    return (
        <button className={`${ButtonFont.className} bg-[#A2B06D]
        
        w-[60%]
        mx-[20%]
        mt-10
        lg:w-[20%] lg:ml-[35%]
         h-[50px] rounded-[10px]
         text-white
         cursor-pointer
         font-semibold
         hover
         hover:bg-[#6f7a46]`}
         >
            {pending? <SpinnerMini/> : children}
            
        </button>
    )
}

export default EditButton

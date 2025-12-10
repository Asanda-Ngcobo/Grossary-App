'use client'

import { useFormStatus } from 'react-dom'


import { Lexend_Deca } from "next/font/google";
import SpinnerMini from '@/app/(website)/_components/SpinnerMini';


const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

export default function AddItemButton({ children}) {
  const { pending } = useFormStatus()
 

  return (
    <button
      type="submit"
    
      disabled={pending}
    className={`${ButtonFont.className} bg-amber-700
        
        w-[80%]
        mx-[10%]
        mt-[80%]
        lg:w-[30%] lg:ml-[35%] lg:mt-[25%]
         h-[50px] rounded-[10px]
         text-gray-950
         cursor-pointer
         font-semibold
         hover
         hover:bg-amber-500
         flex justify-center items-center`}
    >
      {pending ? <SpinnerMini/> : children}
    </button>
  )
}




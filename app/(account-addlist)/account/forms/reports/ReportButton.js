'use client'

import { useFormStatus } from 'react-dom'


import { Lexend_Deca } from "next/font/google";


const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

export default function ReportButton({ children}) {
  const { pending } = useFormStatus()
 

  return (
    <button
      type="submit"
    
      disabled={pending}
    className={`${ButtonFont.className} bg-[#A2B06D]
        
        w-[80%]
        mx-[10%]
        mt-[10%]
        lg:min-w-[60%] lg:ml-[10%] lg:mt-[25%]
         h-[50px] rounded-[10px]
         text-white
         cursor-pointer
         font-semibold
         hover
         hover:bg-[#6f7a46]`}
    >
      {pending ? 'Sending Your Report...' : children}
    </button>
  )
}




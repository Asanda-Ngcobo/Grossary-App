'use client'
import { Lexend_Deca } from "next/font/google";



const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});
function ListButton({children}) {
    return (
        <button className={`${ButtonFont.className} bg-white min-w-[100px]
       
         h-[25px] rounded-[20px]
         text-black
         cursor-pointer
         font-semibold
         hover
         hover:bg-gray-200`}>
            {children}
        </button>
    )
}

export default ListButton
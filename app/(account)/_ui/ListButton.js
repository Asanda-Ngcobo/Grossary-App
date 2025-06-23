'use client'
import { Lexend_Deca } from "next/font/google";



const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});
function ListButton({children}) {
    return (
        <button className={`${ButtonFont.className} bg-[#A2B06D] min-w-[100px]
       
         h-[25px] rounded-[20px]
         text-white
         cursor-pointer
         font-semibold
         hover
         hover:bg-[#6f7a46]`}>
            {children}
        </button>
    )
}

export default ListButton
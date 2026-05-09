'use client'

import { Check, ChevronLeft } from "@deemlol/next-icons";
import { Lexend_Deca } from 'next/font/google';
import NamesCarousel from "./NamesCorousel"; // fixed typo
import DeleteList from "@/app/(account)/_ui/DeleteList";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

export default function FinishedShoppingBunner() {
  return (
    <div className="w-[90%] mx-auto mt-[5%] bg-white
       text-black rounded-md shadow-lg px-4 py-4 mb-2">
        <div className="flex items-center justify-between mb-4">
    
            <button className="bg-white
            cursor-pointer active:bg-gray-600
             text-black rounded-full w-10 h-10
              flex items-center justify-center"
              >
             
    <ChevronLeft />
  
              
            </button>
      
          <h1 className="text-xs lg:text-xl font-bold text-[#8F8C8C]">Monthly Groceries</h1>
            {/* Right: Buttons */}
      <div className="flex gap-2 items-center w-1/5">
        {/* <EditList id={id} /> */}
        <DeleteList/>
      </div>
        </div>

        <div className="flex lg:text-2xl text-md  justify-between font-bold">
      
          R 562, 89
         
        </div>

      

       <div className="flex flex-col items-center justify-center mt-4 space-y-4">
 
<div className='flex justify-between items-center w-full'>
  <div className='text-sm'>
    { <p>{`14 of 28 to be shopped`}</p>}
  </div>
    </div>
    </div>
    </div>
  );
}



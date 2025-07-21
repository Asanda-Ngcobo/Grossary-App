'use client'

import { Check } from "@deemlol/next-icons";
import { Lexend_Deca } from 'next/font/google';
import NamesCarousel from "./NamesCorousel"; // fixed typo

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

function FinishedShoppingBunner() {
  return (
    <div
      className="
        w-full max-w-[300px] flex flex-col justify-center items-center
        p-2 bg-[#041527] rounded-xl shadow-lg
      "
    >
      <div className="w-10 h-10 flex justify-center
       items-center rounded-full bg-green-500 shadow-md animate-pulse mb-2">
        <Check className="text-white text-md" width={15} />
      </div>

      <div className="text-md font-bold
       text-green-400 animate-bounce text-center leading-tight">
        Well Done
        <div className="mt-1">
          <NamesCarousel />
        </div>
        
      </div>

      <p className="text-xs text-center text-white mt-2">
        Your shopping is done and you managed to stay&nbsp;
        <span className="font-bold text-green-300">11.7%</span> under budget. 🎉😊
      </p>

      <div className={`${ButtonFont.className} gap-2 mt-4 hidden sm:grid`}>
        <button
          className="h-8 w-[200px] px-2 bg-[#A2B06D] 
          rounded-lg text-[#04284B] font-semibold 
          
          transition-colors text-xs"
        >
          View Virtual Slip
        </button>

        <button
          className="h-8 w-[200px] px-2 rounded-lg 
          border border-[#04284B] bg-transparent 
          text-gray-400 font-semibold 
          transition-all text-xs"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default FinishedShoppingBunner;

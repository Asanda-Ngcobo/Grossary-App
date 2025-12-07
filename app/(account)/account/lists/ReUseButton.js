'use client'

import { useFormStatus } from "react-dom";
import { RotateCcw } from "@deemlol/next-icons";
import { Lexend_Deca } from "next/font/google";
import SpinnerMini from "@/app/(website)/_components/SpinnerMini";

const ButtonFont = Lexend_Deca({ subsets: ["latin"], display: 'swap' });

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${ButtonFont.className}
        bg-amber-700 min-w-[100px]
      flex justify-center items-center
       active:bg-gray-600
         h-[30px] rounded-[10px]
         text-gray-500
         cursor-pointer
         font-bold
         hover
         hover:bg-[#6f7a46]
         py-1`}
    >
      {pending ? <span className="flex justify-center items-center"><SpinnerMini/></span> : (
        <span className="text-md flex justify-center gap-2">
          Reuse <RotateCcw size={20} />
        </span>
      )}
    </button>
  );
}

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
       bg-[#A2B06D] min-w-[100px] h-[40px] rounded-[5px] text-white font-semibold hover:bg-[#6f7a46]`}
    >
      {pending ? <span className="flex justify-center items-center"><SpinnerMini/></span> : (
        <span className="text-md flex justify-center gap-2">
          Reuse <RotateCcw size={20} />
        </span>
      )}
    </button>
  );
}

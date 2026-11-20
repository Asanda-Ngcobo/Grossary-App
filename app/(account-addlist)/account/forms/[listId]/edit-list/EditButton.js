'use client';

import SpinnerMini from "@/app/(website)/_components/SpinnerMini";
import { Lexend_Deca } from "next/font/google";
import { useFormStatus } from "react-dom";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

function EditButton({ children, className = "", disabled = false, ...props }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-busy={pending}
      className={`
        ${ButtonFont.className}
        mx-auto mt-10 flex h-[50px] w-full items-center justify-center
        rounded-[10px] bg-[#1EC677] px-3 py-1
        font-semibold text-white
        transition-all duration-150
        cursor-pointer
        hover:bg-[#0B2E1E]
        active:scale-[0.98]
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-[#0B2E1E]
        disabled:cursor-not-allowed disabled:opacity-60
        disabled:hover:bg-[#1EC677] disabled:active:scale-100
        lg:w-auto lg:min-w-[220px]
        ${className}
      `}
      {...props}
    >
      {pending ? (
        <>
          <SpinnerMini />
          <span className="sr-only">Saving, please wait</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default EditButton;

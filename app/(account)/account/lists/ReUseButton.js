'use client'

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { RotateCcw } from "@deemlol/next-icons";
import { Lexend_Deca } from "next/font/google";
import { useForm } from "@/app/providers/Provider";
import AccountModal from "../../_ui/AccountModal";
import Spinner from "@/app/(website)/_components/Spinner";

const ButtonFont = Lexend_Deca({ subsets: ["latin"], display: 'swap' });

export function SubmitButton() {
  const { pending } = useFormStatus();
  const { active, setActive } = useForm();

  // track previous pending state
  const wasPending = useRef(false);

  useEffect(() => {
    // when submission finishes
    if (wasPending.current && !pending) {
      setActive(act => !act); // ✅ reuse completed → deactivate
    }
    wasPending.current = pending;
  }, [pending, setActive]);

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${ButtonFont.className}
        bg-amber-700 min-w-[100px]
        flex justify-center items-center
        h-[30px] rounded-[10px]
        text-gray-900
        cursor-pointer
        font-bold
        hover:bg-[#6f7a46]
        py-1
      `}
    >
      {pending ? (
        <AccountModal>
          <div className="fixed inset-0 flex justify-center items-center">
            <div className="w-[70%] max-w-sm rounded-2xl
             bg-gray-950 flex-col justify-center items-center p-6">
              <Spinner />
              <p>Recreating your list...</p>
            </div>
          </div>
        </AccountModal>
      ) : (
        <span className="text-md flex items-center gap-2">
          Reuse <RotateCcw size={20} />
        </span>
      )}
    </button>
  );
}

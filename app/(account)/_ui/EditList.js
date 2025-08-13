'use client'

import { Edit } from "@deemlol/next-icons";
import { Lexend_Deca } from "next/font/google";
import Link from "next/link";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

function EditList({id}) {

  
  return (
    <Link href={`/account/forms/${id}`} className={`${ButtonFont.className}group
      bg-[#A2B06D] min-w-[100px]
      flex justify-center items-center
       active:bg-gray-600
         h-auto rounded-[5px]
         text-white
         cursor-pointer
         font-semibold
         hover
         hover:bg-[#6f7a46]
         py-1`}>
     
      Edit/Shop
    </Link>
  );
}

export default EditList;
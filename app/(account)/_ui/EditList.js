'use client'

import { Edit } from "@deemlol/next-icons";
import Link from "next/link";



function EditList({id}) {

  
  return (
    <Link href={`/account/forms/${id}`} className='group
     flex  gap-2 uppercase text-xs font-bold
      text-primary-300 flex-grow px-3 hover:bg-accent-600
       transition-colors hover:text-primary-900
       text-[#A2B06D] active:text-gray-600'>
      <Edit className='h-5 w-5 
      text-primary-600 group-hover:text-primary-800 transition-colors' />
      <span className='mt-1'>Edit</span>
    </Link>
  );
}

export default EditList;
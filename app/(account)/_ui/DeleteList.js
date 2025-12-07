'use client'

import { useTransition } from 'react';
import SpinnerMini from '@/app/(website)/_components/SpinnerMini';
import { Trash2 } from '@deemlol/next-icons';

function DeleteList({handleModal}) {

  return (
    <button onClick={handleModal} className='group
     flex justify-center items-center 
     h-[40px] w-[40px] bg-gray-600
     rounded-full
       gap-2 uppercase text-xs cursor-pointer
      font-bold text-gray-500 flex-grow px-3 
      hover:bg-accent-600 transition-colors hover:text-primary-900'>
    <Trash2 className=' 
      absolute
      '  />
      
    </button>
  );
}

export default DeleteList;
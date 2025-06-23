'use client'

import { useTransition } from 'react';
import SpinnerMini from '@/app/(website)/_components/SpinnerMini';
import { Trash2 } from '@deemlol/next-icons';

function DeleteList({handleModal}) {

  return (
    <button onClick={handleModal} className='group
     flex  gap-2 uppercase text-xs cursor-pointer
      font-bold text-gray-500 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900'>
    <Trash2 className='h-5 w-5 
      text-primary-600 group-hover:text-primary-800 
      transition-colors' />
      <span className='mt-1'>Delete</span>
    </button>
  );
}

export default DeleteList;
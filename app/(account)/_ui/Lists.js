'use client'
import List from '@/app/(account)/_ui/List'
import { deleteList } from '@/app/_lib/actions';
import { useOptimistic, useState } from 'react';

import { useForm } from '@/app/providers/Provider';
import { ArrowLeft, ArrowRight, Plus } from '@deemlol/next-icons';
import Link from 'next/link';
import HistoryClient from '../account/HistoryClient';


function Lists({myLists, userId}) {
     const { toggleForm, active} = useForm();
    //Active Lists
         const activeList = myLists.filter((list)=>
list.money_spent === 0 || list.money_spent === null)
         
         //shopped Lists

            const History = myLists.filter((list)=>
list.money_spent > 0 )

            const topHistory = History.slice(0, 3)

            //Delete Ui

       const [optimisticLists, optimisticDelete] = useOptimistic(activeList,
         (currentLists, listId)=>{
return currentLists.filter((list)=>
    list.id !== listId)
    });
    async  function handleDelete(listId){
        optimisticDelete(listId)
await deleteList(listId)
    }
 
    return (
        <div className='w-[90%] mx-[5%] '>
         
           
           {!active &&     <ul className=''>

               {activeList.length === 0 && myLists.length > 0 &&  <p className='lg:w-[80%] mx-[10%]'>You have no <span className="font-bold">
                 active lists</span> currently. Start adding your list by clicking 
                            button
                             below or  Reuse your Shopped Lists.
                            </p>} 

                                {activeList.length === 0 && myLists.length === 0 &&  <p className='lg:w-[80%] mx-[10%]'>You have no <span className="font-bold">
                 active lists</span> currently. Start adding your list by clicking 
                            button
                             below.
                            </p>} 
        
        
          
            {optimisticLists.map(function(list){
                return <List key={list.id} list={list}
                onDelete={handleDelete}/>
            })}
        </ul>}

          {active && 
          <div className='max-h-[400px] md:max-h-[500px] overflow-y-auto'>
            {History.length > 3  && (
              
              <Link href='/account/lists/history' alt='' className='ml-[70%] lg:hidden'>
                <button className='text-sm cursor-pointer underline text-gray-500'>
                Show more 
              </button>
                </Link>
            )}
            <HistoryClient
          topHistory={topHistory}
          History={History}
          userId={userId}/>
            </div>}
          
          {!active && (
            <div className='bottom-1 right-2 fixed '>
            <button className="flex 
                            justify-center items-center 
                            mx-3
                            w-[40px]
                            h-[40px]
                            rounded-full
                            bg-amber-700 
                            text-gray-500
                            cursor-pointer
                            my-6" onClick={toggleForm}>
                            <Plus></Plus></button>
          </div>
       
          )}
        </div>
      
        
    )
}

export default Lists

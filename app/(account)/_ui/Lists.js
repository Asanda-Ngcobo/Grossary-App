'use client'
import List from '@/app/(account)/_ui/List'
import { deleteList } from '@/app/_lib/actions';
import { useOptimistic, useState } from 'react';
import HistoryClient from '../account/lists/HistoryClient';
import { useForm } from '@/app/providers/Provider';
import { Plus } from '@deemlol/next-icons';


function Lists({myLists, userId}) {
     const { toggleForm, active} = useForm();
    //Active Lists
         const activeList = myLists.filter((list)=>
list.money_spent === 0 || list.money_spent === null)
         
         //shopped Lists

            const History = myLists.filter((list)=>
list.money_spent > 0 )

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

               {activeList === 0 && <p className='lg:w-[80%] mx-[10%]'>You have no <span className="font-bold"> active lists</span> currently. Start adding your list by clicking 
                            <span className="italic mx-1 text-[#ACF532]"> Add New List</span> 
                             below or <span className="italic  mx-1 text-[#ACF532]"> Reuse your Shopped Lists</span> .
                            </p>} 
        
          
            {optimisticLists.map(function(list){
                return <List key={list.id} list={list}
                onDelete={handleDelete}/>
            })}
        </ul>}
          {active && <HistoryClient
          History={History}
          userId={userId}/>}
          
          <div className='bottom-1 right-2 fixed '>
            <button className="flex 
                            justify-center items-center 
                            mx-3
                            w-[40px]
                            h-[40px]
                            rounded-full
                            bg-amber-700 
                            text-gray-500
                            my-6" onClick={toggleForm}>
                            <Plus></Plus></button>
          </div>
       
        </div>
      
        
    )
}

export default Lists

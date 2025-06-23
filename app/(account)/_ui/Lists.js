'use client'
import List from '@/app/(account)/_ui/List'
import { deleteList } from '@/app/_lib/actions';
import { useOptimistic } from 'react';
import DeleteForm from '../account/lists/DeleteForm';

function Lists({myLists}) {
  
       const [optimisticLists, optimisticDelete] = useOptimistic(myLists,
         (currentLists, listId)=>{
return currentLists.filter((list)=>
    list.id !== listId)
    });
    async  function handleDelete(listId){
        optimisticDelete(listId)
await deleteList(listId)
    }
    return (
        <div>
              <ul className=''>
            {optimisticLists.map(function(list){
                return <List key={list.id} list={list}
                onDelete={handleDelete}/>
            })}
        </ul>
        
        </div>
      
        
    )
}

export default Lists

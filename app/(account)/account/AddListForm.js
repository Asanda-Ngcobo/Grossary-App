'use client'

import { createList } from "@/app/_lib/actions"
import SubmitButton from "./SubmitButton"

export default function AddListForm() {
    return (
         <form action={createList} className="py-2 px-4 rounded-md w-[90%] mt-[5%]
  ml-[5%] md:w-[50%] md:ml-[25%] grid grid-rows-2 gap-2 
   shadow-sm">
       
      <label htmlFor="list_name" className=" text-2xl">List Name</label>
                    <input
                    id="list_name"
                    name="list_name"
                    type="text"
                  
              
                    required
                    
className="bg-white text-black text-2xl p-3 rounded-md"
                    
                    />

 

      <label htmlFor="list_budget" className=" text-2xl">Budget (R)</label>
                    <input
                    id="list_budget"
                    name="list_budget"
                    type="number"
                   
                    required
                    placeholder="e.g.,1000"
                    
className="bg-white text-black text-2xl p-3 rounded-md"
                    
                    />

 
   
   <SubmitButton >Create List</SubmitButton>
                  
                </form>
    )
}



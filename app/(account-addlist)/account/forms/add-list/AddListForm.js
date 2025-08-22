
import { ChevronLeft } from "@deemlol/next-icons"
import Link from "next/link"


import { createList } from "@/app/_lib/actions"
import SubmitButton from "../SubmitButton"

function AddListForm() {
    return (
         <main>
              <div className="my-5 mx-[5%] bg-white active:bg-gray-600 rounded-full w-[50px] h-[50px] flex justify-center items-center"> 
            <Link href='/account'><ChevronLeft color="black" size={40}/></Link> </div>
            <section>
                     
                <form action={createList} className="py-2 px-4 rounded-md w-[90%] mt-[5%]
  ml-[5%] md:w-[40%] md:ml-[25%] grid grid-rows-2 gap-2 bg-[#041527]
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
        
            </section>
        </main>
    )
}

export default AddListForm

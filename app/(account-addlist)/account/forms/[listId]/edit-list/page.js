

import Spinner from "@/app/(website)/_components/Spinner";
import { updateList } from "@/app/_lib/actions";
import { getList } from "@/app/_lib/data-services";
import { ChevronLeft } from "@deemlol/next-icons";
import Link from "next/link";
import EditButton from "./EditButton";



export default async function EditListPage({ params }) {
  const { listId } = await params
  const list = await getList(listId)

  if (!list) {
    return <div className="p-6"><Spinner/></div>
  }

  async function handleUpdate(formData) {
    'use server'
    await updateList(listId, formData)
    redirect(`/account/lists/${listId}`)
  }

  return (
    <main>
     <button className="my-5 mx-[5%] bg-white active:bg-gray-600 rounded-full w-[50px] h-[50px] flex justify-center items-center"> 
            <Link href={`/account/forms/${listId}`}><ChevronLeft color="black" size={40}/></Link> </button>
    <div  className="py-2 px-4 rounded-md w-[90%] mt-[5%]
  ml-[5%] md:w-[40%] md:ml-[25%] grid grid-rows-2 gap-2 bg-[#041527]
   shadow-sm">
      
      <form action={handleUpdate} className="space-y-4">
        <div>
          <label htmlFor="name" className=" text-2xl">List Name</label>
          <input
            type="text"
            id="list_name"
            name="list_name"
            defaultValue={list.list_name ?? ''}
            required
       className="bg-white text-[#041527] text-2xl p-3 rounded-md w-full"
              
          />
        </div>

        <div>
          <label htmlFor="name" className=" text-2xl">Budget (Rands)</label>
          <input
            type="number"
            id="list_budget"
            name="list_budget"
            step="0.01"
            defaultValue={list.list_budget ?? ''}
            required
               className="bg-white text-[#041527] text-2xl p-3 rounded-md w-full"
          />
        </div>

     <EditButton>Save Changes</EditButton>
      </form>
    </div>
    </main>
  )
}
 


import { getLists } from "@/app/_lib/data-services"
import Link from "next/link"
import Lists from '@/app/(account)/_ui/Lists'
import { Suspense } from "react"


import { createClient } from "@/app/_utils/supabase/server"
import Loading from "./loading"

export const metadata = {
  title: "Lists | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};
async function page() {

     const supabase = await createClient()
      const { data, error } = await supabase.auth.getUser()
     
    
    // Get additional profile info
     // Get additional profile info
      const { data: profile } = await supabase
        .from('users_info')
        .select('*')
        .eq('id', data.user.id)
        .single();
       


    const myLists = await getLists(profile.id)
      const activeList = myLists.filter((list)=>
list.money_spent === 0 || list.money_spent === null)




    return (

        <>
        
             <div className="w-[90%] ml-[5%] lg:w-[60%] lg:mx-[20%] lg:mt-20 mt-40 ">
            
            
            {activeList.length === 0 ? (
                
                <p>You have no <span className="font-bold"> active lists</span> currently. Start adding your list by clicking 
                <span className="italic"> Add New List</span> 
                below or reuse your old lists.
                <Link href='/account/forms/add-list'>   <span className="flex 
                justify-between items-center 
                mx-3
                text-[#A2B06D]">
                &#43; New List</span></Link></p>
            ): (
                <Suspense fallback={<Loading/>}>
<Lists myLists={activeList}/>
                </Suspense>
                
            )}
           
        </div>
        
            </>
       
    )
}

export default page

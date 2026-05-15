
import { getLists } from "@/app/_lib/data-services"
import Link from "next/link"
import Lists from '@/app/(account)/_ui/Lists'
import { Suspense } from "react"


import { createClient } from "@/app/_utils/supabase/server"
import Loading from "./loading"
import ListNavigation from "./ListsNav"
import { ChevronLeft } from "@deemlol/next-icons"


export const metadata = {
  title: "Lists | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};
async function page() {

     const supabase = await createClient()
      const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
          redirect('/auth/login')
        }
     
    
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

      console.log(activeList)

const { data:allItemsRaw, error:AllItemsError } = await supabase
  .from("list_items")
  .select(`
    *,
    user_lists!inner(user_id)
  `)
  .eq("user_lists.user_id", profile.id);

  // Only include items that belong to this user
  const allItems = (allItemsRaw || []).filter(
    (item) => item.user_lists?.user_id === profile.id
  );

  console.log(allItems)

    return (

        <>
        
             <div className="w-[90%] mx-auto
              lg:w-[60%] lg:mx-[20%] lg:mt-20 mt-15 ">
                
       

         <ListNavigation/>
            
            {activeList.length === 0 ? (
                
                <p>You have no <span className="font-bold"> active lists</span> currently. Start adding your list by clicking 
                <span className="italic mx-1 text-[#ACF532]"> Add New List</span> 
                 below or <span className="italic  mx-1 text-[#ACF532]"> Reuse your Shopped Lists</span> .
                <Link href='/account/forms/add-list'>   <span className="flex 
                justify-between items-center 
                mx-3
                text-[#A2B06D] 
                my-6">
                &#43; New List</span></Link></p>
            ): (
                <Suspense fallback={<Loading/>}>
<Lists myLists={myLists} allItems={allItems}
userId={profile.id}/>
                </Suspense>
                
            )}
           
        </div>
        
            </>
       
    )
}

export default page

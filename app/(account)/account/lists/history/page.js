
import { getLists, getOldLists } from "@/app/_lib/data-services"
import HistoryClient from "../HistoryClient"
import { Suspense } from "react"
import { createClient } from "@/app/_utils/supabase/server"
import Loading from "../../loading"

import { ChevronLeft } from "@deemlol/next-icons"
import Link from "next/link"

export const metadata = {
  title: "History | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};
async function page() {
     const supabase = await createClient()
         const { data, error } = await supabase.auth.getUser()
         if (error || !data?.user) {
           redirect('/login')
         }
       
       // Get additional profile info
        // Get additional profile info
         const { data: profile } = await supabase
           .from('users_info')
           .select('*')
           .eq('id', data.user.id)
           .single();
    const myLists = await getOldLists(profile.id)
    
   const History = myLists.filter((list)=>
list.money_spent > 0 )
   

// Group history items by "Month Year"




    return (
      <div className="w-[90%] ml-[5%] lg:w-[80%] lg:ml-[5%] mt-5">
        
         <button className="bg-white
            cursor-pointer active:bg-gray-600
             text-black rounded-full w-10 h-10
              flex items-center justify-center"
              >
                <Link href={`/account`}>
    <ChevronLeft />
      </Link>
              
            </button>
             <Suspense fallback={<Loading/>}>
        
 <HistoryClient 
            userId={profile.id}
            History={History}/>
      </Suspense>
      </div>
     
      
    )
}

export default page
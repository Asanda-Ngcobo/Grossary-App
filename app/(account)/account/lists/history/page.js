
import { getLists } from "@/app/_lib/data-services"
import HistoryClient from "./HistoryClient"
import { Suspense } from "react"
import { createClient } from "@/app/_utils/supabase/server"
import Loading from "../../loading"


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
    const myLists = await getLists(profile.id)
    
   const History = myLists.filter((list)=>
list.money_spent > 0 )
   

// Group history items by "Month Year"




    return (
      <Suspense fallback={<Loading/>}>
 <HistoryClient 
            userId={profile.id}
            History={History}/>
      </Suspense>
      
    )
}

export default page
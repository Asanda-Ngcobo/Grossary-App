
import { getLists } from "@/app/_lib/data-services"
import HistoryClient from "./HistoryClient"
import { Suspense } from "react"
import Spinner from "@/app/(website)/_components/Spinner"
import { createClient } from "@/app/_utils/supabase/server"

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
      <Suspense fallback={<Spinner/>}>
 <HistoryClient 
            userId={profile.id}
            History={History}/>
      </Suspense>
      
    )
}

export default page
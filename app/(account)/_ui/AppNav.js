
import { supabaseServer } from "@/app/_lib/supabase-server";
import AppNavLinks from "./AppNavLinks";
import { getLists } from "@/app/_lib/data-services";

import { createClient } from "@/app/_utils/supabase/server";






export default async function AppNavigation() {
   const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()


// Get additional profile info
 // Get additional profile info
  const { data: profile } = await supabase
    .from('users_info')
    .select('*')
    .eq('id', data.user.id)
    .single();

     
      const userLists = await getLists(profile.id);
       const activeList = userLists.filter((list)=>
list.money_spent === 0 || list.money_spent === null)
   
  return (
    <div className="fixed bottom-0 bg-[#011931] w-full 
     h-[80px]
     lg:flex
         lg:bg-white  lg:w-[20%] lg:left-0 lg:h-screen lg:bottom-auto
            lg:flex-col lg:justify-start">
 <AppNavLinks userLists={activeList}/>

    </div>
   
  )
 
}


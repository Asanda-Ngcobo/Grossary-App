
import { supabaseServer } from "@/app/_lib/supabase-server";
import AppNavLinks from "./AppNavLinks";
import { getLists } from "@/app/_lib/data-services";

import { createClient } from "@/app/_utils/supabase/server";
import DashNavLinks from "./DashboardNavLinks";






export default async function DashboardNavigation() {

   
  return (
    <div className="fixed bottom-0 bg-[#011931] w-full hidden
     h-[110px]
     lg:flex
         lg:bg-white  lg:w-[20%] lg:left-0 lg:h-screen lg:bottom-auto
            lg:flex-col lg:justify-start">
 <DashNavLinks />

    </div>
   
  )
 
}


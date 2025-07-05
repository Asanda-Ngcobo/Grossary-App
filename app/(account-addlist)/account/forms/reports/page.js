import { createClient } from "@/app/_utils/supabase/server"
import ReportsClient from "./reportsClient";
import { getList } from "@/app/_lib/data-services";


async function reports({params}) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
 
    const { data: profile } = await supabase
    .from('users_info')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
     
    return (
      <ReportsClient profile={profile}
      />
    )
}

export default reports



import { getList, getListsItemsById } from "@/app/_lib/data-services";

import PageClient from "./PageClient";
import { Suspense } from "react";
import Loading from "./loading";
import { createClient } from "@/app/_utils/supabase/server";




export default async function Page({ params }) {
  const {listId} = await params
  const list = await getList(listId);
  const listitems = await getListsItemsById(listId);
  const supabase = await createClient()
 const { data, error } = await supabase.auth.getUser()
 

// Get additional profile info

  const { data: profile } = await supabase
    .from('users_info')
    .select('*')
    .eq('id', data.user.id)
    .single();
   

  if (!list) return <div>List not found</div>;

  const { list_name, list_budget, id } = list;
 
  

 function groupItemsByCategory(items) {
  return items.reduce((acc, item) => {
    const cat = item.item_category || 'uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
}


  


     
  return (
    <main>
 <Suspense fallback={<Loading/>}>
<PageClient listId={id} list_name={list_name}
list_budget={list_budget}
 groupedItems={groupItemsByCategory(listitems)}
 listitems={listitems} 
 profile={profile}/>

 </Suspense>

    </main>
  );
}

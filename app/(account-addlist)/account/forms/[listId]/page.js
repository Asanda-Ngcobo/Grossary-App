

import { getList, getListsItemsById } from "@/app/_lib/data-services";

import PageClient from "./add-price/PageClient";
import { Suspense } from "react";
import ListAnimation from "@/app/(account)/_ui/ListAnimation";



export default async function Page({ params }) {
  const {listId} = await params
  const list = await getList(listId);
  const listitems = await getListsItemsById(listId);

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
 <Suspense fallback={<ListAnimation/>}>
<PageClient listId={id} list_name={list_name}
list_budget={list_budget}
 groupedItems={groupItemsByCategory(listitems)}
 listitems={listitems} />

 </Suspense>

    </main>
  );
}

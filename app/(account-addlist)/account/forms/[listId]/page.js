import { getList, getListsItemsById } from "@/app/_lib/data-services";
import PageClient from "./PageClient";
import { createClient } from "@/app/_utils/supabase/server";

export const metadata = {
  title: "List | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};
export default async function Page({ params }) {
  const { listId } = await params;

  // Fetch data on the server
  const list = await getList(listId);
  const listitems = await getListsItemsById(listId);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!list) return <div>List not found</div>;

  const { data: profile } = await supabase
    .from("users_info")
    .select("*")
    .eq("id", data?.user?.id)
    .single();

  const { list_name, list_budget, id } = list;

  function groupItemsByCategory(items) {
    return items.reduce((acc, item) => {
      const cat = item.item_category || "uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }

  return (
    <main>
    
      <PageClient
        listId={id}
        list_name={list_name}
        list_budget={list_budget}
        groupedItems={groupItemsByCategory(listitems)}
        listitems={listitems}
        profile={profile}
      />
    </main>
  );
}

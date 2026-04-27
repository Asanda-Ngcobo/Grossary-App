import { redirect } from "next/navigation";
import { createClient } from "@/app/_utils/supabase/server";
import { getLists, getListsItemsById } from "@/app/_lib/data-services";
import Home from "./Home";

export const metadata = {
  title: "Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};

export default async function Page() {
  const supabase = await createClient();
  
  //Oauth

  const { data, error } = await supabase.auth.getClaims()
 if (error || !data?.claims) {
  redirect('/login')
 }

  //Email & Password
  // Get user
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) redirect("/login");

  const userId = authData.user.id || data.user.id;

  // Get profile
  const { data: profile } = await supabase
    .from("users_info")
    .select("*")
    .eq("id", userId)
    .single();


  // Get user's lists
  const myLists = await getLists(userId);



  // Get all items with prices and related list user_id
  const { data:allItemsRaw, error:AllItemsError } = await supabase
  .from("list_items")
  .select(`
    *,
    user_lists!inner(user_id)
  `)
  .eq("user_lists.user_id", userId);

  // Only include items that belong to this user
  const allItems = (allItemsRaw || []).filter(
    (item) => item.user_lists?.user_id === userId
  );


 

  return (
    <div className="w-full min-h-full">
      <Home profile={profile}
      data={data} myLists={myLists} 
      allItems={allItems} />
    </div>
  );
}

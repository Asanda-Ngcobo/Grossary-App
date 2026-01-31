import { redirect } from "next/navigation";
import { createClient } from "@/app/_utils/supabase/server";
import { getLists } from "@/app/_lib/data-services";
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

  const userId = authData.user.id;

  // Get profile
  const { data: profile } = await supabase
    .from("users_info")
    .select("*")
    .eq("id", userId)
    .single();


  // Get user's lists
  const myLists = await getLists(userId);

  // Get all items with prices and related list user_id
  const { data: allItemsRaw } = await supabase
    .from("list_items")
    .select(
      "id, total_price, item_category, shopped_at, list_id, user_lists(user_id)"
    )
    .not("total_price", "is", null);

  // Only include items that belong to this user
  const allItems = (allItemsRaw || []).filter(
    (item) => item.user_lists?.user_id === userId
  );

  return (
    <div className="w-screen min-h-screen lg:w-[60%] lg:mx-[20%]">
      <Home profile={profile}
      data={data} myLists={myLists} allItems={allItems} />
    </div>
  );
}

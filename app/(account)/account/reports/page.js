import { createClient } from "@/app/_utils/supabase/server";
import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";

import Reports from "./Reports";
import { getLists } from "@/app/_lib/data-services";

export const metadata = {
  title: "Reports | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};

async function page() {
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
  
       //Email & Password
  const firstName =
    profile?.fullName?.split(" ")[0]?.[0]?.toUpperCase() +
    profile?.fullName?.split(" ")[0]?.slice(1)?.toLowerCase();
    const nameParts = profile?.fullName
  ?.trim()
  ?.split(/\s+/) // handles multiple spaces
  .filter(Boolean) || [];

//Google auth
   const {email} = data?.claims;

   const Name = email
  ? email
      .split('@')[0]
      .split(/[._]/)[0]
      .replace(/\d+/g, '')
      .replace(/\b\w/g, c => c.toUpperCase())
  : 'User'

  const userName  = firstName || Name;
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
    <Suspense fallback={<Loading />}>
   
    
      <Reports allLists={myLists || []} allItems={allItems}
      userName={firstName || Name}  />
    </Suspense>
  );
}

export default page;

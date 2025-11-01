// app/components/AppNavigation.jsx
import { getLists } from "@/app/_lib/data-services";
import { createClient } from "@/app/_utils/supabase/server";
import AppNavLinks from "./AppNavLinks";

export default async function AppNavigation() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Failed to fetch authenticated user:", userError);
    return null;
  }

  // Fetch additional profile info
  const { data: profile, error: profileError } = await supabase
    .from("users_info")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Failed to fetch user profile:", profileError);
    return null;
  }

  // Fetch user lists
  const userLists = await getLists(profile.id);

  // Filter only active lists (unspent or empty)
  const activeLists = userLists?.filter(
    (list) => list.money_spent === 0 || list.money_spent === null
  );

  return (
    <div
      className="fixed bottom-0 bg-[#011931] w-full 
        h-[80px]
      border border-[#04284B] flex justify-center items-center
      lg:bg-[#04284B] lg:rounded-none
       lg:w-[20%] lg:mx-0 lg:h-screen 
       lg:bottom-auto lg:flex-col
        lg:justify-start"
    >
      <AppNavLinks userLists={activeLists} />
    </div>
  );
}


import { createClient } from "@/app/_utils/supabase/server";
import { Suspense } from "react";
import Loading from "../loading";

import { redirect } from "next/navigation";
import ReportsWrapper from "../../_ui/ReportWrapper";

export const metadata = {
  title: "Profile | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};

async function page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users_info")
    .select("*")
    .eq("id", data.user.id)
    .single();

  // ✅ fetch all lists
  const { data: allLists } = await supabase
    .from("user_lists")
    .select("id, money_spent, money_left, list_budget, created_at")
    .eq("user_id", profile.id);

  // ✅ fetch items joined with their list to filter by user_id
  const { data: allItems } = await supabase
    .from("list_items")
    .select("id, total_price, item_category, shopped_at, list_id, user_lists(user_id)")
    .not("total_price", "is", null);

  // filter items to only this user's lists
  const userItems = (allItems || []).filter(
    (item) => item.user_lists?.user_id === profile.id
  );

  return (
    <Suspense fallback={<Loading />}>
      <ReportsWrapper allLists={allLists || []} allItems={userItems} />
    </Suspense>
  );
}

export default page;

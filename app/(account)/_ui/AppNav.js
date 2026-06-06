import { getLists } from "@/app/_lib/data-services";
import { createClient } from "@/app/_utils/supabase/server";
import AppNavLinks from "./AppNavLinks";

export default async function AppNavigation() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guest user
  if (!user) {
    return (
      <div
        className="fixed bottom-0 bg-white w-full
        h-[80px]
        flex justify-center items-center
        md:hidden
        lg:w-[20%] lg:mx-0 lg:h-screen
        lg:bottom-auto lg:flex-col
        lg:justify-start"
      >
        <AppNavLinks userLists={[]} />
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("users_info")
    .select("*")
    .eq("id", user.id)
    .single();

  const myLists = profile?.id ? await getLists(profile.id) : [];

  const activeList = myLists.filter(
    (list) => list.money_spent === 0 || list.money_spent === null
  );

  return (
    <div
      className="fixed bottom-0 bg-white w-full
      h-[80px]
      flex justify-center items-center
      md:hidden
      lg:w-[20%] lg:mx-0 lg:h-screen
      lg:bottom-auto lg:flex-col
      lg:justify-start"
    >
      <AppNavLinks userLists={activeList}
      profile={profile} />
    </div>
  );
}
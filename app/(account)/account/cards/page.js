


import Link from "next/link";
import { createClient } from "@/app/_utils/supabase/server";


import { getCards } from "@/app/_lib/data-services";
import CardList from '../CardList'
import AddCardClient from '../AddCardClient';

import { Check, ChevronLeft, Edit, Edit2, Plus, ShoppingCart } from '@deemlol/next-icons';

export default async function CardsPage() {
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

    console.log('userId:', profile.id)
    const cards = await getCards(userId);
 
    
  // ... rest unchanged

  return (
    <div className="p-4 max-w-md mx-auto">
      <div clasName='flex flex-row justify-between w-full'> 
        <div><button className="bg-white
                  cursor-pointer active:bg-gray-600
                   text-black rounded-full w-10 h-10
                    flex items-center justify-center"
                    >
                      <Link href={`/account`}>
          <ChevronLeft />
            </Link>
                    
                  </button></div>
         <div>                  <h1 className="text-xl font-bold my-4">My Cards</h1></div>
</div>

      {/* Add Card */}
  
     <AddCardClient/>
      {/* Card List */}
    <CardList cards={cards}/>
    </div>
  );
}
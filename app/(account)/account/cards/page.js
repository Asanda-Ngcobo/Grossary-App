



import { createClient } from "@/app/_utils/supabase/server";


import { getCards } from "@/app/_lib/data-services";

import { Check, ChevronLeft, Edit, Edit2, Plus, ShoppingCart } from '@deemlol/next-icons';
import CardsClient from "../CardsClient";

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
   <CardsClient cards={cards}/>
  );
}
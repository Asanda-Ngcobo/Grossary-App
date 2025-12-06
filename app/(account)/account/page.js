
import { redirect } from "next/navigation";


import { Lexend_Deca } from "next/font/google";
import { createClient } from "@/app/_utils/supabase/server";
import HomeClient from "./HomeClient";



const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Account | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};
export default async function Page() {
   const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

// Get additional profile info
 // Get additional profile info
  const { data: profile } = await supabase
    .from('users_info')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  


 

  if (!profile) {
    return (
      <div className="text-center mt-10 text-white">
        Unable to load user profile.
      </div>
    );
  }

  const firstName = profile.fullName?.split(" ")[0] || "there";
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  return (
    <HomeClient name={capitalizedFirstName}/>
   
  );
 }

// app/components/AppNavigation.jsx
import { getLists } from "@/app/_lib/data-services";
import { createClient } from "@/app/_utils/supabase/server";
import AppNavLinks from "./AppNavLinks";

export default async function AppNavigation() {
      

  return (
    <div
      className="fixed bottom-0 bg-[#041527]  w-full 
        h-[80px]
      border border-[#04284B] flex justify-center items-center
      lg:bg-[#04284B] lg:rounded-none
       lg:w-[20%] lg:mx-0 lg:h-screen 
       lg:bottom-auto lg:flex-col
        lg:justify-start"
    >
      <AppNavLinks/>
    </div>
  );
}


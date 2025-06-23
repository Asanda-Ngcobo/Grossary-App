import MainAppButton from "@/app/(account)/_ui/MainAppButton";
import { redirect } from "next/navigation";
import Pages from "./Pages";
import Greeting from "./Greetings";

import Image from "next/image";
import Link from "next/link";
import ShoppingPic from '@/public/Foodies - Grocery Shopping.png';
import { ChevronRight } from "@deemlol/next-icons";
import { Lexend_Deca } from "next/font/google";
import { createClient } from "@/app/_utils/supabase/server";



const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

export default async function Page() {
   const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
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
    <div className="bg-[#041527] mt-[5%] lg:mt-[6%]">
      <Pages profile={profile}/>

      {/* Desktop greeting */}
      <section className="justify-between items-center hidden mx-3 lg:w-[60%] lg:ml-[15%] py-7 lg:flex">
        <div className="hidden lg:block">
          <div className="mx-4 font-bold text-[#8F8C8C] text-[18px]">
            <p className="flex gap-2">
              <Greeting /> {capitalizedFirstName},
            </p>
          </div>
          <p className="text-[16px] mx-4">Please start adding your list</p>
        </div>

        <Link href="/account/forms/add-list">
          <MainAppButton>
            <span className="flex justify-between items-center mx-3">
              + New List
            </span>
          </MainAppButton>
        </Link>
      </section>

      {/* Center image */}
      <div className="flex justify-center mt-[20%] lg:mt-[5%]">
        <Image src={ShoppingPic} alt="Shopping" height={400} width={319} />
      </div>

      {/* Mobile CTA button */}
      <button
        className={`${ButtonFont.className} bg-[#A2B06D] w-[90%] mx-[5%] h-[50px] rounded-[10px] mt-25 text-white font-semibold cursor-pointer hover:bg-[#6f7a46] lg:hidden`}
      >
        <Link
          href="/account/forms/add-list"
          className="flex justify-center items-center text-[20px]"
        >
          Add New List <span className="ml-1"><ChevronRight width={20} /></span>
        </Link>
      </button>
    </div>
  );
 }

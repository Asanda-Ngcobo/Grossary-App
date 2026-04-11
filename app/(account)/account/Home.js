"use client";

import { Suspense } from "react";

import { CreditCard, User } from "@deemlol/next-icons";

import Lists from "../_ui/Lists";
import Loading from "./loading";
import ReportsWrapper from "../_ui/ReportWrapper";
import ParentFormBackground from "./ParentFormBackground";
import AddListForm from "./AddListForm";
import { useForm } from "@/app/providers/Provider";
import { Lexend_Deca } from "next/font/google";
import Link from "next/link";


export default function Home({ profile, myLists, allItems, data }) {
  const { formOpen, toggleForm, menuOpen, toggleMenu,
     active, toggleActive } = useForm();
      const activeList = myLists.filter((list)=>
list.money_spent === 0 || list.money_spent === null)

    

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


// await supabase.from('profiles').upsert({
//   id: data.claims.sub,
//   email,
//   first_name: firstName,
// })

let initials = "";

if (nameParts.length >= 2) {
  // First + last name
  initials =
    nameParts[0][0].toUpperCase() +
    nameParts[1][0].toUpperCase();
} else if (nameParts.length === 1) {
  // Only first name
  initials = nameParts[0][0].toUpperCase();
} else {
  initials = "";
}

  return (
    <div className="w-full pt-4 ">
      {/* HEADER */}
      <div className="flex justify-between w-[90%] mx-auto  ">
        <div className="flex gap-2">
          <div className="flex justify-center items-center
           bg-[#1EC677] w-[60px] h-[60px] rounded-full text-gray-500"
           onClick={toggleMenu}>
            <h1 className="text-xl">{initials}</h1>
          </div>

          <div className="flex items-center font-bold">
            <div className="lg:flex">
              <h1>Hello,</h1>
              <h1 className="lg:px-2">{firstName || Name} 👋</h1>
            </div>
          </div>
         
        </div>
      

    
          
      </div>

      {/* REPORTS */}
      
         <ReportsWrapper allItems={allItems} allLists={myLists || []}
        myLists={myLists} userId={profile.id} active={active}
        activeList={activeList} />

      

   

      {/* ADD LIST FORM */}
      {formOpen && (
        <ParentFormBackground openform={toggleForm}>
          <AddListForm toggleForm={toggleForm} />
        </ParentFormBackground>
      )}

    
     
    </div>
  );
}

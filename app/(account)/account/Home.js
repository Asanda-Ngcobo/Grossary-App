"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@deemlol/next-icons";

import Lists from "../_ui/Lists";
import Loading from "./loading";
import ReportsWrapper from "../_ui/ReportWrapper";
import ParentFormBackground from "./ParentFormBackground";
import AddListForm from "./AddListForm";
import { useForm } from "@/app/providers/Provider";
import Menu from "./Menu";

export default function Home({ profile, myLists, allItems }) {
  const { formOpen, toggleForm, menuOpen, toggleMenu,
     active, toggleActive } = useForm();

     const {fullName, email} = {profile}

  const firstName =
    profile?.fullName?.split(" ")[0]?.[0]?.toUpperCase() +
    profile?.fullName?.split(" ")[0]?.slice(1)?.toLowerCase();

  return (
    <div className="w-screen pt-4">
      {/* HEADER */}
      <div className="flex justify-between w-[80%] mx-[10%]">
        <div className="flex gap-2">
          <div className="flex justify-center items-center
           bg-amber-700 w-[60px] h-[60px] rounded-full text-gray-500"
           onClick={toggleMenu}>
            <User />
          </div>

          <div className="flex items-center font-bold">
            <div className="lg:flex">
              <h1>Hello,</h1>
              <h1 className="lg:px-2">{firstName} 👋</h1>
            </div>
          </div>
        </div>
      </div>

      {/* REPORTS */}
      <ReportsWrapper allItems={allItems} allLists={myLists || []} />

      {/* TOGGLE BUTTONS */}
      <div className="flex justify-between items-center
        w-[90%] mx-[5%] bg-gray-600 text-gray-500 
        h-8 my-4 rounded-2xl
        font-bold
        lg:w-[80%] lg:ml-[5%]
        
     ">
        <button onClick={toggleActive}
         className={`w-[50%]  h-8  rounded-2xl cursor-pointer   ${
            !active ? "bg-[#ACF532]" : "bg-gray-600"
          }`}>Active Lists</button>
        <button onClick={toggleActive}
           className={`w-[50%]  h-8  rounded-2xl cursor-pointer  ${
            active ? "bg-[#ACF532] w-[55%]" : "bg-gray-600"
          }`}>Shopped Lists</button>
      </div>

      {/* ACTIVE INDICATOR */}
      <div className="flex justify-between w-[90%] mx-auto">
        <div
         
        />
        <div
       
        />
      </div>

      {/* LISTS */}
      <Suspense fallback={<Loading />}>
        <Lists myLists={myLists} userId={profile.id} active={active} />
      </Suspense>

      {/* ADD LIST FORM */}
      {formOpen && (
        <ParentFormBackground openform={toggleForm}>
          <AddListForm toggleForm={toggleForm} />
        </ParentFormBackground>
      )}

    
     
    </div>
  );
}

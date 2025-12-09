"use client";

import { Suspense } from "react";

import { User } from "@deemlol/next-icons";

import Lists from "../_ui/Lists";
import Loading from "./loading";
import ReportsWrapper from "../_ui/ReportWrapper";
import ParentFormBackground from "./ParentFormBackground";
import AddListForm from "./AddListForm";
import { useForm } from "@/app/providers/Provider";


export default function Home({ profile, myLists, allItems }) {
  const { formOpen, toggleForm, menuOpen, toggleMenu,
     active, toggleActive } = useForm();


  const firstName =
    profile?.fullName?.split(" ")[0]?.[0]?.toUpperCase() +
    profile?.fullName?.split(" ")[0]?.slice(1)?.toLowerCase();
    const initials = firstName.slice(0, 1)

  return (
    <div className="w-screen pt-4 ">
      {/* HEADER */}
      <div className="flex justify-between w-[80%] mx-[10%]  ">
        <div className="flex gap-2">
          <div className="flex justify-center items-center
           bg-amber-700 w-[60px] h-[60px] rounded-full text-gray-500"
           onClick={toggleMenu}>
            <h1 className="text-xl">{initials}</h1>
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
      {myLists.length > 0 && (
         <ReportsWrapper allItems={allItems} allLists={myLists || []} />

      )}
     

      {/* TOGGLE BUTTONS */}
      <div className="flex justify-between items-center
        w-[80%] mx-[10%] bg-gray-600 text-gray-500 
        h-10 my-4 rounded-3xl
        font-bold
        lg:w-[30%] lg:ml-[10%]
        
     ">
        <button onClick={toggleActive}
         className={`w-[50%] ml-1  h-8  rounded-3xl cursor-pointer   ${
            !active ? "bg-[#ACF532]" : "bg-gray-600"
          }`}>Active Lists</button>
        <button onClick={toggleActive}
           className={`w-[50%] mr-1  h-8  rounded-3xl cursor-pointer  ${
            active ? "bg-[#ACF532] w-[55%]" : "bg-gray-600"
          }`}>Shopped Lists</button>
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

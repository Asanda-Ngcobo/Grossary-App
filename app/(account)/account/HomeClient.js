'use client'
import Image from "next/image";
import ShoppingPic from '@/public/Foodies - Grocery Shopping.png';

import MainAppButton from "@/app/(account)/_ui/MainAppButton";
import Greeting from "./Greetings";
// import Link from "next/link";
import { useState } from "react";

import ParentFormBackground from "./ParentFormBackground";
import AddListForm from "./AddListForm";

export default function HomeClient({name}) {
    const [showForm, setShowForm] = useState(false)

    function HandleShowForm (){
        setShowForm(def => !def)
    }
    return (
         <div className="bg-[#041527] mt-[5%] lg:mt-[6%]">
      {/* <Pages profile={profile}/> */}
      

      {/* Desktop greeting */}
      <section className="flex justify-between items-center  mx-3 lg:w-[60%] lg:ml-[15%] py-7 lg:flex">
        <div className="">
          <div className="mx-4 font-bold text-[#8F8C8C] text-[14px]">
            <p className="flex gap-2">
              <Greeting /> {name},
            </p>
          </div>
          <p className="text-[16px] mx-4">Please start adding your list</p>
        </div>

       
          <MainAppButton openform={HandleShowForm}>
            <span className="flex justify-between items-center text-[14px] mx-3 active:bg-gray-600">
              + New List
            </span>
          </MainAppButton>
     
      </section>

      {/* Center image */}
      <div className="flex justify-center mt-[15%] lg:mt-[5%]">
        <Image src={ShoppingPic} alt="Shopping" height={400} width={319} />
      </div>

 
    </div>
    )
}

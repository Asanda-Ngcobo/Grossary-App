'use client'

import { startTransition, useState } from "react";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AddItemButton from "../[listId]/_listcomponents/AddItemButton";
import { ChevronLeft } from "@deemlol/next-icons";
import Link from "next/link";
import { ReportIssue } from "@/app/_lib/actions";
import ReportButton from "./ReportButton";


function ReportsClient({profile}) {
   
    
  const router = useRouter()


     async function handleSubmit(formData) {
 

 

  startTransition(async () => {
    try {
      const result = await ReportIssue(formData);

      if (result.success) {
        toast.success(
          <p>
            Thank you for your report or suggestion, <span className="font-bold text-green-400">{profile.fullName}</span>
          </p>,
          {
            duration: 5000,
            style: {
              background: '#041527',
              color: '#fff',
            },
          }
        );

        setTimeout(() => {
          router.push(`/account`);
        }, 2000);
      }
    } catch (error) {
      toast.error('Something went wrong, check your connection!', {
        duration: 5000,
        style: {
          background: '#041527',
          color: '#fff',
        },
      });
    }
  });
}

    return (
          <main>
      <button className="my-5 mx-[5%] bg-white active:bg-gray-600 rounded-full w-[50px] h-[50px] flex justify-center items-center">
        <Link href={`/account`}>
          <ChevronLeft color="black" size={40} />
        </Link>
      </button>

      <form
      action={handleSubmit}
      >
        {/* Item Name with Autocomplete */}
      <div className="py-2 px-4 rounded-md w-[90%] mt-[2%]
  ml-[5%] md:w-[40%] md:ml-[25%] lg:w-[40%] 
  lg:ml-[30%] grid grid-rows-2 gap-2 bg-[#041527]
   shadow-sm">
       
        {/* User Name */}
       <label htmlFor="name" className=" text-xl ">User Name</label>
      <input
        type="text"
        name="name"
        defaultValue={profile.fullName}
       
    
        required
        className="bg-white text-gray-300 text-lg p-3 rounded-md w-full"
      />

      {/* Email */}
      <label htmlFor="name" className=" text-xl">Email</label>

      <input
        type="text"
        name="email"
         defaultValue={profile.email}
       
        
       className="bg-white text-gray-300 text-lg p-3 rounded-md w-full"
      />
 {/* Issue  */}
      <label htmlFor="name" className=" text-xl">Issue or Suggestion</label>
      <textarea
        type="text"
        name="issue"
        placeholder="Write your issue or suggestion here"
       
        className="bg-white text-gray-900
        h-[300px]
        text-lg p-3 rounded-md w-full"
          
      />

  
      <ReportButton
      >Report</ReportButton>
      </div>

 

      </form>
    </main>
    )
}


export default ReportsClient

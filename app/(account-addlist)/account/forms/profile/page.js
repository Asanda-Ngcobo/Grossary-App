import SignOutButton from "@/app/(authentication)/signOutButton";
import {  ChevronLeft, Edit,    Edit2,    Email,    LogOut,  Mail, Trash2, User } from "@deemlol/next-icons";
import Image from "next/image";
import Link from "next/link";


import { Suspense } from "react";
import Loading from "../add-list/loading";
import { createClient } from "@/app/_utils/supabase/server";






export const metadata = {
  title: "Profile | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};

async function page() {
   const supabase = await createClient()
       const { data, error } = await supabase.auth.getUser()
       if (error || !data?.user) {
         redirect('/login')
       }
     
     // Get additional profile info
     
       const { data: profile } = await supabase
         .from('users_info')
         .select('*')
         .eq('id', data.user.id)
         .single();
  
  
  

const fullName = profile.fullName
  .split(' ')
  .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
  .join(' ');



    return (

        <Suspense fallback={<Loading/>}>
       
          {/* Profile */}
 <section className="py-6 px-4 rounded-md w-[90%] mt-[5%]
  ml-[5%] xl:w-[60%] xl:ml-[15%] lg:mx-0 gap-6 shadow-sm ">
       <button className="bg-white
            cursor-pointer active:bg-gray-600
             text-black rounded-full w-10 h-10
              flex items-center justify-center"
              >
                <Link href={`/account`}>
    <ChevronLeft />
      </Link>
              
            </button>

    {/* Profile Photo */}
  <div className="space-y-4  ">
    <div className="flex flex-row gap-2 justify-center items-center">
   <Image
      src={profile?.image ?? "/default-profile-picture.jpg"}
      alt="Profile picture"
      height={150}
      width={150}
      className="rounded-full object-cover"
    />
    </div>
 

    <div className="flex flex-row gap-2 justify-center items-center my-4">
      <h1 className="text-lg flex gap-2"> <User/>{fullName}</h1>
      <button
      type="button"
      className="p-2 rounded-full  bg-accent-100 hover:bg-accent-200 transition cursor-pointer"
    >
     <Link href='/account/forms/edit-profile'><Edit2 color="#A2B06D" className="active:bg-gray-600"/></Link> 
    </button>
    </div>

     <div className="flex flex-row gap-2 justify-center items-center my-4">
      <h1 className="text-lg flex gap-2"> <Mail/>{profile.email}</h1>
     
    </div>
    


  </div>
</section>

  
          
</Suspense>
        
        )
      }
      

export default page;
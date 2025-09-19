import SignOutButton from "@/app/(authentication)/signOutButton";
import {  ChevronLeft, Edit,    Edit2,    LogOut,  Mail, Trash2 } from "@deemlol/next-icons";
import Image from "next/image";
import Link from "next/link";
import { getLists } from "@/app/_lib/data-services";
import { createClient } from "@/app/_utils/supabase/server";
import { Suspense } from "react";
import Loading from "../loading";
import DeleteAccount from "./DeleteAccount";
import ReportIssueButton from "@/app/(account-addlist)/account/forms/reports/ReportIssueButton";
import { Quicksand } from "next/font/google";




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
  
  const lists = await getLists(profile.id)
  

const fullName = profile.fullName
  .split(' ')
  .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
  .join(' ');


  const numberOfLists = lists.length;

//Money Spent
const { data: lists30Days } = await supabase
  .from('user_lists')
  .select('money_spent, created_at')
  .eq('user_id', profile.id)
  .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

const moneySpent30Days = lists30Days?.reduce((sum, list) => sum + list.money_spent, 0) || 0;

const moneySpentFormatted = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
}).format(moneySpent30Days);

//Money Saved

const { data: savings30Days } = await supabase
  .from('user_lists')
  .select('money_left, created_at')
  .eq('user_id', profile.id)
  .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

const moneySaved30Days = savings30Days?.reduce((sum, list) => sum + list.money_left, 0) || 0;

const moneySavedFormatted = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
}).format(moneySaved30Days);


const { data: budget30Days } = await supabase
  .from('user_lists')
  .select('list_budget, created_at, money_spent')
  .eq('user_id', profile.id)
  .not('money_spent', 'is', null) // ✅ exclude active lists with no spend
  .gte(
    'created_at',
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  );

const Budget30Days = budget30Days?.reduce((sum, list) => sum + list.list_budget, 0) || 0;

  const savedPercentage = ((Number(moneySaved30Days) / Number(Budget30Days)) * 100).toFixed(2);
  
const navLinks = [

  {
    name: profile.email,
    
    icon2: <Mail/>,
    id: 1,
   
  },

  
  // {
  //   name: 'Grossary+',
  //   icon: <GrossaryPlusButton/>,
  //   icon2: <Tag/>,
   
  // },

   {
    name: <ReportIssueButton/>,
    id: 2,
    
  
    
    
  },
      {
    name: <SignOutButton/>,
    id: 3,
    
  
    
    
  },
 
    {
    name: <DeleteAccount/>,
    id: 4,
    
  
   
    
  },

 
];

    return (

        <Suspense fallback={<Loading/>}>
       
          {/* Profile */}
 <section className="py-6 px-4 rounded-md w-[90%] mt-[5%]
  ml-[5%] xl:w-[60%] xl:ml-[15%] lg:mx-0 gap-6 bg-[#041527] shadow-sm ">

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
      <h1 className="text-lg">{fullName}</h1>
      <button
      type="button"
      className="p-2 rounded-full  bg-accent-100 hover:bg-accent-200 transition cursor-pointer"
    >
     <Link href='/account/forms/edit-profile'><Edit2 color="#A2B06D" className="active:bg-gray-600"/></Link> 
    </button>
    </div>
    


  </div>
</section>
<section  className="py-3 rounded-md w-[90%] ml-[5%]
        xl:w-[60%] xl:ml-[15%] lg:ml-0 bottom-[300px]">
  {navLinks.map(function(userInfo){
    return <ul key={userInfo.id} className="w-[90%] ml-[5%]">
      <li  className="border-b border-gray-300 p-6 flex justify-between  cursor-pointer">
       
 <span className="flex gap-2.5">{userInfo.icon2}{userInfo.name}</span>
        <span>{userInfo.icon}</span>
       
       </li>

    </ul>
  })}

</section>
  
          
</Suspense>
        
        )
      }
      

export default page;
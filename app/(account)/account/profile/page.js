import SignOutButton from "@/app/(authentication)/signOutButton";
import { auth } from "@/app/_lib/auth";
import {  ChevronLeft, Edit,    LogOut,  Mail,  Tag, Trash2 } from "@deemlol/next-icons";
import Image from "next/image";
import Link from "next/link";
import GrossaryPlusButton from "../../_ui/GrossaryPlusButton";
import { getLists, getUserById } from "@/app/_lib/data-services";
import { createClient } from "@/app/_utils/supabase/server";



async function page() {
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
  
  const lists = await getLists(profile.id)
  

const fullName = profile.fullName
  .split(' ')
  .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
  .join(' ');


  const numberOfLists = lists.length;
 const monthlySpend = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
}).format(profile.avg_monthly_spend || 0);

const monthlySave = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
}).format(profile.avg_monthly_savings || 0);


  // const monthlySave = Number(profile.avg_monthly_savings).toFixed(2);
  const monthlyBudget = Number(profile.avg_monthly_savings) + Number(profile.avg_monthly_spend);
  const savedPercentage = ((profile.avg_monthly_savings / monthlyBudget) * 100).toFixed(2);
const navLinks = [

  {
    name: profile.email,
    
    icon2: <Mail/>,
   
  },
  // {
  //   name: 'Grossary+',
  //   icon: <GrossaryPlusButton/>,
  //   icon2: <Tag/>,
   
  // },
      {
    name: <SignOutButton/>,
    
  
    icon2: <LogOut/>,
    
  },
 
    {
    name: 'Delete Account',
    
  
    icon2: <Trash2/>,
    
  },

 
];

    return (
        <>
        {/* back button */}
       <div className="my-5 mx-[5%] bg-white rounded-full
        w-[40px] h-[40px] flex justify-center items-center lg:hidden"> 
            <Link href='/account'><ChevronLeft color="black" size={30}/></Link> </div>   

          {/* Profile */}
 <section className="py-6 px-4 rounded-md w-[90%] mt-[5%]
  ml-[5%] xl:w-[60%] xl:ml-[15%] lg:mx-0 gap-6 bg-[#041527] shadow-sm">

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
      className="p-2 rounded-full bg-accent-100 hover:bg-accent-200 transition cursor-pointer"
    >
     <Link href='/account/forms/edit-profile'><Edit color="#A2B06D" /></Link> 
    </button>
    </div>
    
  </div>

  <div>
    {/* Snap Shots Container */}
    <div className="grid grid-cols-3 gap-2  ">
   {/* Monthly Spending */}
       <div className=" p-2 col-start-1 col-end-4 h-[120px] bg-[#04284B] 
       grid justify-center items-center rounded-lg">
        <h2 className="text-4xl font-bold text-center">{monthlySpend}</h2>
        <p className="text-lg text-gray-500 text-center">Average Monthly Grocery Spend</p>
      </div>
{/* Money Saved Container */}
       <div className=" pb-2 col-start-1 col-end-3 h-[120px] bg-[#04284B] 
       grid justify-center items-center rounded-lg ">
        <h2 className="text-4xl font-bold text-center">{monthlySave} <span className="text-sm
         text-gray-600">({savedPercentage}%)</span></h2>
        <p className="text-lg text-gray-500 text-center">Average Money Saved Per Month</p>
      </div>
      {/* Lists Created Container */}
      <div className=" pb-2 h-[120px] bg-[#04284B] 
       grid justify-center items-center rounded-lg ">
        <h2 className="text-4xl font-bold text-center">{numberOfLists}</h2>
        <p className="text-lg text-gray-500 text-center">Lists Created</p>
      </div>
     
     
    </div>
  </div>
</section>
<section  className="py-3 rounded-md w-[90%] ml-[5%]
        xl:w-[60%] xl:ml-[15%] lg:ml-0">
  {navLinks.map(function(userInfo){
    return <ul key={userInfo.name} className="w-[90%] ml-[5%]">
      <li  className="border-b border-gray-300 p-6 flex justify-between ">
       
 <span className="flex gap-2.5">{userInfo.icon2}{userInfo.name}</span>
        <span>{userInfo.icon}</span>
       
       </li>

    </ul>
  })}

</section>
  
          
</>
        
        )
      }
      

export default page;
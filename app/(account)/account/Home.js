"use client";



import { Bell, CreditCard, List, PieChart, User } from "@deemlol/next-icons";



import ParentFormBackground from "./ParentFormBackground";
import AddListForm from "./AddListForm";
import { useForm } from "@/app/providers/Provider";

import OnboardingCards from "./onboardingCards";
import Link from "next/link";


export default function Home({ profile, myLists, allItems, data }) {
  const { formOpen, toggleForm, menuOpen, toggleMenu,
     active, toggleActive } = useForm();
      const activeList = myLists.filter((list)=>
list.money_spent === 0 || list.money_spent === null)

    console.log(activeList.length)

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


const pages = [
  {
    id: 1,
    name: 'Lists',
    icon: <List/>,
    href: "/account/lists"
  },
    {
    id: 2,
    name: 'Lists',
    icon: <CreditCard/>,
    href: "/account/cards"
  },
    {
    id: 3,
    name: 'Lists',
    icon: <PieChart/>,
    href: "/account/reports"
  }
]
  return (
    <div className="w-full ">
      {/* HEADER */}
      <div className="flex items-center w-screen
       bg-[#F8F8F8] top-0 h-20 z-10 sticky  ">
       
       {/* HEADER CHILDREN */}
       <div className="flex justify-between w-[90%] mx-auto">
  <div className="flex justify-center items-center
           text-gray-500"
           onClick={toggleMenu}>
            <User/>
            {/* <h1 className="text-xl">{initials}</h1> */}
          </div>

          
         {/* Links */}

         <ul className="w-[50%] lg:w-[15%] flex justify-between">

  
    <li
      
      className="
        flex items-center justify-center
        w-[50px] h-[50px]
        rounded-full bg-white border border-gray-200
      "
    >
      <Link
        href='/account/lists'
        className="flex flex-col items-center justify-center relative"
      >
       <List/>
       <span className="   absolute
              bottom-3
              -right-5
              w-5
              h-5
              rounded-full
              bg-[#ACF532]
              flex justify-center items-center
            ">{activeList.length}</span>

      </Link>
    </li>

        <li
      
      className="
        flex items-center justify-center
        w-[50px] h-[50px] active:text-[#ACF532]
        rounded-full bg-white border border-gray-200
      "
    >
      <Link
        href='/account/cards'
        className="flex flex-col items-center justify-center relative"
      >
       <CreditCard/>
      

      </Link>
    </li>
        <li
      
      className="
        flex items-center justify-center
        w-[50px] h-[50px]
        rounded-full bg-white border border-gray-200
      "
    >
      <Link
        href='/account/reports'
        className="flex flex-col items-center justify-center relative"
      >
       <PieChart/>
      

      </Link>
    </li>
 
         </ul>
       
       </div>
        
      

    
          
      </div>

      {/* LIST TEMPLATES */}
      
      <OnboardingCards userName={firstName || Name}/> 
        

      

   

      {/* ADD LIST FORM */}
      {formOpen && (
        <ParentFormBackground openform={toggleForm}>
          <AddListForm toggleForm={toggleForm} />
        </ParentFormBackground>
      )}

    
     
    </div>
  );
}

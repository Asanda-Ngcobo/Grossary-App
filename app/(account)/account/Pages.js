import Logo from "@/app/(website)/_components/Logo";
import { getLists,  getUserById } from "@/app/_lib/data-services";
import { BarChart, List, PieChart } from "@deemlol/next-icons";
import Image from "next/image";
import Link from "next/link";
import Greeting from "./Greetings";


async function Pages({profile}) {
   
        const name = profile.fullName.split(' ')[0]
 const capitalizedFirstName = name
  .split(' ')
  .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
  .join(' ');

  //Displaying active lists amount
     const userLists = await getLists(profile.id);
       const activeList = userLists.filter((list)=>
list.money_spent === 0 || list.money_spent === null)
      const listCount = activeList?.length || 0;
    return (
      <main>
        <div className="flex justify-between
          w-[90%] mx-[5%] mb-4 lg:hidden">
            <div>
             <Logo/> <span className="italic text-[10px] text-gray-600">Beta v2.0</span>
      

            </div>
                 
             <div>
      <ul className=" flex gap-2 mr-4">
        {/* Lists */}
            <li ><Link href='/account/lists' className="w-[40px] h-[40px] rounded-full bg-[#04284B] active:bg-gray-600
            flex justify-center items-center"><List  /></Link>
             <span className="text-xs absolute lg:text-sm bg-[#E32227] text-white px-2 py-0.5
              rounded-full ml-5 -mt-10 lg:ml-25 lg:-mt-5">
            {listCount}
          </span></li>
          {/* Reports */}
            <li ><Link href='/account/reports' className="w-[40px] h-[40px] rounded-full bg-[#04284B] active:bg-gray-600
            flex justify-center items-center "> <BarChart/></Link></li>
            {/* Profile */}
               <li className="flex gap-3 text-[#8F8C8C] text-[15px] active:bg-gray-600 rounded-full"> 
                <Link href='/account/profile'>  <Image   src={profile?.image ?? "/default-profile-picture.jpg"} height={40} width={40} alt='profile'
             className="rounded-full "/></Link>
                  
             </li>

        </ul>
             </div>
      

        </div>

        {/* Displaying Greetings and Name */}
        <div className="w-[90%] mx-[5%] lg:hidden">
<div className="mx-4 font-bold text-[#8F8C8C] text-[18px]"> <p className="flex gap-2"><Greeting/>{capitalizedFirstName},</p></div>
      <p className="text-[16px] mx-4 "> Please start adding your list below</p>
        </div>
        
        </main>
    )
}

export default Pages

'use client'
import { ChevronRight, Mail, X } from "@deemlol/next-icons";
import { useForm } from "../../providers/Provider"
import SignOutButton from "../../(authentication)/signOutButton";

import ReportIssueButton from "../../(account-addlist)/account/forms/reports/ReportIssueButton";
import { Quicksand } from "next/font/google";
import Profile from "../_ui/Profile";
import Privacy from "../_ui/Privacy";
import DeleteAccount from "@/app/(account-addlist)/account/forms/profile/DeleteAccount";



const navLinks = [


  
  // {
  //   name: 'Grossary+',
  //   icon: <GrossaryPlusButton/>,
  //   icon2: <Tag/>,
   
  // },

  
   {
    name: <Profile/>,
    id: 1,
      // icon: <ChevronRight/>
  
    
    
  },

  //  {
  //   name: <Privacy/>,
  //   id: 2,
  //     icon: <ChevronRight/>
  
    
    
  // },
  //  {
  //   name: <ReportIssueButton/>,
  //   id: 3,
  //     icon: <ChevronRight/>
  
    
    
  // },
   
  //   {
  //   name: <DeleteAccount/>,
  //   id: 4,
  //   icon: <ChevronRight/>
    
  
   
    
  // },

    {
    name: <SignOutButton/>,
    id: 5,
    
  
    
    
  },
 
];

const LogoFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});
function Menu() {
  const { menuOpen, toggleMenu } = useForm();

  return (
    <div

      className={`
        fixed inset-0 z-30
        bg-black/40 backdrop-blur-sm
        transition-opacity duration-300 flex justify-center items-center
        ${menuOpen ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"}
      `}
     
    >
        <div className="bg-[#e7eeea]
         w-[80%] h-[20vh] mx-auto
          flex flex-col items-center
         lg:w-[30%]
         rounded-lg">
            <div className="top-1 ml-[90%] text-gray-600 flex"
                  onClick={toggleMenu} >
   <X />
            </div>
     
      
<section  className="py-1 rounded-md w-[90%] ml-[5%]
        xl:w-[60%] xl:ml-[15%] lg:ml-0 bottom-[300px]">
  {navLinks.map(function(userInfo){
    return <ul key={userInfo.id} className="w-[90%] ml-[5%]">
      <li  className={` p-1 flex
       justify-between  cursor-pointer
       active:text-[#ACF532]
        ${userInfo.id === 1 ? '': ''}`}>
       
 <span className="flex gap-2.5">
{userInfo.name}</span>
        <span className="text-black">{userInfo.icon}</span>
       
       </li>

    </ul>
  })}

</section>

        </div>
    </div>
  );
}

export default Menu;


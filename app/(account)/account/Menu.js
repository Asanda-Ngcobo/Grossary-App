'use client'
import { Mail, X } from "@deemlol/next-icons";
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
    
  
    
    
  },

   {
    name: <Privacy/>,
    id: 2,
    
  
    
    
  },
   {
    name: <ReportIssueButton/>,
    id: 3,
    
  
    
    
  },
      {
    name: <SignOutButton/>,
    id: 4,
    
  
    
    
  },
 
    {
    name: <DeleteAccount/>,
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
        transition-opacity duration-300
        ${menuOpen ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"}
      `}
     
    >
        <div className="bg-gray-200
         w-[80%] h-screen

         lg:w-[30%]
         rounded-r-lg">
            <div className="top-1 ml-[90%] text-gray-600 flex"
                  onClick={toggleMenu} >
   <X />
            </div>
      <h1 className={`text-center
        text-[24px] text-black
        font-bold ${LogoFont.className}`}>Grossary</h1>
      
<section  className="py-1 rounded-md w-[90%] ml-[5%]
        xl:w-[60%] xl:ml-[15%] lg:ml-0 bottom-[300px]">
  {navLinks.map(function(userInfo){
    return <ul key={userInfo.id} className="w-[90%] ml-[5%]">
      <li  className={`border-b border-gray-300 p-1 flex
       justify-between  cursor-pointer
       active:text-[#ACF532]
        ${userInfo.id === 1 ? 'border-t border-gray-300': ''}`}>
       
 <span className="flex gap-2.5">{userInfo.icon2}{userInfo.name}</span>
        <span>{userInfo.icon}</span>
       
       </li>

    </ul>
  })}

</section>

        </div>
    </div>
  );
}

export default Menu;


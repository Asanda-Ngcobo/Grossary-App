import { Nunito_Sans } from "next/font/google";
import "@/app/globals.css";

import AppNav from '@/app/(account)/_ui/AppNav'
import DashboardNavigation from "@/app/(account)/_ui/DashboardNav";
import SignOutButton from "@/app/(authentication)/signOutButton";



const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function WebAppLayout({ children }) {
  

  return (
    <html>
 <body
        className={`${MainFont.className} bg-[#041527] text-white lg:grid grid-cols-[16rem_1fr] h-screen 
        gap-12`}
      >
        <div><DashboardNavigation/></div>
        <div>{children}</div>
       
       
         
        
        
        
      </body>
    </html>
     

   
  );
}


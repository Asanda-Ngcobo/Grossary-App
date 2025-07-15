import { Nunito_Sans } from "next/font/google";
import "@/app/globals.css";
import DashboardNavigation from "@/app/(account)/_ui/DashboardNav";
import DashboardHeader from "@/app/(account)/_ui/DashboardHeader";




const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function WebAppLayout({ children }) {
  

  return (
    <html>
 <body
        className={`${MainFont.className} bg-[#041527] text-white  h-screen 
        gap-12`}
      >
         <div><DashboardHeader/></div>
        <div className="lg:grid grid-cols-[16rem_1fr]">
           <div><DashboardNavigation/></div>
        <div>{children}</div>
        </div>
        
       
       
         
        
        
        
      </body>
    </html>
     

   
  );
}


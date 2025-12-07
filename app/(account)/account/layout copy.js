import ListsNav from '@/app/(account)/account/lists/ListsNav'
import { Nunito_Sans } from "next/font/google";

const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function ListsLayout({ children }) {
  
  return (
   
      <div
        className={`${MainFont.className} bg-[#041527] text-white h-screen`}
      >

        <div>{children}</div>
        
        
    
        
      </div>

    
  );
}
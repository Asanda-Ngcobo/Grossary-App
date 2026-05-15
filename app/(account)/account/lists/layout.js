import ListsNav from '@/app/(account)/account/lists/ListsNav'
import { ChevronLeft } from '@deemlol/next-icons';
import { Nunito_Sans } from "next/font/google";
import Link from 'next/link';

const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function ListsLayout({ children }) {
  
  return (
   
      <div
        className={`${MainFont.className} text-white h-screen`}
      >
  <button className="
            cursor-pointer active:bg-gray-600
             text-black rounded-full w-10 h-10
              flex items-center justify-center"
              >
                <Link href={`/account`}>
    <ChevronLeft />
      </Link>
              
            </button>
        <div>{children}</div>
        
        
    
        
      </div>

    
  );
}
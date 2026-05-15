'use client'

import { ChevronLeft } from "@deemlol/next-icons";
import Link from "next/link";
import { usePathname } from 'next/navigation';



const navLinks = [
  {
    name: 'Active Lists',
    href: '/account/lists',
    
  },
  {
    name: 'Shopped Lists',
    href: '/account/lists/history',
    
  },
]

export default function ListNavigation() {
  const pathname = usePathname();
 

  return (
    <nav className="fixed top-4 w-[90%] 
    lg:w-[60%]   mt-2  z-10 mx-auto ">

       {/* <div className="my-5 mx-[5%] bg-white
        active:bg-gray-600 rounded-full
        w-[40px] h-[40px] flex justify-center
         items-center lg:hidden"> 

            <Link href='/account'><ChevronLeft color="black" size={30}/></Link> 
            </div> */}
            
      <ul className="flex flex-row justify-between
       gap-0 border-b border-[#D9D9D9] text-black">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li
              key={link.name}
              className={`flex flex-col items-center justify-center 
                lg:flex-row lg:gap-2 w-full
                 
                ${isActive ? "border-b-2 border-[#ACF532]"
                   : "border-b-2 border-transparent"}`}
            >
              <Link
                href={link.href}
                className={`flex flex-col lg:flex-row 
                  items-center justify-center
                   cursor-pointer 
                  w-full text-center 
                  lg:gap-2 hover:text-2xl hover:rounded-[4px] p-3`}
              >
                {link.icon}
                <span className="cursor-pointer ">{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


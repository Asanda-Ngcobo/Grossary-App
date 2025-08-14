'use client';

import { AlertCircle, BarChart, DollarSign,
     FileText, Grid, House, List, LogOut, User, Users } from "@deemlol/next-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    exact: true, // Only active on exact route
    icon: <Grid />,
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    exact: false, // Active on nested routes like /account/lists/123
    icon: <Users  />,
  },
 
  {
    name: 'Revenue',
    href: '/dashboard/revenue',
    exact: false,
    icon: <DollarSign  />,
  },

    {
    name: 'Feedback',
    href: '/dashboard/feedback',
    exact: false,
    icon: <AlertCircle  />,
  },
];

function DashNavLinks({ userLists }) {
  const pathname = usePathname();

  return (

    <main className="">
        
<nav className='h-[115px] text-white 
     w-full z-50 flex items-center justify-center mt-10
     
'>

      
      <ul className="grid grid-cols-4 gap-2 text-center w-full
       lg:grid-cols-1 lg:grid-rows-4 lg:gap-10 mt-60">
      {navLinks.map((link) => {
  const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
  const isListsLink = link.name === "Lists";
  const listCount = userLists?.length || 0;

  return (
    <li key={link.name} className="flex flex-col items-center justify-center font-bold lg:justify-center lg:flex-row lg:gap-2">
      <Link
        className={`flex flex-col lg:flex-row items-center lg:gap-10 lg:text-[#04284B]
          lg:w-[90%] lg:ml-[5%] hover:bg-[#04284B] hover:text-gray-50
          hover:rounded-[4px] lg:p-3 active:opacity-60
          ${isActive ? "text-[#E32227] lg:bg-[#041527] rounded-[4px] lg:text-gray-50" : ""}`}
        href={link.href}
      >
        {link.icon}
        <span>{link.name}</span>

        {isListsLink && (
          <span className="text-xs absolute lg:text-sm bg-[#E32227] text-white px-2 py-0.5 rounded-full ml-4 -mt-3 lg:ml-25 lg:-mt-5">
            {listCount}
          </span>
        )}
      </Link>
    </li>
  );
})}
 
      </ul>
     
    </nav>
    </main>
    
  );
}

export default DashNavLinks;

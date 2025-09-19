'use client';

import { BarChart, House, List, User } from "@deemlol/next-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    name: 'Home',
    href: '/account',
    exact: true, // Only active on exact route
    icon: <House />,
  },
  {
    name: 'Lists',
    href: '/account/lists',
    exact: false, // Active on nested routes like /account/lists/123
    icon: <List  />,
  },
  {
    name: 'Reports',
    href: '/account/reports',
    exact: false,
    icon: <BarChart  />,
  },
  {
    name: 'Profile',
    href: '/account/profile',
    exact: false,
    icon: <User  />,
  },
];

function AppNavLinks({ userLists }) {
  const pathname = usePathname();

  return (
    <nav className='h-[115px] text-white
     w-full z-50 flex items-center justify-center
'>
      
      <ul className="grid grid-cols-4 gap-2 text-center w-full
       lg:grid-cols-1 lg:grid-rows-4 lg:gap-10 lg:mt-60">
      {navLinks.map((link) => {
  const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
  const isListsLink = link.name === "Lists";
  const listCount = userLists?.length || 0;

  return (
    <li key={link.name} className="flex flex-col items-center justify-center lg:justify-center lg:flex-row lg:gap-2">
      <Link
        className={`flex flex-col lg:flex-row items-center lg:gap-10 lg:text-[#04284B]
          lg:w-[90%] lg:ml-[5%] hover:bg-[#04284B] hover:text-gray-50
          hover:rounded-[4px] lg:p-3 active:opacity-60 text-[10px] lg:text-[18px]
          ${isActive ? "text-[#EDE734] lg:bg-[#041527] rounded-[4px] lg:text-gray-50" : ""}`}
        href={link.href}
      >
        {link.icon}
        <span>{link.name}</span>

        {isListsLink && (
          <span className="text-xs absolute lg:text-sm bg-[#EDE734] text-[#041527] font-bold px-2 py-0.5 rounded-full ml-4 -mt-3 lg:ml-25 lg:-mt-5">
            {listCount}
          </span>
        )}
      </Link>
    </li>
  );
})}

      </ul>
    </nav>
  );
}

export default AppNavLinks;


"use client";

import { CreditCard, House, List, PieChart, User } from "@deemlol/next-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/", exact: true, icon: <House /> },
   { name: "Account", href: "/account", exact: true, icon: <User /> },
  { name: "Lists", href: "/account/lists", exact: false, icon: <List /> },
    { name: "Cards", href: "/account/cards", exact: false, icon: <CreditCard /> },
  { name: "Reports", href: "/account/reports", exact: false, icon: <PieChart /> },
 
];

export default function AppNavLinks({userLists, profile} ) {
  const pathname = usePathname();
const filteredLinks = navLinks.filter((link) => {
  // Hide Home when logged in
  if (profile && link.name === "Home") return false;

  return true;
});

  return (
      <nav
      className="h-[115px] md:h-full text-black w-full
       z-40 flex items-center
       justify-center lg:mt-20 pl-3"
    >
      <ul
        className={`grid gap-2 text-center w-full
        ${
          profile
            ? "grid-cols-4 lg:grid-cols-1"
            : "grid-cols-5 lg:grid-cols-1"
        }
        lg:grid-rows-4 lg:gap-10`}
      >
        {filteredLinks.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const isListsLink = link.name === "Lists";
          const listCount = userLists.length;

          return (
            <li
              key={link.name}
              className="flex items-center justify-center lg:justify-center
              w-[60px] h-[60px]
              lg:w-full lg:flex-row lg:gap-2"
            >
            <Link
  href={link.href}
  className={`flex flex-col items-center justify-center
  lg:gap-2 
  lg:w-full hover:bg-gray-300
  hover:text-[#0B2E1E] 
  lg:p-3 active:opacity-60
  text-[10px] lg:text-[12px]
  
  ${
    isActive
      ? "text-[#ACF532] md:bg-gray-300 w-full h-full flex justify-center items-center lg:text-[#0B2E1E]"
      : " w-full h-full flex justify-center items-center text-black"
  }`}
>
  <div className="relative flex items-center justify-center">
    {link.icon}

    {isListsLink && listCount > 0 && (
      <span
        className="
          absolute -top-2 -right-2
          bg-[#0B2E1E] text-white
          text-[10px] font-bold
          w-5 h-5
          flex items-center justify-center
          rounded-full
        "
      >
        {listCount}
      </span>
    )}
  </div>

  <span>{link.name}</span>
</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

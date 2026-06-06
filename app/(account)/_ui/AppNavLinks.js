
"use client";

import { CreditCard, House, List, PieChart, User } from "@deemlol/next-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/", exact: true, icon: <House /> },
   { name: "Account", href: "/account", exact: false, icon: <User /> },
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
      className="h-[115px] text-white
      w-full z-40 flex items-center justify-center lg:mt-60 pl-3"
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
              lg:w-full  rounded-full lg:flex-row lg:gap-2"
            >
            <Link
  href={link.href}
  className={`flex flex-col lg:flex-row items-center
  lg:gap-10 lg:text-white
  lg:w-[90%] lg:ml-[5%] hover:bg-[#04284B]
  hover:text-gray-50 hover:rounded-[4px]
  lg:p-3 active:opacity-60
  text-[10px] lg:text-[18px]
  ${
    isActive
      ? "text-[#ACF532] w-full h-full rounded-full flex justify-center items-center lg:rounded-[4px] lg:text-gray-50"
      : " w-full h-full rounded-full flex justify-center items-center text-black"
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

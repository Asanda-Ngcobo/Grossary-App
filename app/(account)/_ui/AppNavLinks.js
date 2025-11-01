// app/components/AppNavLinks.jsx
"use client";

import { BarChart, House, List, User } from "@deemlol/next-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/account", exact: true, icon: <House /> },
  { name: "Lists", href: "/account/lists", exact: false, icon: <List /> },
  { name: "Reports", href: "/account/reports", exact: false, icon: <BarChart /> },
  { name: "Profile", href: "/account/profile", exact: false, icon: <User /> },
];

export default function AppNavLinks({ userLists = [] }) {
  const pathname = usePathname();

  return (
    <nav className="h-[115px] text-white
     w-full z-40 flex items-center justify-center lg:mt-60 pl-3">
      <ul
        className="grid grid-cols-4 gap-2 text-center w-full
        lg:grid-cols-1 lg:grid-rows-4 lg:gap-10 "
      >
        {navLinks.map((link) => {
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
                className={`flex flex-col lg:flex-row items-center lg:gap-10 lg:text-white
                lg:w-[90%] lg:ml-[5%] hover:bg-[#04284B] hover:text-gray-50 hover:rounded-[4px] lg:p-3 active:opacity-60
                text-[10px] lg:text-[18px]
                ${
                  isActive
                    ? "bg-[#ACF532] w-full h-full rounded-full flex justify-center items-center text-black lg:bg-[#041527] lg:rounded-[4px] lg:text-gray-50"
                    : "bg-[#04284B] w-full h-full rounded-full flex justify-center items-center"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>

                {isListsLink && (
                  <span
                    className="text-xs border border-[#04284B] absolute lg:text-sm bg-[#ACF532] text-[#041527] font-bold
                    px-2 py-0.5 rounded-full ml-12 -mt-8 lg:ml-24 lg:-mt-5"
                  >
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

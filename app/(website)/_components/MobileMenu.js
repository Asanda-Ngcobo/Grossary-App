'use client';

import Link from "next/link";
import NavigationButtons from "./NavigationButtons";
import SignInButton from "./SignInButton";
import { useEffect } from "react";

function MobileMenu({ handleDisplayMenu, showMenu }) {
  useEffect(() => {
    if (showMenu) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [showMenu]);
  
  return (
    <div
      onClick={handleDisplayMenu}
      className={`absolute top-16 left-1/2 transform -translate-x-1/2 
        w-[96%] h-[80vh] z-40
      rounded-2xl bg-white shadow-lg px-6 py-4 text-[#4B4B4B]
      transition-all duration-300 ease-in-out
      overflow-hidden 
      ${!showMenu ? 'hidden' : 'flex flex-col '}`}
    >
      <ul className="flex flex-col gap-6 overflow-scroll sm:overflow-hidden">
        {/* Features Section */}
        <li className="border-b-1 border-b-gray-200">
          <NavigationButtons>Features</NavigationButtons>
          <ul className="mt-2 ml-4 space-y-2">
            <li className="p-3 hover:bg-gray-100 rounded-xl transition">
              <Link href="/features/planning-ahead">Planning Ahead</Link>
            </li>
            <li className="p-3 hover:bg-gray-100 rounded-xl transition">
              <Link href="/features/staying-under-budget">Staying under Budget</Link>
            </li>
            {/* <li className="p-3 hover:bg-gray-100 rounded-xl transition">
              <Link href="/features/grossaryplus">Grossary Plus</Link>
            </li> */}
          </ul>
        </li>

        {/* Company Section */}
        <li className="border-b-1 border-b-gray-200 mb-5">
          <NavigationButtons>Company</NavigationButtons>
          <ul className="mt-2 ml-4 space-y-2">
            <li className="p-3 hover:bg-gray-100 rounded-xl transition">
              <Link href="/company/about">About</Link>
            </li>
            <li className="p-3 hover:bg-gray-100 rounded-xl transition">
              <Link href="/company/blog">Blog</Link>
            </li>
            <li className="p-3 hover:bg-gray-100 rounded-xl transition">
              <Link href="/company/help-center">Help Center</Link>
            </li>
          </ul>
        </li>
        <li className="mb-5 px-6 pb-5 hover:bg-gray-100 
        rounded-xl transition
        border-b-1 border-b-gray-200"><Link href='/for-grossary-stores'>For Stores</Link></li>
      </ul>
      <Link href='/login'><SignInButton/></Link>
      
    </div>
  );
}

export default MobileMenu;

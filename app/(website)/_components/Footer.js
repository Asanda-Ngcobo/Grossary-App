'use client'
import Link from "next/link";

import SignInButton from "./SignInButton";
import { Facebook, Instagram, Linkedin, X } from "@deemlol/next-icons";

function Footer() {
  return (
    <footer className="bg-[#041527] shadow-lg px-6 py-10 align-bottom  ">
      <div className=" w-[80%] mx-[10%] grid gap-10 grid-cols-2
       lg:grid-cols-4 min-h-[40vh] items-center  ">
        {/* Features Section */}
        <div className="text-white">
        <h3 className="text-[#4B4B4B] font-bold">Features</h3>
          <ul className="mt-4 space-y-2 text-[14px]">
            <li className="hover:underline p-2 rounded-md transition">
              <Link href="/features/planning-ahead">Planning Ahead</Link>
            </li>
            <li className="hover:underline p-2 rounded-md transition">
              <Link href="/features/staying-under-budget">Stay Under Budget</Link>
            </li>
            {/* <li className="hover:underline p-2 rounded-md transition">
              <Link href="/features/grossaryplus">Grossary Plus</Link>
            </li> */}
          </ul>
        </div>

        {/* Company Section */}
        <div className="text-white">
        <h3 className="text-[#4B4B4B] font-bold">Company</h3>
          <ul className="mt-4 space-y-2 text-[14px]">
            <li className="hover:underline p-2 rounded-md transition">
              <Link href="/company/about">About</Link>
            </li>
            <li className="hover:underline p-2 rounded-md transition">
              <Link href="/company/blog">Blog</Link>
            </li>
            <li className="hover:underline p-2 rounded-md transition">
              <Link href="/company/help-center">Help Center</Link>
            </li>
          </ul>
        </div>

        {/* For Stores */}
        <div className="text-white">
          <h3 className=" font-bold text-[#4B4B4B]">Partners</h3>
          <ul className="mt-4 space-y-2">
            <li className="hover:underline p-2 rounded-md transition">
              <Link href="/for-grossary-stores">For Stores</Link>
            </li>
          </ul>
        </div>

        {/* Sign In + Legal */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <Link href="/signin">
              <SignInButton />
            </Link>
          </div>
          
        </div>
        
      </div>
      <div className="md:flex flex-row justify-between">
        <div className="flex flex-row gap-3">
        
        <Link href=''><Instagram/></Link>
        {/* <TikTok/> */}
        <Linkedin/>
        </div>
        

        <p className="text-sm text-gray-400">
            Copyright &copy; {new Date().getFullYear()} Grossary. All rights reserved.
          </p>
      </div>
     
    </footer>
  );
}

export default Footer;



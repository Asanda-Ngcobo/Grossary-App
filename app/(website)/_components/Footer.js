'use client'
import Link from "next/link";
import InstagramIcon from '@/public/icons8-instagram-96.png'
import TikTokIcon from '@/public/icons8-tiktok-96.png'
import LinkedInIcon from '@/public/icons8-linkedin-96.png'

import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-[#041527] shadow-lg px-6 py-10 align-bottom  ">
      <div className=" w-[80%] mx-[10%] grid gap-10 grid-cols-2
       lg:grid-cols-4 min-h-[40vh] items-center  ">
        {/* Features Section */}
        {/* <div className="text-white">
        <h3 className="text-[#4B4B4B] font-bold">Features</h3>
          <ul className="mt-4 space-y-2 text-[14px]">
            <li className="hover:underline p-2 rounded-md transition">
              <Link href="/features/planning-ahead">Planning Ahead</Link>
            </li>
            <li className="hover:underline p-2 rounded-md transition">
              <Link href="/features/staying-under-budget">Stay Under Budget</Link>
            </li>
            <li className="hover:underline p-2 rounded-md transition">
              <Link href="/features/grossaryplus">Grossary Plus</Link>
            </li>
          </ul>
        </div> */}

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
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li className="hover:underline p-2 rounded-md transition">
              <Link href="/terms">Terms of Service</Link>
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
        <div className="flex flex-col  justify-between space-y-6">
          {/* <div>
            <Link href="/account">
              <SignInButton />
            </Link>
          </div> */}
          
        </div>
        
      </div>
      <div className="md:flex flex-row justify-between">
        <div className="flex flex-row gap-3">
        
        <Link href='https://www.instagram.com/grossary.shop/'><Image src={InstagramIcon} width={50} alt="instagram icon"></Image></Link>
         <Link href='hhttps://www.tiktok.com/@grossary.shop'><Image src={TikTokIcon} width={50} alt="tiktok icon"></Image></Link>
          <Link href='https://www.linkedin.com/company/grossarydotshop/'><Image src={LinkedInIcon} width={50} alt="LinkedIn icon"></Image></Link>
        
        </div>
        

        <p className="text-sm text-gray-400">
            Copyright &copy; {new Date().getFullYear()}, Grossary. All rights reserved.
          </p>
      </div>
     
    </footer>
  );
}

export default Footer;



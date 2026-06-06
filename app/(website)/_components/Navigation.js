'use client'

import Link from "next/link"

import Logo from "./Logo";

import SignInButton from "./SignInButton";
import { Menu } from "@deemlol/next-icons";








export default function Navigation() {
 
 
    return (
        <div className="flex justify-between
         h-[80px] bg-white
 
        w-full
     
        items-center
        
       
      
        border-b
        border-b-gray-300 
       
        z-10
        fixed">

          <div className="w-[90%] mx-[5%] flex justify-between items-center">

            <Logo/>
         
            <div className="md:w-[10%] flex gap-4 justify-center items-center">
            <ul className=" flex lg:flex-row-reverse gap-10 list-none mx-3.5">
                
                {/* <li><Link href='/auth/signup'><SignUpButton>Sign Up</SignUpButton></Link></li> */}
                {/* <li className="lg:hidden"><Menu/></li> */}
                <li className=" lg:flex"><Link href='/account'>
                <SignInButton/></Link></li>
            </ul>
            {/* <div className="cursor-pointer"><Menu/></div> */}
            </div>
            
          </div>
        
        </div>
    )
}



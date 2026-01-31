import Link from "next/link"

import Logo from "./Logo";
import SignUpButton from "./SignUpButton";
import SignInButton from "./SignInButton";
import NavigationButtons from "./NavigationButtons"
import { DollarSign, FastForward, FileText, List, ShoppingBag, Tag } from "@deemlol/next-icons";








export default async function Navigation() {
 
 
    return (
        <div className="flex justify-between
         h-[100px] bg-white
 
        w-full
     
        items-center
        
       
      
        border-b
        border-b-gray-300 
       
        z-10
        fixed">
          <div className="w-[90%] mx-[5%] flex justify-between items-center">

            <Logo/>
         
         
             <ul className=" flex gap-10 list-none mx-3.5 ">
         
            <li className="relative hidden lg:flex group">
  <NavigationButtons>Features</NavigationButtons>
  <div className="absolute top-full mt-0 hidden group-hover:flex flex-row
   bg-white shadow-md p-2 rounded-2xl z-50
   w-[500px] h-fit border border-gray-300 cursor-pointer">
    <ul >
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl ">
        <Link href="/features/planning-ahead" >
        <span className="flex flex-row gap-2 w-[40px] h-[40px]
        justify-center items-center rounded-sm bg-amber-700">
          <FastForward width={20}/> </span>
          Plan Ahead
              <p className="text-xs text-gray-400">Add everything you need as you remember, from staples to treats.</p></Link>
  
      </li>
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl ">
        <Link href="/features/digital-slips" >
        <span className="flex flex-row gap-2 w-[40px] h-[40px]
        justify-center items-center rounded-sm bg-amber-700"><FileText width={20}/>
        </span>Never lose your Slips
        <p className="text-xs text-gray-400">Do not worry about keeping your slip, because grossary keeps them for you</p>
        </Link>
        
      </li>
      
    </ul>
    <ul>
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl  ">
        <Link href="/features/staying-under-budget">
        <span className="flex flex-row gap-2 w-[40px] h-[40px]
        justify-center items-center rounded-sm bg-amber-700"><DollarSign width={20}/> </span>
        Stay Within Budget
                <p className="text-xs text-gray-400">Grossary can help you stay within your budget without sacrificing essentials.</p>
        </Link>

      </li>
      {/* <li className="p-3 hover:bg-[#f1f0f0] rounded-xl">
        <Link href="/features/grossaryplus" ><span className="flex flex-row gap-2"><Tag/> Grossary Plus</span>
        <p className="text-xs text-gray-400 mx-2">  No more flipping through ClicFlyer or chasing random deals.</p>
        </Link>
         
      </li>  */}
    </ul>
    
  </div>
</li> 
<li className="relative hidden lg:flex group">
  <NavigationButtons>Company</NavigationButtons>
  <div className="absolute top-full mt-0 hidden group-hover:flex flex-col
   bg-white shadow-md p-2 rounded-md z-50
   w-[200px] h-auto border border-gray-300">
    <ul >
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl">
        <Link href="/company/about">About</Link>
      </li>
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl">
        <Link href="/company/blog">Blog</Link>
      </li>
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl">
        <Link href="/company/privacy-policy">Privacy Policy</Link>
      </li>

       <li className="p-3 hover:bg-[#f1f0f0] rounded-xl">
        <Link href="/company/terms">Terms of Service</Link>
      </li>
    </ul>
  </div>
</li>
      
            <li className="hidden lg:flex"><Link href='/for-grossary-stores'><button className="  h-[40px] rounded-[20px]
         text-black
         font-semibold
        cursor-pointer
         hover
         hover:bg-[#f1f0f0]
         min-w-[130px]">For Stores</button></Link></li>
            </ul> 
            <ul className=" flex lg:flex-row-reverse gap-10 list-none mx-3.5">
                
                {/* <li><Link href='/auth/signup'><SignUpButton>Sign Up</SignUpButton></Link></li> */}
                {/* <li className="lg:hidden"><Menu/></li> */}
                <li className=" lg:flex"><Link href='/account'>
                <SignInButton/></Link></li>
            </ul>
          </div>
        
        </div>
    )
}



import Link from "next/link"
import Menu from "./Menu";
import Logo from "./Logo";
import SignUpButton from "./SignUpButton";
import SignInButton from "./SignInButton";
import NavigationButtons from "./NavigationButtons"







export default async function Navigation() {
 
 
    return (
        <div className="flex justify-between
         h-[60px] bg-white
 
        w-[90%] ml-[5%]
        
        rounded-[20px]
        items-center
        mt-[5%]
        sm:mt-[2%]
        border
        border-gray-300 
        shadow-sm
        shadow-[#b6b5b5]
        z-10
        fixed">
        
            <Logo/>
         
         
            <ul className=" flex gap-10 list-none mx-3.5">
         
            <li className="relative hidden lg:flex group">
  <NavigationButtons>Features</NavigationButtons>
  <div className="absolute top-full mt-0 hidden group-hover:flex flex-col
   bg-white shadow-md p-2 rounded-md z-50
   w-[300px] h-[200px] border border-gray-300">
    <ul >
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl">
        <Link href="/features/planning-ahead">Planning Ahead</Link>
      </li>
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl">
        <Link href="/features/staying-under-budget">Staying under Budget</Link>
      </li>
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl">
        <Link href="/features/grossaryplus">Grossary Plus</Link>
      </li>
    </ul>
  </div>
</li>
<li className="relative hidden lg:flex group">
  <NavigationButtons>Company</NavigationButtons>
  <div className="absolute top-full mt-0 hidden group-hover:flex flex-col
   bg-white shadow-md p-2 rounded-md z-50
   w-[300px] h-[200px] border border-gray-300">
    <ul >
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl">
        <Link href="/company/about">About</Link>
      </li>
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl">
        <Link href="/company/blog">Blog</Link>
      </li>
      <li className="p-3 hover:bg-[#f1f0f0] rounded-xl">
        <Link href="/company/help-center">Help Center</Link>
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
            <ul className=" flex gap-10 list-none mx-3.5">
                <li className="hidden lg:flex"><Link href='/account'><SignInButton/></Link></li>
                <li><Link href='/signup'><SignUpButton>Sign Up</SignUpButton></Link></li>
                <li className="lg:hidden"><Menu/></li>
            </ul>
        </div>
    )
}



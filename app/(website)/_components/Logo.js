import { Quicksand } from "next/font/google";
import Link from "next/link";



const LogoFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});
function Logo() {
    return (
      <Link href='/' className={`${LogoFont.className}
       text-[24px] font-semibold ml-3.5 text-[#0B2E1E]`}>
        grossary<span className='text-[#1EC677]'>.</span></Link>
    
    )
}

export default Logo

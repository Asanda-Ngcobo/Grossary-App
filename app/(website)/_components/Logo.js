import { Quicksand } from "next/font/google";
import Link from "next/link";



const LogoFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});
function Logo() {
    return (
      <Link href='/' className={`${LogoFont.className} text-[24px] font-semibold ml-3.5`}>Grossary</Link>
    
    )
}

export default Logo

import Image from "next/image";
import HeroImage from '@/public/pexels-jack-sparrow-4198970.jpg'
import MainBunner from "./MainBunner";
import SignUpButton from "./SignUpButton";
import Link from "next/link";
function HomeImage() {
    return (
        <div className="h-[100vh]">
        <Image src={HeroImage} fill 
          
          className="object-cover -z-10 brightness-50"  alt="A Young Professional Grocery Shopping" />
           <MainBunner>   <h1 className={` text-[#A2B06D] text-[24px] `}>No Missed grocery Items, No Overspending.</h1>
            <p className="text-[16px] text-white">With Grossary, every item you plan for is tracked and
                 every cent you spend is accounted for. No more surprises at the till, just smart, intentional shopping that fits your budget.</p>
           <Link href='/signup'><SignUpButton><span className="px-10">Get Started</span></SignUpButton></Link></MainBunner>
          </div>
    )
}

export default HomeImage

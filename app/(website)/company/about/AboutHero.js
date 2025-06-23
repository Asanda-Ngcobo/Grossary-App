import Image from "next/image"
import HeroPic from '@/public/familty doing shopping.jpg'
import MainBunner from "../../_components/MainBunner"
import SignUpButton from "../../_components/SignUpButton"
import Link from "next/link"

function AboutHero() {
    return (
        <div className="h-[100vh]">
            <Image src={HeroPic} fill alt=""  className="object-cover -z-10 brightness-50"/>
            <MainBunner>   <h1 className={` text-[#A2B06D] text-[24px] `}>Our Mission</h1>
            <p className="text-[16px] text-white">To help people save time, money, and mental load by organizing their 
                grocery shopping around their real needs, budgets, and local store options.</p>
           <Link href='/signup'><SignUpButton><span className="px-10">Get Started</span></SignUpButton></Link></MainBunner>
          
        </div>
    )
}

export default AboutHero

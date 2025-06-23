import Link from "next/link"
import ForStoresHero from "./ForStoresHero"
import Carousel from "./Carousel"
import Image from "next/image"
import HeroPic from '@/public/grocery store.jpg'
import Receiving from '@/public/receiving.jpg'
import Accordion from "@/app/(website)/_components/Accordion"

import SignUpButton from "@/app/(website)/_components/SignUpButton"

function page() {
    return (
        <div>
            <ForStoresHero>
            <Image src={HeroPic}  alt=""  className="object-cover -z-10 brightness-50 h-[70vh]"/>
            <div className="absolute mt-[300px] w-[80%] ml-[10%] lg:w-[30%] lg:ml-[35%]">  
               <h1 className={` text-[#A2B06D] text-[24px] text-center `}>What is Grossary</h1>
            <p className="text-[16px] text-white">            Grossary is a smart grocery-listing and budgeting app that helps everyday shoppers manage their spending and shop more intentionally. But it’s more than just a tool for customers, 
            it’s an opportunity for retailers like you to boost visibility and grow sales.</p>
        </div>
            </ForStoresHero>
            
             <main className="max-w-4xl mx-auto px-4 py-12 text-gray-600">
      <section className="text-center mb-12">
      <h2 className="text-2xl font-semibold mb-2">Why Partner with Grossary</h2>
      <Carousel/>
      </section>

      

      

    </main>
    <section className="mb-12 text-center">
        <h2 className="text-2xl font-semibold mb-2">How to Join Our Retail Network</h2>
         <Accordion/>
      </section>
   
    <ForStoresHero>
    <Image src={Receiving}  alt=""  className="object-cover -z-10 brightness-50 h-[70vh]"/>
            <div className="absolute mt-[100px] w-[80%] ml-[10%] lg:w-[30%] lg:ml-[35%]">   <h1 className={` text-[#A2B06D] text-[24px] text-center `}>What You Get</h1>
            <ul className="text-[16px] text-white ">  
                <li className="py-6">A dedicated store profile on the Grossary app.
                </li>
                <li className="py-6">Access to high-intent shoppers ready to spend.
                </li>
                <li  className="py-6">Monthly insights & reports.</li>
                <li  className="py-6">A place on the smart recommendation engine.</li>     
                <li  className="py-6">An opportunity to support budget-conscious families and professionals.</li>       </ul>
        </div>
    </ForStoresHero>
    
    <section className="text-center text-gray-600 mb-2">
        <h2 className="text-xl font-semibold mb-4">Join our waiting list Today</h2>
        <p className="mb-6">Partnering with Grossary is simple — and free during our pilot program.</p>
          <SignUpButton>
          <Link href="/for-grossary-stores/retail-waiting-list"> <span className="flex flex-row px-6">Join &rarr;</span></Link> 
        </SignUpButton>
      
      </section>
        </div>
    )
}

export default page

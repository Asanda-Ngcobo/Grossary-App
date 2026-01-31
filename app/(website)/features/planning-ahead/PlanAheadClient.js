'use client'

import { Quicksand } from "next/font/google";
import Link from "next/link";
import SignUpButton from "../../_components/SignUpButton";
import Image from "next/image";
import Lists from '@/public/d8TqHBd5fuB (1).png'
import AddItems from '@/public/add items.jpeg'
import Reuse from '@/public/reuse lists.jpeg'
import { Plus, RotateCcw, Watch } from "@deemlol/next-icons";


const HeaderFont = Quicksand({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const content = [
  {
    id: 1,
    image: AddItems,
    heading: 'Add Items as You Remember',
    text: `You don’t always sit down and plan a full grocery list. With Grossary, you can add items as they come to mind — whether you’re in res, at home, or on campus. From basics like bread, rice,
     and toiletries to small treats, everything stays in one place.` ,
    icon: <Plus/>
  },

    {
    id: 2,
      image: Reuse,
    heading: 'Re-use Your Old Lists with a Single Tap',
    text: `Most of us buy the same groceries every month. With that in mind, Grossary lets you re-use your previous lists with just one tap 
    saving you time and helping you plan faster without starting from scratch.` ,
    icon: <RotateCcw/>
  },
    
]
function PlanAheadClient() {
    return (
          <>
      <section className="h-[100vh] text-white relative  overflow-hidden">


      <div className=" pt-[70%] lg:pt-[15%]
       relative z-1 w-[90%] mx-auto"><h1 className={` text-[24px] font-semibold text-left
         pb-2 sm:text-[36px] sm:font-medium ${HeaderFont.className}  `}>
            Plan Ahead with Lists</h1>
            <p className=" lg:w-[30%] text-[18px] py-5">
             When money is tight, planning ahead matters. Grossary helps you stay organised,
              stretch your budget, and shop smarter especially when every rand counts</p>
        
           <Link href='/auth/signup'>
           <SignUpButton><span className="px-10">Get Started</span>
           </SignUpButton></Link>
        </div>
        
             <Image
                  src={Lists}
                  fill
                  alt=""
                  className="object-cover -z-10 brightness-30  lg:block"
                />

        
         
     
    
        </section>
 {content.map(function(cont){
          return <div 
           key={cont.id}
           className={`flex ${cont.id === 2 ? 'flex-row-reverse':
            'flex-row'
          }
        py-10 w-[80%] mx-auto h-fit justify-between items-center`}
        >
          <Image src={cont.image} alt=""
          className="rounded-2xl w-[150px] lg:w-[300px]"/>
         <div className="w-[50%]">
          <div className="flex flex-row gap-3 justify-center items-center">
             <div className="bg-amber-700
             hidden lg:flex justify-center items-center
             w-10 h-10
            lg:w-15 lg:h-15 rounded-lg">
              <div className="w-6">
                {cont.icon}
                
              </div>
            </div>
             <h1 className={` lg:text-[24px] font-semibold text-center
         pb-2 sm:text-[16px] sm:font-medium ${HeaderFont.className}  `}>
         
           {cont.heading}</h1>
           </div>
            <p className="  text-[10px] lg:text-[18px] py-5 text-center">
              {cont.text}
            </p>

        
         </div>
            
          </div>
        })}
        
     </>
    )
}

export default PlanAheadClient

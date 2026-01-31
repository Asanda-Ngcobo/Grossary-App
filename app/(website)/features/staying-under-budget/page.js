import Link from "next/link"

import SignUpButton from "../../_components/SignUpButton"
import Image from "next/image"
import { Quicksand } from "next/font/google"
import KeepTrack from '@/public/Keep Track.png'
import OldLists from '@/public/d8TqHBd5fuB (2).png'
import Categories from '@/public/categories.jpeg'
import Navigate from '@/public/dropdown list.jpeg'
import { ChevronDown, ChevronUp, Circle, Navigation, Watch } from "@deemlol/next-icons"


const HeaderFont = Quicksand({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const content = [
  {
    id: 1,
    image: KeepTrack,
    heading: 'Track Spending',
    text: `Add Prices as you shop to keep track of your spending in real-time
        to avoid till surprises, asking for void or going over your budget.` ,
    icon: [<Circle/>, '']
  },

    {
    id: 2,
      image: Navigate,
    heading: 'Navigate The Store Better',
    text: `Stores are designed to encourage impulse buying. Grossary organises your items by store aisle, so you know exactly where to go and what to grab.` ,
    icon: [<Navigation/>, '']
  },
    {
    id: 3,
      image: Categories,
    heading: 'Use Categories Dropdown List',
    text: `Select an aisle from the dropdown to
     bring the relevant items to the top of your list.` ,
    icon: [<ChevronUp/>, <ChevronDown/>]
  },
]
function page() {
    return (
              <>
      <section className="h-[100vh] text-white relative  overflow-hidden">
      
      <div className=" pt-[100%] lg:pt-[15%]
       relative z-1 w-[90%] mx-auto">
        <h1 className={` text-[24px] font-semibold text-left
         pb-2 sm:text-[36px] sm:font-medium ${HeaderFont.className}  `}>
            Stay Within Your Budget</h1>
            <p className=" w-[30%] text-[18px] py-5">
          Avoid any till surprises and stay under bugdet with grossary</p>
        
           <Link href='/auth/signup'>
           <SignUpButton><span className="px-10">Get Started</span>
           </SignUpButton></Link>
        </div>
        
             <Image
                  src={OldLists}
                  fill
                  alt=""
                  className="object-cover -z-10 brightness-30  lg:block"
                />

        
         
     
    
        </section>

        {content.map(function(cont){
          return <div className={`flex ${cont.id === 2 ? 'flex-row-reverse':
            'flex-row'
          }
        py-10 w-[80%] mx-auto h-fit justify-between items-center`}
         key={cont.id}>
          <Image src={cont.image} alt=""
          className="rounded-2xl w-[150px] lg:w-[300px]"/>
         <div className="w-[50%]">
          <div className="flex flex-row gap-3 justify-center items-center">
             <div className="bg-amber-700
             hidden lg:flex justify-center items-center
             w-10 h-10
            lg:w-15 lg:h-15 rounded-lg">
              <div>
                {cont.icon[0]}
                {cont.icon[1]}
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

export default page

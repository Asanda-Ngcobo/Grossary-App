'use client'
import {ChevronLeft, X } from "@deemlol/next-icons"
import Link from "next/link"
export default function ParentFormBackground({children, openform}) {
    return (
         <main className="bg-[#04284B]
          w-screen h-[150vh] z-20 top-0 bottom-0 absolute left-0 transition-all
           duration-500
           overflow-x-hidden" >

                   <button className="bg-white
            cursor-pointer active:bg-gray-600
             text-black rounded-full w-10 h-10 mt-8 ml-4
              flex items-center justify-center"
              onClick={openform}>
                <Link href={`/account`}>
    <X color="black" size={30}/>
      </Link>
              
            </button>
           
            <section>
                     
               {children}
        
            </section>
        </main>
    )
}


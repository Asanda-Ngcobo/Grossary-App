'use client'
import {X } from "@deemlol/next-icons"
export default function ParentFormBackground({children, openform}) {
    return (
         <main className="bg-[#04284B]
          w-screen h-[150vh] z-20 top-0 bottom-0 absolute left-0 transition-all
           duration-500" >
              <button
               className="my-5 mx-[5%]
                active:bg-gray-600 rounded-full w-[50px]
                 h-[50px] flex justify-center items-center" onClick={openform}> 
           <X color="black" size={40}/> </button>
            <section>
                     
               {children}
        
            </section>
        </main>
    )
}


'use client'


import {ChevronLeft, X } from "@deemlol/next-icons"
export default function ParentFormBackground({children, openform}) {
    return (
         <main className="backdrop-blur-sm
          w-screen h-screen z-20 top-0 bottom-0 absolute left-0 transition-all
           duration-500
           overflow-x-hidden" >

              
           
            <section>
           
           

          
         
                     
               {children}
        
            </section>
        </main>
    )
}


'use client'


import {ChevronLeft, X } from "@deemlol/next-icons"
export default function ParentFormBackground({children, openform}) {
    return (
         <main className="backdrop-blur-sm fixed
          w-screen h-full z-20  bottom-0 left-0 
          transition-all
           duration-500
           overflow-x-hidden 
            flex justify-center items-center" >

              
           
            <section>
           
           

          
         
                     
               {children}
        
            </section>
        </main>
    )
}


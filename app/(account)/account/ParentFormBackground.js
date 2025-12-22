'use client'


import {ChevronLeft, X } from "@deemlol/next-icons"
export default function ParentFormBackground({children, openform}) {
    return (
         <main className="backdrop-blur-sm
          w-screen h-[150vh] z-20 top-0 bottom-0 absolute left-0 transition-all
           duration-500
           overflow-x-hidden" >

              
           
            <section>
           
                              <button className="
            cursor-pointer bg-gray-600
             text-black rounded-full w-10 h-10 mt-[25%] ml-[45%]
              flex items-center justify-center absolute"
              onClick={()=> openform()}
              >
                
    <X color="black" size={30} className=""/>
    
              
            </button>

          
         
                     
               {children}
        
            </section>
        </main>
    )
}


import { ChevronLeft } from "@deemlol/next-icons"
import Link from "next/link"
import { Suspense } from "react"
import Loading from "./loading"


function page() {
    return (
        <Suspense fallback={<Loading/>}>
             <div  className="grid justify-between items-center 
            mx-3 lg:w-[60%] lg:ml-[15%] py-7">

                   {/* <div className="my-5 mx-[5%] bg-white rounded-full
                    w-[40px] h-[40px] flex justify-center 
                    items-center lg:hidden"> 
            <Link href='/account'><ChevronLeft color="black" size={30}/></Link> </div> */}

            <h1 className="text-[#8F8C8C] font-semibold text-[24px]">Reports</h1>
            <div className="flex justify-center items-center">
  <p className="text-5xl">Coming Soon!!</p>
            </div>
          
        </div>
        </Suspense>
       
    )
}

export default page

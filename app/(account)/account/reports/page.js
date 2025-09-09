
import { Suspense } from "react"
import Loading from "./loading"

export const metadata = {
  title: "Reports | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};
function page() {
    return (
        <Suspense fallback={<Loading/>}>
             <div  className="grid justify-between items-center 
            mx-3 lg:w-[60%] lg:ml-[15%] py-7">

                
            <h1 className="text-[#8F8C8C] font-semibold text-[24px]">Reports</h1>
            <div className="flex justify-center items-center">
  <p className="text-5xl">Coming Soon!!</p>
            </div>
          
        </div>
        </Suspense>
       
    )
}

export default page

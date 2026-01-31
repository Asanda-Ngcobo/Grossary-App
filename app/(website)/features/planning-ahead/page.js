import { Suspense } from "react"
import Loading from "../../loading"
import PlanAheadClient from "./PlanAheadClient"

function page() {
    return (
      <Suspense fallback={<Loading/>}>
        <PlanAheadClient/>
      </Suspense>
    
         
      
    )
}

export default page

import { Suspense } from "react"
import AddListForm from "./AddListForm"
import Loading from "../loading"





function page() {
   
    return <Suspense fallback={<Loading/>}>
        <AddListForm/>
    </Suspense>
}

export default page

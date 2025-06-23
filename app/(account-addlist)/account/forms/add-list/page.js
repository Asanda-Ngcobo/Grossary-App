import { Suspense } from "react"
import AddListForm from "./AddListForm"
import ListAnimation from "@/app/(account)/_ui/ListAnimation"


function page() {
   
    return <Suspense fallback={<ListAnimation/>}>
        <AddListForm/>
    </Suspense>
}

export default page

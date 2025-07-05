import { Suspense } from "react"
import Slip from "./Slip"
import { getList, getListsItemsById } from "@/app/_lib/data-services"
import Loading from "../add-item/loading"


async function Page({params}) {
     const {listId} = await params
     const list = await getList(listId)
     const listitems = await getListsItemsById(listId)
    
    return (
       <Suspense fallback={<Loading/>}>
        <Slip list={list}
        listItems={listitems}
        listId={listId}/>

       </Suspense>
    )
}

export default Page

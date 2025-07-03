import { Suspense } from "react"
import Slip from "./Slip"
import { getList, getListItemById, getListsItemsById } from "@/app/_lib/data-services"

async function page({params}) {
     const {listId} = await params
     const list = await getList(listId)
     const listitems = await getListsItemsById(listId)
     console.log(list)
     console.log(listitems)
    return (
       <Suspense >
        <Slip list={list}
        listItems={listitems}
        listId={listId}/>

       </Suspense>
    )
}

export default page

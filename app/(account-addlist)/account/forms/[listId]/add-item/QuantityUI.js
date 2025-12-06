'use client'
import SpinnerMini from "@/app/(website)/_components/SpinnerMini"
import DecreaseQuantity from "../_listcomponents/DecreaseQuantity"
import DeleteItem from "../_listcomponents/DeleteItem"
import IncreaseQuantity from "../_listcomponents/IncreaseQuantity"
import Link from "next/link"
import { ShoppingCart } from "@deemlol/next-icons"
import { useFormStatus } from "react-dom"

function QuantityUI({itemId, listId,item_quantity }) {
    const {pending} = useFormStatus();

    return (
            <form className="flex items-center gap-4 justify-between">
                    <div className=" flex flex-row w-[30%] justify-between">
 <div >
                      {item_quantity > 1 ? <DecreaseQuantity 
                       listId={listId} /> : <DeleteItem itemId={itemId} listId={listId} />}
                    </div>
                    <span className="font-bold text-lg">  {pending ? <SpinnerMini/> : <p>{item_quantity}</p>}</span>
                   <IncreaseQuantity itemId={itemId} listId={listId} />
                    </div>
             
    {/* ... other item details ... */}
    <Link href={`/account/forms/${listId}/add-price/${itemId}`}>
      <ShoppingCart color="#A2B06D"/>
    </Link>
 


                  </form>
    )
}

export default QuantityUI

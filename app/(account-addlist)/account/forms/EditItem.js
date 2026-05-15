'use client'
import Link from "next/link"
import DeleteItem from "./[listId]/_listcomponents/DeleteItem"
import { X } from "@deemlol/next-icons";
import { useEffect, useState } from "react";

function EditItem({itemId, listId, itemName,
    itemBrand,
    itemMass,
    itemUnit,
    openform
}) {

    return (
         <div className='flex flex-col gap-3 justify-center items-center w-fit px-10 mx-auto
         h-[40vh] rounded-2xl bg-white'>
           <button
  type="button"
  className="text-left"
  onClick={openform}
>
                <X/></button>
            <div>
                          <h2 className="text-2xl"> Edit {itemName} {itemBrand} {itemMass}{itemUnit}</h2></div>
                          <div className="w-fit flex flex-col gap-4">
                          <Link
  href={`/account/forms/${listId}/edit-item/${itemId}`}
  className="
    h-10 min-w-[300px] px-2
    active:bg-gray-600
    bg-[#1EC677]
    cursor-pointer
    rounded-lg
    text-[#04284B]
    font-semibold
    hover:bg-[#041527]
    transition-colors
    flex items-center justify-center
  "
>
  Edit Name or Units
</Link>
    <DeleteItem itemId={itemId} listId={listId}
    openform={openform} />
                              
                          </div>
                              
                           
                            
                          </div>
    )
}

export default EditItem

'use client';
import { ShoppingBag } from "@deemlol/next-icons";
import DeleteModal from "../account/lists/DeleteModal";
import { useState } from "react";
import Link from "next/link";


function List({ list, onDelete, allitems }) {
  const { id, list_name } = list;
  const listitems = allitems.filter((item)=>
  item.list_id === list.id)
  
const unShoppedItems = listitems.filter((item)=>
item.total_price === null)

const shoppedItems = listitems.filter((item)=>
item.total_price !== null)

const ListMoneySpent = shoppedItems.reduce((acc, cur)=>
acc + (cur.total_price|| 0), 0)
  
   const [isOpenModal, setIsOpenModal] = useState(false)
   function handleModal(){
    setIsOpenModal((isOpenModal) => !isOpenModal)
   }

  return (
    <main className="lg:w-[90%] lg:ml-[5%] bg-white shadow rounded-lg  ">
<li className="  my-4 py-3 
 px-2 flex items-center active:mx-5   ">
      {/* Left: Icon */}
     
       <Link  href={`/account/forms/${id}`} className="w-full   text-black flex justify-between items-center">
       <div className="flex gap-2">
    
          {/* Middle: Info */}
      <div className="flex flex-col">
        <h1 className="font-bold text-2xl">{list_name}</h1>
         <h5 className="text-md text-gray-400 ">{unShoppedItems.length} of {listitems.length} items still to shop</h5>
         
      </div>
       </div>
      {ListMoneySpent !== 0 && (
          <div className="flex flex-col">
        <span className="text-[#ACF532] font-extrabold text-xl">R{ListMoneySpent}</span>
     <span className="text-md text-gray-400">Current Total</span>
      </div>
       )}
    
     </Link> 
      {/* Right: Money Spent */}
     
    </li>

    {/* Delete List Modal */}
    {isOpenModal && <DeleteModal listId={id} 
    onDelete={onDelete}
    handleModal={handleModal}
    listname={list_name}
    />}
    </main>
    
  );
}

export default List;

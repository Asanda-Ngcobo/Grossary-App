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
    <main className="lg:w-[90%] lg:ml-[5%]  ">
<li className="  my-4 py-3  px-2 flex items-center active:mx-5   ">
      {/* Left: Icon */}
     
       <Link  href={`/account/forms/${id}`} className="w-full   text-white flex justify-between items-center">
       <div className="flex gap-2">
    <div className=" w-[40px] h-[40px] bg-[#e7eeea] rounded-full flex justify-center items-center">
          <ShoppingBag color="#8F8C8C" />
        </div>
          {/* Middle: Info */}
      <div className="flex flex-col">
        <h1 className="font-bold text-base">{list_name}</h1>
         <h5 className="text-xs text-gray-400">{unShoppedItems.length} of {listitems.length} left</h5>
         
      </div>
       </div>
   
      <div className="flex flex-col">
        <span className="text-[#ACF532] font-extrabold">R{ListMoneySpent}</span>
        <span className="text-[10px] text-gray-400">Current Total</span>
      </div>
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

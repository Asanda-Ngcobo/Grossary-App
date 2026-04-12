'use client';
import { ShoppingBag } from "@deemlol/next-icons";
import DeleteModal from "../account/lists/DeleteModal";
import { useState } from "react";
import Link from "next/link";


function List({ list, onDelete, allitems }) {
  const { id, list_name, created_at } = list;
  const listitems = allitems.filter((item)=>
  item.list_id === list.id)
  
const unShoppedItems = listitems.filter((item)=>
item.total_price === null)

const shoppedItems = listitems.filter((item)=>
item.total_price !== null)

const ListMoneySpent = shoppedItems.reduce((acc, cur)=>
acc + (cur.total_price|| 0), 0)

const shoppedPercentage = (Number(shoppedItems.length/listitems.length)) * 100 || 0;
  
   const [isOpenModal, setIsOpenModal] = useState(false)
   function handleModal(){
    setIsOpenModal((isOpenModal) => !isOpenModal)
   }
 const date = new Date(created_at);
    const key = date.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <main className="lg:w-[90%] lg:ml-[5%] bg-white shadow rounded-2xl  ">
<li className="  my-4 py-3 
 px-2 flex items-center active:mx-5   ">
      {/* Left: Icon */}
     
     <Link
  href={`/account/forms/${id}`}
  className="w-full bg-white rounded-2xl shadow-md p-4 flex flex-col gap-3 active:scale-[0.98] transition"
>
  {/* Top Row */}
  <div className="flex justify-between items-start">
    <h1 className="font-bold text-lg">{list_name}</h1>

    <span className="text-xs text-gray-400">
      {key}
    </span>
  </div>

  {/* Progress Section */}
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">Shopping Progress</span>
      <span
        className={`text-xs font-semibold px-2 py-1 rounded-full
          ${shoppedPercentage < 30 && "bg-red-100 text-red-600"}
          ${shoppedPercentage >= 30 && shoppedPercentage < 60 && "bg-yellow-100 text-yellow-700"}
          ${shoppedPercentage >= 60 && "bg-green-100 text-green-700"}
        `}
      >
        {shoppedPercentage}%
      </span>
    </div>

    {/* Progress Bar */}
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all
          ${shoppedPercentage < 30 && "bg-red-400"}
          ${shoppedPercentage >= 30 && shoppedPercentage < 60 && "bg-yellow-400"}
          ${shoppedPercentage >= 60 && "bg-green-500"}
        `}
        style={{ width: `${shoppedPercentage}%` }}
      />
    </div>
  </div>

  {/* Bottom Row */}
  <div className="flex justify-between items-end">
    {/* Money */}
    {ListMoneySpent !== 0 ? (
      <div className="flex flex-col">
        <span className="text-lg font-bold text-green-500">
          R{ListMoneySpent}
        </span>
        <span className="text-xs text-gray-400">Total spent</span>
      </div>
    ) : (
      <span className="text-xs text-gray-400">
        No spending yet
      </span>
    )}

    {/* Optional future: items count */}
    
    <span className="text-xs text-gray-400">
      {unShoppedItems.length} left
    </span> 
   
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

'use client';
import { ShoppingBag } from "@deemlol/next-icons";
import EditList from "./EditList";
import DeleteList from "./DeleteList";
import DeleteModal from "../account/lists/DeleteModal";
import { useState } from "react";


function List({ list, onDelete }) {
  const { id, list_name } = list;
   const [isOpenModal, setIsOpenModal] = useState(false)
   function handleModal(){
    setIsOpenModal((isOpenModal) => !isOpenModal)
   }

  return (
    <main>
<li className="border-b border-b-[#8F8C8C] py-4 px-2 flex items-center gap-4">
      {/* Left: Icon */}
      <div className="w-[60px] flex justify-center items-center">
        <div className="bg-[#E2F3F4] w-[50px] h-[50px] rounded-full flex justify-center items-center">
          <ShoppingBag color="#8F8C8C" />
        </div>
      </div>

      {/* Middle: Info */}
      <div className="flex-1">
        <h1 className="font-bold text-base">{list_name}</h1>
        
      </div>

      {/* Right: Buttons */}
      <div className="flex gap-2">
        <EditList id={id} />
        <DeleteList handleModal={handleModal}/>
      </div>
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

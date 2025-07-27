'use client'
import { deleteItem } from "@/app/_lib/actions"
import {  Trash2 } from "@deemlol/next-icons"
import toast from "react-hot-toast";


function DeleteItem({ itemId, listId }) {
 
  async function handleClick() {
    try {
      await deleteItem(itemId, listId);
    } catch (error) {
      toast.error( error,
        {
          duration: 5000,
          style: {
            background: '#041527',
            color: '#fff',
          },
        }
      );
    }
  }

  return (
    <button onClick={handleClick} className="cursor-pointer">
    <Trash2 />
    </button>
  );
}

export default DeleteItem;

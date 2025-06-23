'use client'
import { deleteItem } from "@/app/_lib/actions"
import {  Trash2 } from "@deemlol/next-icons"


function DeleteItem({ itemId, listId }) {
 
  async function handleClick() {
    try {
      await deleteItem(itemId, listId);
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  }

  return (
    <button onClick={handleClick} className="cursor-pointer">
    <Trash2 />
    </button>
  );
}

export default DeleteItem;

'use client'
import { decreaseQuantity } from "@/app/_lib/actions"
import { Minus, Plus } from "@deemlol/next-icons"

function DecreaseQuantity({ itemId, listId }) {
  async function handleClick() {
    try {
      await decreaseQuantity(itemId, listId);
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  }

  return (
    <button onClick={handleClick}  className="cursor-pointer">
      <Minus />
    </button>
  );
}

export default DecreaseQuantity;

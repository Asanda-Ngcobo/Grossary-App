'use client';

import { increaseQuantity } from "@/app/_lib/actions";
import { Plus } from "@deemlol/next-icons";
import toast from "react-hot-toast";

function IncreaseQuantity({ itemId, itemName, itemQuantity, listId }) {
  async function handleClick() {
    try {
      const results = await increaseQuantity(itemId, listId);
      if (results.success) {
        toast.success(
          `${itemName} increased to ${itemQuantity}`,
          {
            duration: 5000,
            style: {
              background: '#041527',
              color: '#fff',
            },
          }
        );
      } else {
        toast.error(
          results.message || "Failed to increase quantity.",
          {
            duration: 5000,
            style: {
              background: '#041527',
              color: '#fff',
            },
          }
        );
      }
    } catch (error) {
      toast.error(
        "An error occurred while increasing quantity.",
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
      <Plus />
    </button>
  );
}

export default IncreaseQuantity;

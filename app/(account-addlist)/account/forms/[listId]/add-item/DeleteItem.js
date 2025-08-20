'use client'
import { deleteItem } from "@/app/_lib/actions"
import { Trash2 } from "@deemlol/next-icons"
import toast from "react-hot-toast";

function DeleteItem({ itemId, listId }) {
  async function handleClick() {
    try {
      const result = await deleteItem(itemId, listId);

      if (result.success) {
        toast.success("Item deleted successfully.", {
          duration: 4000,
          style: {
            background: '#041527',
            color: '#fff',
          },
        });
      } else {
        toast.error(result.message || "Failed to delete item.", {
          duration: 4000,
          style: {
            background: '#041527',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      toast.error("An error occurred while deleting item.", {
        duration: 4000,
        style: {
          background: '#041527',
          color: '#fff',
        },
      });
    }
  }

  return (
    <button onClick={handleClick} className="cursor-pointer">
      <Trash2 className="text-gray-500" />
    </button>
  );
}

export default DeleteItem;

"use client";

import { deleteItem } from "@/app/_lib/actions";
import { Trash2 } from "@deemlol/next-icons";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

function DeleteItem({ itemId, listId, openform }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);

      const result = await deleteItem(itemId, listId);

      console.log(result);

      if (result.success) {
        toast.success("Item deleted successfully.", {
          duration: 4000,
          style: {
            background: '#0B2E1E',
            color: '#fff',
            zIndex: 30,
            padding: '20px'
          },
        });

        // Refresh page data
        router.refresh();
      } else {
        toast.error(
          result.message || "Failed to delete item.",
          {
            duration: 4000,
            style: {
             background: '#0B2E1E',
            color: '#fff',
            zIndex: 30,
            padding: '20px'
            },
          }
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "An error occurred while deleting item.",
        {
          duration: 4000,
          style: {
          background: '#0B2E1E',
            color: '#fff',
            zIndex: 30,
            padding: '20px'
          },
        }
      );
    } finally {
      setLoading(false);
      openform()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="
        h-10 min-w-[300px] px-2
        active:bg-gray-600
        bg-[#E2F3F4]
        cursor-pointer
        rounded-lg
        text-[#04284B]
        font-semibold
        hover:bg-[#041527]
        transition-colors
        flex items-center justify-center gap-2
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {loading ? (
        <>
          <div
            className="
              w-4 h-4
              border-2 border-[#04284B]
              border-t-transparent
              rounded-full
              animate-spin
            "
          />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 size={18} />
          Delete Item
        </>
      )}
    </button>
  );
}

export default DeleteItem;
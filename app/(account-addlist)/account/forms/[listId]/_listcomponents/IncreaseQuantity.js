'use client';

import { updateQuantity } from "@/app/_lib/actions";
import toast from "react-hot-toast";

function QuantitySelector({ itemId, itemName, itemQuantity, listId }) {
  async function handleChange(e) {
    const newQuantity = parseInt(e.target.value);

    try {
      const results = await updateQuantity(itemId, listId, newQuantity);
      if (results.success) {
        toast.success(
          `${itemName} quantity set to ${newQuantity}`,
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
          results.message || "Failed to update quantity.",
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
        "An error occurred while updating quantity.",
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
    <select
      onChange={handleChange}
      defaultValue={itemQuantity}
      className="cursor-pointer 
       px-2 py-1 bg-[#04284B] text-white font-bold"
    >
      {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
        <option key={num} value={num}>
          {num}
        </option>
      ))}
    </select>
  );
}

export default QuantitySelector;

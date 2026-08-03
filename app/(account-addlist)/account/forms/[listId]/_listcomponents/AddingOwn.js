'use client'

import { addItem } from "@/app/_lib/actions";
import AddItemButton from "../_listcomponents/AddItemButton";
import { startTransition, useState } from "react";
import toast from "react-hot-toast";

function AddingOwn({search, listId, setSearch}) {

    const [selectedNumber, setSelectedNumber] = useState("");
      const [selectedUnit, setSelectedUnit] = useState("");
      
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
      /* -------------------- Submit -------------------- */
  async function handleSubmit(formData) {
    startTransition(async () => {
      try {
        const result = await addItem(formData, listId);

        if (result?.success) {
          toast.success(
            <p className="text-sm text-[#ACF532]">
              {search} {selectedNumber}
              {selectedUnit}
              <span className="px-1 text-white">added to</span>
              {selectedCategory || "Uncategorized"}
            </p>,
            {
              duration: 4000,
              style: { background: "#0B2E1E", color: "#fff" },
            }
          );

          setSearch("");
          setSelectedCategory("");
          setSelectedBrand("");
          setSelectedNumber("");
          setSelectedUnit("");
        }
      } catch {
        toast.error(error.message, {
          style: { background: "#041527", color: "#fff" },
        });
      }
    });
  }

//     const handleSuggestionClick = (item) => {
//     setActiveItemId(item.id);
//     setQuery(item.item_name ?? "");
//     setSelectedCategory(item.item_category ?? "Uncategorized");
//     setSelectedBrand(item.item_brand ?? "");
//     setSelectedNumber(item.item_volume_mass ?? "");
//     setSelectedUnit(item.item_unit ?? "");
//   };
    return (
        <div className="  left-0 right-0 bottom-0 top-10
         w-full h-[50vh] z-50">
             <form
          action={handleSubmit}
          className="h-full p-6 flex flex-col"
        >
<input
    type="hidden"
    name="item_name"
    value={search}
/>
          
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="item_volume_mass"
                  value={selectedNumber}
                  onChange={(e) => setSelectedNumber(e.target.value)}
                  placeholder="Size"
                  required
                  className="rounded-lg p-2 bg-gray-100"
                />

                <select
                  name="item_unit"
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  required
                  className="rounded-lg p-2 bg-gray-100"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="L">L</option>
                  <option value="Pack">Pack</option>
                  <option value="Unit">Unit</option>
                </select>
              </div>
         {search && (
                   <div className="pt-4">
                     <AddItemButton selectedCategory={selectedCategory}>
                       Confirm
                     </AddItemButton>
                   </div>
                 )}
         {/* Hidden Fields */}
          <input type="hidden" name="item_category" value={selectedCategory} />
          <input type="hidden" name="item_brand" value={selectedBrand} />
          <input type="hidden" name="item_quantity" value={1} />
          <input type="hidden" name="item_volume_mass" value={selectedNumber} />
          <input type="hidden" name="item_unit" value={selectedUnit} />
        </form>
        </div>
    )
}

export default AddingOwn

"use client";

import { useState, useEffect } from "react";

 

export default function AddItemPage() {
  const [itemName, setItemName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [category, setCategory] = useState("");
  

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (itemName.length < 2) {
        setSuggestions([]);
        return;
      }


    };

    fetchSuggestions();
  }, [itemName]);

  const handleSelectSuggestion = (item) => {
    setItemName(item.item_name);
    setCategory(item.item_category || "");
    setSuggestions([]);
  };


  return (
    <form className="p-4 max-w-md mx-auto mt-10 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Add Item</h1>

      {/* Item Name Input + Suggestions */}
      <div className="relative">
        <input
          type="text"
          placeholder="Item name"
          className="border p-2 rounded w-full mb-2"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-[7s0px] overflow-y-auto">
            {suggestions.map((item) => (
              <li
                key={item.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSuggestion(item)}
              >
                {item.item_name} <span className="text-gray-400">({item.item_category})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Category (Auto-filled) */}
      <input
        type="text"
        placeholder="Category"
        className="border p-2 rounded w-full mb-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />


      <button type="submit" className="bg-[#A2B06D] text-white px-4 py-2 rounded w-full">
        Add Item
      </button>
    </form>
  );
}

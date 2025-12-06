"use client";

import { useState, useEffect, startTransition } from "react";
import { createClient } from "@supabase/supabase-js";
import { updateItem } from "@/app/_lib/actions";
import { ChevronLeft } from "@deemlol/next-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AddItemButton from "../../_listcomponents/AddItemButton";


export default function EditItemForm({ listId, itemid }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const router = useRouter();

  // ✅ Supabase client
  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  // ✅ Fetch existing item details
  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from("list_items")
        .select("*")
        .eq("id", itemid)
        .single();

      if (!error && data) {
        setQuery(data.item_name || "");
        setSelectedCategory(data.item_category || "Uncategorized");
        setSelectedBrand(data.item_brand || "");
        setSelectedNumber(data.item_volume_mass || "");
        setSelectedUnit(data.item_unit || "");
      }
    };
    fetchItem();
  }, [itemid, supabase]);

  // ✅ Autocomplete search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      const { data, error } = await supabase
        .from("grocery_items")
        .select("*")
        .ilike("item_name", `${query}%`)
        .limit(5);

      if (!error) setSuggestions(data || []);
    };

    fetchSuggestions();
  }, [query, supabase]);

  const handleSuggestionClick = (item) => {
    setQuery(item.item_name ?? "");
    setSelectedCategory(item.item_category ?? "Uncategorized");
    setSelectedBrand(item.item_brand ?? "");
    setSelectedNumber(item.item_volume_mass ?? "");
    setSelectedUnit(item.item_unit ?? "");
    setSuggestions([]);
  };

  async function handleSubmit(formData) {
    startTransition(async () => {
      try {
        const result = await updateItem(formData, itemid, listId);

        if (result.success) {
          toast.success(
            <p>
              Item updated at <span className="font-bold text-green-400">{selectedCategory || "Uncategorized"}</span>
            </p>,
            {
              duration: 5000,
              style: { background: "#041527", color: "#fff" },
            }
          );

          setTimeout(() => {
            router.push(`/account/forms/${listId}`);
          }, 2000);
        }
      } catch (error) {
        toast.error("Something went wrong, check your connection!", {
          duration: 5000,
          style: { background: "#041527", color: "#fff" },
        });
      }
    });
  }

  return (
    <main>
      {/* Back Button */}
      <button className="my-5 mx-[5%] bg-white active:bg-gray-600 rounded-full w-[50px] h-[50px] flex justify-center items-center">
        <Link href={`/account/forms/${listId}`}>
          <ChevronLeft color="black" size={40} />
        </Link>
      </button>

      <form action={handleSubmit}>
        <div className="py-2 px-4 rounded-md w-[90%] mt-[2%] ml-[5%] md:w-[40%] md:ml-[25%] lg:w-[40%] lg:ml-[30%] grid gap-2 bg-[#041527] shadow-sm">
          <label htmlFor="name" className="text-2xl text-center">
            Edit Item
          </label>

          {/* Item name */}
          <input
            type="text"
            name="item_name"
            placeholder="Item Name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            autoComplete="on"
            className="bg-white text-black text-2xl p-3 rounded-4xl w-full"
          />

          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute bg-[#041527] border text-white shadow-xl w-[80%] z-10 rounded mt-[35%] overflow-y-auto lg:mt-[15%] lg:w-[40%]">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-3 py-2 hover:bg-gray-100 hover:text-[#041527] cursor-pointer"
                >
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <h1>{item.item_name}</h1>
                      <h1>{item.item_brand}</h1>
                    </div>
                    <div>
                      {item.item_volume_mass}
                      {item.item_unit}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Hidden fields (still updateable) */}
        <input type="text" name="item_category" value={selectedCategory} readOnly hidden />
        <input type="text" name="item_brand" value={selectedBrand} readOnly hidden />
        <input type="number" name="item_quantity" value={1} readOnly hidden />
        <input type="number" name="item_volume_mass" value={selectedNumber} readOnly hidden />
        <input type="text" name="item_unit" value={selectedUnit} readOnly hidden />

        {query && <AddItemButton>Edit Item</AddItemButton>}
      </form>
    </main>
  );
}

"use client";

import { startTransition, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { addItem } from "@/app/_lib/actions";
import AddItemButton from "../_listcomponents/AddItemButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Quicksand } from "next/font/google";
import { ChevronLeft } from "@deemlol/next-icons";

const HeadingFont = Quicksand({
  subsets: ["latin"],
  display: "swap",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AddItemForm({ listId, openform }) {
  const router = useRouter();

  /* -------------------- Animation State -------------------- */
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "auto";
  }, [isVisible]);

  function handleClose() {
    setIsVisible(false);
    setTimeout(() => {
      openform(); // unmount AFTER animation
    }, 300);
  }

  /* -------------------- Form State -------------------- */
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeItemId, setActiveItemId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  /* -------------------- Submit -------------------- */
  async function handleSubmit(formData) {
    startTransition(async () => {
      try {
        const result = await addItem(formData, listId);

        if (result?.success) {
          toast.success(
            <p className="text-sm text-[#ACF532]">
              {query} {selectedNumber}
              {selectedUnit}
              <span className="px-1 text-white">added to</span>
              {selectedCategory || "Uncategorized"}
            </p>,
            {
              duration: 4000,
              style: { background: "#0B2E1E", color: "#fff" },
            }
          );

          setQuery("");
          setSelectedCategory("");
          setSelectedBrand("");
          setSelectedNumber("");
          setSelectedUnit("");
        }
      } catch {
        toast.error("Something went wrong!", {
          style: { background: "#041527", color: "#fff" },
        });
      }
    });
  }

  /* -------------------- Suggestions -------------------- */
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setActiveItemId(null);
      return;
    }

    const fetchSuggestions = async () => {
      const { data } = await supabase
        .from("grocery_items")
        .select("*")
        .ilike("item_name", `${query}%`)
        .limit(5);

      setSuggestions(data ?? []);
    };

    fetchSuggestions();
  }, [query]);

  const handleSuggestionClick = (item) => {
    setActiveItemId(item.id);
    setQuery(item.item_name ?? "");
    setSelectedCategory(item.item_category ?? "Uncategorized");
    setSelectedBrand(item.item_brand ?? "");
    setSelectedNumber(item.item_volume_mass ?? "");
    setSelectedUnit(item.item_unit ?? "");
  };

  /* -------------------- UI -------------------- */
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <main
        className={`
          fixed left-0 bottom-0 w-screen z-50
          transition-transform duration-300 ease-in-out
          ${isVisible ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ height: "90vh" }}
      >
        <form
          action={handleSubmit}
          className="h-full bg-white rounded-t-4xl p-6 shadow-xl flex flex-col"
        >
          {/* Drag Handle */}
          <div className="flex justify-center mb-3">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center mb-4">
            <button
              type="button"
              onClick={handleClose}
              className="text-black w-10 h-10"
            >
              <ChevronLeft size={28} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Item Name */}
            <div className="relative">
              <input
                name="item_name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Item Name"
                required
                className="w-full rounded-xl p-3 text-lg text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1EC677]"
              />

              {suggestions.length > 0 && (
                <ul className=" h-full mt-10 w-full rounded-xl bg-white text-black shadow-lg">
                  {suggestions
                    .filter(
                      (item) =>
                        activeItemId === null || item.id === activeItemId
                    )
                    .map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSuggestionClick(item)}
                        className="px-3 py-2 border-b cursor-pointer border-gray-300"
                      >
                        <div className="flex justify-between">
                          <span>
                            {item.item_name} {item.item_brand}
                          </span>
                          <span className="text-sm">
                            {item.item_volume_mass}
                            {item.item_unit}
                          </span>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Manual Entry */}
            {suggestions.length === 0 && query.length >= 2 && (
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
            )}
          </div>

          {/* CTA */}
          {query && (
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
      </main>
    </>
  );
}
"use client";

import { ChevronLeft } from "@deemlol/next-icons";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const categoryTabs = [
  "All",
  "Dairy",
  "Snacks",
  "Vegetables",
  "Frozen Foods",
  "Meat and Poultry",
  "Deli and Chilled Meat",
  "Drinks",
  "Toiletries",
  "Baby",
  "Medication",
];


export default function StarterItemsModal({
  listId,
  list_name,
  openform,
  itemsLength
}) {
  const observerRef = useRef(null);

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  // Initial tab logic
  useEffect(() => {
    const lower = list_name.toLowerCase();

    if (lower.includes("toiletries")) {
      setActiveTab("Toiletries");
    }

    if (lower.includes("baby")) {
      setActiveTab("Baby");
    }

    if (lower.includes("medication")) {
      setActiveTab("Medication");
    }

    if (lower.includes("meat")) {
      setActiveTab("Meat and Poultry");
    }
  }, [list_name]);

  // Refetch when search/tab changes
  useEffect(() => {
    setPage(0);
    fetchItems(true);
  }, [search, activeTab]);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMore &&
        !loading
      ) {
        fetchItems();
      }
    });

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  async function fetchItems(reset = false) {
    try {
      if (loading) return;

      setLoading(true);

      const currentPage = reset ? 0 : page;

      const from = currentPage * 200;
      const to = from + 199;

   
      let query = supabase
        .from("grocery_items")
        .select("*")
        .order("item_name")
        .range(from, to);

      // Search
      if (search.trim()) {
        query = query.ilike(
          "item_name",
          `%${search}%`
        );
      }

      // Weekly/monthly = all
      const lower = list_name.toLowerCase();

      if (
        lower.includes("weekly") ||
        lower.includes("monthly")
      ) {
        // no category filter
      }

      // Meat onboarding
      else if (lower.includes("meat")) {
        query = query.in("item_category", [
          "Frozen Foods",
          "Meat & Poultry",
          "Deli & Chilled Meat",
        ]);
      }

      // Toiletries onboarding
      else if (lower.includes("toiletries")) {
        query = query.in(
          "item_category",["Toiletries", "Personal Care"]
          
        );
      }

      // Baby onboarding
      else if (lower.includes("baby essentials")) {
        query = query.eq("item_category", "Baby");
      }

      // Medication onboarding
      else if (lower.includes("medication")) {
        query = query.eq(
          "item_category",
          "Medication"
        );
      }

      // Manual tab override
      if (activeTab !== "All") {
        query = query.eq(
          "item_category",
          activeTab
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        return;
      }

      if (reset) {
        setItems(data || []);
      } else {
        setItems((prev) => [
          ...prev,
          ...(data || []),
        ]);
      }

      setHasMore((data || []).length === 50);

      if (reset) {
        setPage(1);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function toggleItem(item) {
    setSelectedItems((prev) => {
      const exists = prev.find(
        (i) => i.id === item.id
      );

      if (exists) {
        return prev.filter(
          (i) => i.id !== item.id
        );
      }

      return [...prev, item];
    });
  }

  async function handleAddItems() {
    try {
      setAdding(true);

      if (selectedItems.length === 0) return;

      const rows = selectedItems.map((item) => ({
        list_id: listId,
        item_name: item.item_name,
        item_category: item.item_category,
        item_brand: item.item_brand,
        item_quantity: item.item_quantity,
        item_volume_mass: item.item_volume_mass,
        item_unit: item.item_unit,
      }));

      const { error } = await supabase
        .from("list_items")
        .insert(rows);

      if (error) {
        console.error(error);
        alert("Failed to add items");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setAdding(false);
    }
  }

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
  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/40
        flex items-end md:items-center justify-center
      "
   
    >

        
      <div
        className="
          bg-[#F8F8F8]
          w-full md:max-w-3xl
          rounded-t-[30px] md:rounded-[30px]
          p-5
          max-h-[95vh]
          flex flex-col
        "
      >
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
        <div className="mb-4">
          <h1 className="text-3xl font-black">
            Add your grocery items
          </h1>

          <p className="text-gray-500 mt-2">
            Select everything you usually buy.
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Filter by name"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            h-10
            rounded-2xl
            border border-gray-200
            px-4
            outline-none
            bg-white
            mb-4
          "
        />

        {/* Tabs */}
        {/* <div
          className="
            flex gap-2 overflow-x-auto
            no-scrollbar
            mb-5
          "
        >
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap
                px-4 py-2
                rounded-full
                text-sm font-medium
                border
                mb-20
                flex justify-center items-center
                transition-all
                ${
                  activeTab === tab
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-200"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div> */}

        {/* Items */}
        <div className="overflow-y-auto flex-1 pr-1 mt-3">
          <div className="grid grid-cols-1 gap-3">
            {items.map((item) => {
              const isSelected =
                selectedItems.some(
                  (selected) =>
                    selected.id === item.id
                );

              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item)}
                  className={`
                    border rounded-2xl p-4 text-left transition-all
                    flex items-center gap-3
                    ${
                      isSelected
                        ? "bg-[#ACF532] border-black"
                        : "bg-white border-gray-200"
                    }
                  `}
                >
                  {/* Checkbox */}
                  <div
                    className={`
                      w-5 h-5 rounded-md border
                      flex items-center justify-center
                      text-xs font-bold
                      ${
                        isSelected
                          ? "bg-black border-black text-white"
                          : "border-gray-300"
                      }
                    `}
                  >
                    {isSelected ? "✓" : ""}
                  </div>

                  {/* Item */}
                  <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.item_name}
                      </span>

                      <span className="text-xs text-gray-400">
                        {item.item_brand}
                      </span>
                    </div>

                    <span className="text-sm text-gray-500">
                      {item.item_volume_mass}
                      {item.item_unit}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Infinite scroll trigger */}
          <div
            ref={observerRef}
            className="h-10 flex items-center justify-center"
          >
            {loading && (
              <span className="text-sm text-gray-400">
                Loading items...
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-5 mt-5 border-t">
            {itemsLength === 0 && selectedItems.length === 0 && <p className="text-red-400 text-center">
                Please select at least one item</p>}
          <button
            onClick={handleAddItems}
            disabled={adding}
            className="
              w-full h-[60px]
              rounded-2xl
              bg-black text-white
              font-bold text-lg
            "
          >
            {adding
              ? "Adding items..."
              : `Add ${selectedItems.length} items`}
          </button>
        </div>
      </div>
    </div>
  );
}
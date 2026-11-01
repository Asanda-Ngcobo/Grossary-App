
"use client";

import { ChevronLeft, ShoppingBag } from "@deemlol/next-icons";
import { createClient } from "@supabase/supabase-js";
import { Lexend_Deca } from "next/font/google";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import AddingOwn from "./_listcomponents/AddingOwn";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PAGE_SIZE = 100;

// ==========================================
// CATEGORY TABS
// ==========================================

const categoryTabs = [
  "All",
  "Toiletries",
  "Food Cupboard",
  "Produce",
  "Meat",
  "Frozen Foods",
  "Snacks",
  "Drinks",
  "Dairy",
  "Hot Drinks"

];

// ==========================================
// DATABASE CATEGORY MAPPING
// ==========================================

const categoryGroups = {
  Toiletries: [
    "Toiletries",
    "Beauty",
    "Personal Care",
  ],

  "Food Cupboard": [
    "Food Cupboard",
  ],

  Produce: [
    "Fruit",
    "Veg",
    "Salads",
    "Vegetables",
    "Fruit, Veg & Salads",
    "Fruit, Veg, & Salads",
  ],

  Meat: [
    "Frozen Foods",
    "Meat & Poultry",
    "Deli & Chilled Meat",
  ],

  "Frozen Foods": [
    "Frozen Foods",
  ],

  Snacks: [
    "Sweets & Snacks",
  
  ],
Drinks: [  "Beverages",
    "Juices & Cordials",
    "Beverages. Juices & Cordials"],

    "Hot Drinks": [
      "Coffee, Tea & Hot Drinks"
    ],
  Dairy: [
    "Milk, Dairy & Eggs",
  ],
};

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: "swap",
});

export default function StarterItemsModal({
  listId,
  list_name,
  openform,
  itemsLength,
}) {
  // ==========================================
  // REFS
  // ==========================================

  const observerRef = useRef(null);
  const itemsContainerRef = useRef(null);

  // Prevent duplicate pagination requests.
  const fetchingRef = useRef(false);

  // Prevent outdated requests from replacing
  // results belonging to a newer search/tab.
  const requestIdRef = useRef(0);

  // ==========================================
  // STATE
  // ==========================================

  const [items, setItems] = useState([]);

  const [selectedItems, setSelectedItems] =
    useState([]);

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  // Always start with All.
  const [activeTab, setActiveTab] =
    useState("All");

  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);

  const [adding, setAdding] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const [isVisible, setIsVisible] = useState(false);

  // ==========================================
  // GET CATEGORY FILTER
  // ==========================================

  const getCategoryFilter = useCallback(() => {
    if (activeTab === "All") {
      return null;
    }

    return categoryGroups[activeTab] || null;
  }, [activeTab]);

  // ==========================================
  // DEBOUNCE SEARCH
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================================
  // FETCH ITEMS
  // ==========================================

  const fetchItems = useCallback(
    async (reset = false) => {
      // Prevent duplicate pagination requests.
      // Reset requests are allowed to supersede
      // older requests.
      if (!reset && fetchingRef.current) {
        return;
      }

      if (!reset && !hasMore) {
        return;
      }

      fetchingRef.current = true;

      const requestId = reset
        ? ++requestIdRef.current
        : requestIdRef.current;

      setLoading(true);

      try {
        const currentPage = reset ? 0 : page;

        const from = currentPage * PAGE_SIZE;

        const to = from + PAGE_SIZE - 1;

        const categoryFilter = getCategoryFilter();

        let data = null;
        let error = null;

        // ======================================
        // SEARCH MODE
        // ======================================

        if (debouncedSearch) {
          const response = await supabase.rpc(
            "search_grocery_items",
            {
              search_term: debouncedSearch,

              result_limit: PAGE_SIZE,

              result_offset: from,

              category_filter: categoryFilter,
            }
          );

          data = response.data;
          error = response.error;
        }

        // ======================================
        // NORMAL BROWSING MODE
        // ======================================

        else {
          let query = supabase
            .from("grocery_items")
            .select("*")
            .order("item_name")
            .range(from, to);

          // All = no category restriction.
          // Other tabs = matching database categories.
          if (
            categoryFilter &&
            categoryFilter.length > 0
          ) {
            query = query.in(
              "item_category",
              categoryFilter
            );
          }

          const response = await query;

          data = response.data;
          error = response.error;
        }

        // ======================================
        // ERROR HANDLING
        // ======================================

        if (error) {
          console.error(
            "Error fetching grocery items:",
            error
          );

          return;
        }

        // Ignore outdated requests.
        if (requestId !== requestIdRef.current) {
          return;
        }

        const newItems = data || [];

        // ======================================
        // UPDATE ITEMS
        // ======================================

        if (reset) {
          setItems(newItems);

          setPage(1);

          // Reset scroll position when changing
          // search or category.
          itemsContainerRef.current?.scrollTo({
            top: 0,
            behavior: "instant",
          });
        } else {
          setItems((prev) => {
            const existingIds = new Set(
              prev.map((item) => item.id)
            );

            const uniqueNewItems = newItems.filter(
              (item) => !existingIds.has(item.id)
            );

            return [...prev, ...uniqueNewItems];
          });

          setPage((prev) => prev + 1);
        }

        // ======================================
        // CHECK FOR MORE ITEMS
        // ======================================

        setHasMore(newItems.length === PAGE_SIZE);

      } catch (error) {
        console.error(
          "Error fetching grocery items:",
          error
        );

      } finally {
        // Only the latest request controls loading.
        if (requestId === requestIdRef.current) {
          fetchingRef.current = false;
          setLoading(false);
        }
      }
    },
    [
      page,
      debouncedSearch,
      getCategoryFilter,
      hasMore,
    ]
  );

  // ==========================================
  // RESET WHEN SEARCH / CATEGORY CHANGES
  // ==========================================

  useEffect(() => {
    setPage(0);
    setHasMore(true);

    fetchItems(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, activeTab]);

  // ==========================================
  // INFINITE SCROLL
  // ==========================================

  useEffect(() => {
    const target = observerRef.current;
    const scrollContainer = itemsContainerRef.current;

    if (!target || !scrollContainer) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          hasMore &&
          !fetchingRef.current &&
          items.length > 0
        ) {
          fetchItems();
        }
      },
      {
        root: scrollContainer,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();

  }, [
    hasMore,
    page,
    items.length,
    fetchItems,
  ]);

  // ==========================================
  // SELECT / UNSELECT ITEM
  // ==========================================

  function toggleItem(item) {
    setSelectedItems((prev) => {
      const exists = prev.find(
        (selected) => selected.id === item.id
      );

      if (exists) {
        return prev.filter(
          (selected) => selected.id !== item.id
        );
      }

      return [...prev, item];
    });
  }

  // ==========================================
  // ADD ITEMS TO LIST
  // ==========================================

  async function handleAddItems() {
    if (
      selectedItems.length === 0 ||
      adding
    ) {
      return;
    }

    try {
      setAdding(true);

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

  // ==========================================
  // MODAL ANIMATION
  // ==========================================

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isVisible
      ? "hidden"
      : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  function handleClose() {
    setIsVisible(false);

    setTimeout(() => {
      openform();
    }, 300);
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className={`
        fixed inset-0 z-50
        bg-black/40
        flex items-end md:items-center
        justify-center
        transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        className={`
          bg-[#F8F8F8]
          w-full md:max-w-3xl
          rounded-t-[30px] md:rounded-[30px]
          p-5
          h-[95dvh] max-h-[95dvh]
          min-h-0
          flex flex-col
          overflow-hidden
          transition-transform duration-300
          ${isVisible ? "translate-y-0" : "translate-y-full"}
        `}
      >

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex items-center mb-3 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="text-black w-10 h-10"
          >
            <ChevronLeft size={28} />
          </button>
        </div>

        <div className="mb-2 shrink-0">
          <h1 className="text-3xl text-[#1EC677]">
            Add your grocery items
          </h1>

          <p className="text-gray-500 mt-2">
            Select everything you usually buy.
          </p>
        </div>

        {/* ======================================
            SEARCH
        ====================================== */}

        <input
          type="text"
          name="item_name"
          placeholder="Search item name or brand name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full h-12 shrink-0
            rounded-2xl
            border border-gray-200
            px-6
            outline-none
            bg-white
            my-3
          "
        />

        {/* ======================================
            SEARCH STATUS
        ====================================== */}

        {search !== debouncedSearch &&
          search.length > 0 && (
            <p className="text-xs text-gray-400 mb-2 px-2 shrink-0">
              Searching...
            </p>
          )}

        {/* ======================================
            CATEGORY TABS
        ====================================== */}

        <div
          className="
            relative z-10
            flex w-full shrink-0
            overflow-x-auto overflow-y-hidden
            gap-2 my-3 pb-2
            whitespace-nowrap
            bg-[#F8F8F8]
            touch-pan-x
          "
        >
          {categoryTabs.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setActiveTab(category)}
              className={`
                shrink-0
                whitespace-nowrap
                px-4 py-2
                rounded-full
                text-sm font-medium
                border transition-all
                ${
                  activeTab === category
                    ? "bg-[#0B2E1E] text-white border-[#0B2E1E]"
                    : "bg-white text-gray-600 border-gray-200"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ======================================
            MANUAL ENTRY
        ====================================== */}

        {debouncedSearch.length >= 2 &&
          items.length === 0 &&
          !loading && (
            <div className="shrink-0">
              <AddingOwn
                search={debouncedSearch}
                listId={listId}
                setSearch={setSearch}
              />
            </div>
          )}

        {/* ======================================
            ITEMS
        ====================================== */}

        <div
          ref={itemsContainerRef}
          className="
            flex-1 min-h-0
            overflow-y-auto
            overscroll-contain
            pr-1 mt-3
          "
        >
          <div className="grid grid-cols-1 gap-3">

            {items.map((item) => {
              const isSelected = selectedItems.some(
                (selected) => selected.id === item.id
              );

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleItem(item)}
                  className={`
                    border rounded-2xl p-4
                    text-left transition-all
                    flex items-center gap-3
                    ${
                      isSelected
                        ? "bg-[#1EC677] border-black"
                        : "bg-white border-gray-200"
                    }
                  `}
                >

                  {/* CHECKBOX */}

                  <div
                    className={`
                      w-5 h-5 shrink-0
                      rounded-md border
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

                  {/* ITEM DETAILS */}

                  <div className="flex flex-row w-full min-w-0 justify-between items-center gap-3">

                    <div className="flex flex-col min-w-0">

                      {item.item_brand && (
                        <span className="text-xs text-gray-400">
                          {item.item_brand}
                        </span>
                      )}

                      <span className="font-medium">
                        {item.item_name}
                      </span>

                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {item.item_volume_mass}
                        {item.item_unit}
                      </span>

                    </div>

                    {/* PRODUCT IMAGE */}

                    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center p-2">

                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={
                            item.recommended_product_name ||
                            "Recommended product"
                          }
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <ShoppingBag
                          size={36}
                          className="text-gray-300"
                        />
                      )}

                    </div>

                  </div>

                </button>
              );
            })}

          </div>

          {/* ======================================
              EMPTY CATEGORY RESULTS
          ====================================== */}

          {!loading &&
            items.length === 0 &&
            debouncedSearch.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">

                <ShoppingBag
                  size={40}
                  className="text-gray-300 mb-3"
                />

                <p className="font-medium text-gray-600">
                  No grocery items found
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Try another category.
                </p>

              </div>
            )}

          {/* ======================================
              INFINITE SCROLL TRIGGER
          ====================================== */}

          <div
            ref={observerRef}
            className="
              h-16
              flex items-center justify-center
            "
          >

            {loading && items.length > 0 && (
              <span className="text-sm text-gray-400">
                Loading more items...
              </span>
            )}

            {!hasMore && items.length > 0 && (
              <span className="text-xs text-gray-400">
                You&apos;ve reached the end.
              </span>
            )}

          </div>

        </div>

        {/* ======================================
            FOOTER
        ====================================== */}

        <div className="pt-4 mt-4 border-t shrink-0">

          {itemsLength === 0 &&
            selectedItems.length === 0 &&
            search.length === 0 && (
              <p className="text-red-400 text-center text-xl">
                Please select at least one item
              </p>
            )}

          {selectedItems.length > 0 && (
            <button
              type="button"
              onClick={handleAddItems}
              disabled={adding}
              className={`
                w-full h-[60px]
                rounded-2xl
                bg-[#0B2E1E]
                text-white
                font-bold text-lg
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${ButtonFont.className}
              `}
            >
              {adding
                ? "Adding items..."
                : `Add ${selectedItems.length} items`}
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

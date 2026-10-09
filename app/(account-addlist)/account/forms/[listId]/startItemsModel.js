"use client";

import { ChevronLeft } from "@deemlol/next-icons";

import { createClient } from "@supabase/supabase-js";

import { Lexend_Deca } from "next/font/google";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import AddingOwn from "./_listcomponents/AddingOwn";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PAGE_SIZE = 100;

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
  const observerRef = useRef(null);

  /*
   * Prevent multiple simultaneous
   * Supabase requests.
   */
  const fetchingRef = useRef(false);

  const [items, setItems] = useState([]);

  const [
    selectedItems,
    setSelectedItems,
  ] = useState([]);

  const [search, setSearch] =
    useState("");

  /*
   * Actual search value sent to
   * PostgreSQL.
   *
   * Updates 300ms after the user stops
   * typing.
   */
  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [
    activeTab,
    setActiveTab,
  ] = useState("All");

  const [page, setPage] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [adding, setAdding] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  /*
   * ==========================================
   * INITIAL TAB LOGIC
   * ==========================================
   */

  useEffect(() => {
    const lower = String(
      list_name || ""
    ).toLowerCase();

    if (
      lower.includes("toiletries")
    ) {
      setActiveTab("Toiletries");
    }

    if (
      lower.includes("baby")
    ) {
      setActiveTab("Baby");
    }

    if (
      lower.includes("medication")
    ) {
      setActiveTab("Medication");
    }

    if (
      lower.includes("meat")
    ) {
      setActiveTab(
        "Meat and Poultry"
      );
    }
  }, [list_name]);

  /*
   * ==========================================
   * DEBOUNCE SEARCH
   * ==========================================
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(
        search.trim()
      );
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  /*
   * ==========================================
   * GET CATEGORY FILTER
   * ==========================================
   *
   * The search RPC accepts:
   *
   * category_filter text[]
   *
   * This function converts the current
   * onboarding/list state into that array.
   */

  const getCategoryFilter =
    useCallback(() => {
      const lower = String(
        list_name || ""
      ).toLowerCase();

      let categoryFilter = null;

      /*
       * Weekly / Monthly
       *
       * No category restriction.
       */
      if (
        lower.includes("weekly") ||
        lower.includes("monthly")
      ) {
        categoryFilter = null;
      }

      /*
       * Meat onboarding
       */
      else if (
        lower.includes("meat")
      ) {
        categoryFilter = [
          "Frozen Foods",
          "Meat & Poultry",
          "Deli & Chilled Meat",
        ];
      }

      /*
       * Toiletries onboarding
       */
      else if (
        lower.includes(
          "toiletries"
        )
      ) {
        categoryFilter = [
          "Toiletries",
          "Personal Care",
        ];
      }

      /*
       * Baby onboarding
       */
      else if (
        lower.includes(
          "baby essentials"
        )
      ) {
        categoryFilter = [
          "Baby",
          "Health Care",
          "Personal Care",
        ];
      }

      /*
       * Medication onboarding
       */
      else if (
        lower.includes(
          "medication"
        )
      ) {
        categoryFilter = [
          "Health Care",
        ];
      }

      /*
       * Snacks onboarding
       */
      else if (
        lower.includes("snacks")
      ) {
        categoryFilter = [
          "Sweets & Snacks",
          "Beverages. Juices & Cordials",
        ];
      }

      /*
       * Alcohol onboarding
       */
      else if (
        lower.includes("booze")
      ) {
        categoryFilter = [
          "Wine, Beer & Spirits",
          "Beverages. Juices & Cordials",
        ];
      }

      /*
       * Manual tab selection overrides
       * onboarding categories.
       */
      if (
        activeTab !== "All"
      ) {
        categoryFilter = [
          activeTab,
        ];
      }

      return categoryFilter;
    }, [
      list_name,
      activeTab,
    ]);

  /*
   * ==========================================
   * FETCH ITEMS
   * ==========================================
   */

  const fetchItems = useCallback(
    async (reset = false) => {
      /*
       * Prevent duplicate requests.
       */
      if (
        fetchingRef.current
      ) {
        return;
      }

      try {
        fetchingRef.current = true;

        setLoading(true);

        const currentPage =
          reset ? 0 : page;

        /*
         * PAGE 0
         * offset = 0
         *
         * PAGE 1
         * offset = 100
         *
         * PAGE 2
         * offset = 200
         */
        const from =
          currentPage *
          PAGE_SIZE;

        const to =
          from +
          PAGE_SIZE -
          1;

        const categoryFilter =
          getCategoryFilter();

        let data = null;

        let error = null;

        /*
         * ======================================
         * SEARCH MODE
         * ======================================
         *
         * PostgreSQL now handles:
         *
         * - exact item-name ranking
         * - exact brand ranking
         * - starts-with ranking
         * - contains ranking
         * - punctuation normalization
         * - whole wheat / whole-wheat
         * - weetbix / wheatbix / weet-bix
         *
         * Ranking happens BEFORE LIMIT/OFFSET.
         */

        if (debouncedSearch) {
          const response =
            await supabase.rpc(
              "search_grocery_items",
              {
                search_term:
                  debouncedSearch,

                result_limit:
                  PAGE_SIZE,

                result_offset:
                  from,

                category_filter:
                  categoryFilter,
              }
            );

          data = response.data;

          error = response.error;
        }

        /*
         * ======================================
         * NORMAL BROWSING MODE
         * ======================================
         *
         * No search text.
         *
         * Continue using the normal
         * grocery_items table.
         */
        else {
          let query = supabase
            .from("grocery_items")
            .select("*")
            .order("item_name")
            .range(from, to);

          if (
            categoryFilter &&
            categoryFilter.length > 0
          ) {
            query = query.in(
              "item_category",
              categoryFilter
            );
          }

          const response =
            await query;

          data = response.data;

          error = response.error;
        }

        /*
         * ======================================
         * ERROR HANDLING
         * ======================================
         */

        if (error) {
          console.error(
            "Error fetching grocery items:",
            error
          );

          return;
        }

        const newItems =
          data || [];

        /*
         * ======================================
         * UPDATE ITEMS
         * ======================================
         */

        if (reset) {
          /*
           * New search/category.
           *
           * Replace old results.
           */
          setItems(newItems);
        } else {
          /*
           * Infinite scroll.
           *
           * Append the next already-ranked
           * database page.
           */
          setItems((prev) => {
            /*
             * Protect against duplicate rows
             * if IntersectionObserver fires
             * more than once.
             */
            const existingIds =
              new Set(
                prev.map(
                  (item) =>
                    item.id
                )
              );

            const uniqueNewItems =
              newItems.filter(
                (item) =>
                  !existingIds.has(
                    item.id
                  )
              );

            return [
              ...prev,
              ...uniqueNewItems,
            ];
          });
        }

        /*
         * ======================================
         * CHECK IF MORE ITEMS EXIST
         * ======================================
         *
         * If PostgreSQL returned fewer than
         * 100 rows, we've reached the end.
         */

        setHasMore(
          newItems.length ===
            PAGE_SIZE
        );

        /*
         * ======================================
         * UPDATE PAGE
         * ======================================
         */

        if (reset) {
          /*
           * Page 0 was fetched.
           *
           * Next request should fetch
           * page 1 / offset 100.
           */
          setPage(1);
        } else {
          setPage(
            (prev) =>
              prev + 1
          );
        }
      } catch (error) {
        console.error(
          "Error fetching grocery items:",
          error
        );
      } finally {
        fetchingRef.current =
          false;

        setLoading(false);
      }
    },
    [
      page,
      debouncedSearch,
      getCategoryFilter,
    ]
  );

  /*
   * ==========================================
   * RESET WHEN SEARCH / TAB CHANGES
   * ==========================================
   */

  useEffect(() => {
    /*
     * Start again from page 0 whenever
     * search or category changes.
     */

    setPage(0);

    setHasMore(true);

    fetchItems(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearch,
    activeTab,
  ]);

  /*
   * ==========================================
   * INFINITE SCROLL
   * ==========================================
   */

  useEffect(() => {
    const target =
      observerRef.current;

    if (!target) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

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
          /*
           * Start loading before the user
           * reaches the absolute bottom.
           */
          root: null,

          rootMargin:
            "200px",

          threshold: 0,
        }
      );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [
    hasMore,
    page,
    items.length,
    fetchItems,
  ]);

  /*
   * ==========================================
   * SELECT / UNSELECT ITEM
   * ==========================================
   */

  function toggleItem(item) {
    setSelectedItems(
      (prev) => {
        const exists =
          prev.find(
            (selected) =>
              selected.id ===
              item.id
          );

        if (exists) {
          return prev.filter(
            (selected) =>
              selected.id !==
              item.id
          );
        }

        return [
          ...prev,
          item,
        ];
      }
    );
  }

  /*
   * ==========================================
   * ADD ITEMS TO LIST
   * ==========================================
   */

  async function handleAddItems() {
    if (
      selectedItems.length ===
        0 ||
      adding
    ) {
      return;
    }

    try {
      setAdding(true);

      const rows =
        selectedItems.map(
          (item) => ({
            list_id:
              listId,

            item_name:
              item.item_name,

            item_category:
              item.item_category,

            item_brand:
              item.item_brand,

            item_quantity:
              item.item_quantity,

            item_volume_mass:
              item.item_volume_mass,

            item_unit:
              item.item_unit,
          })
        );

      const { error } =
        await supabase
          .from("list_items")
          .insert(rows);

      if (error) {
        console.error(error);

        alert(
          "Failed to add items"
        );

        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setAdding(false);
    }
  }

  /*
   * ==========================================
   * ANIMATION STATE
   * ==========================================
   */

  const [
    isVisible,
    setIsVisible,
  ] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isVisible
        ? "hidden"
        : "auto";

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, [isVisible]);

  function handleClose() {
    setIsVisible(false);

    setTimeout(() => {
      openform();
    }, 300);
  }

  /*
   * ==========================================
   * UI
   * ==========================================
   */

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/40
        flex items-end
        md:items-center
        justify-center
      "
    >
      <div
        className="
          bg-[#F8F8F8]
          w-full
          md:max-w-3xl
          rounded-t-[30px]
          md:rounded-[30px]
          p-5
          max-h-[95vh]
          flex flex-col
        "
      >
        {/* =========================
            HEADER
        ========================= */}

        <div className="flex items-center mb-4">
          {(itemsLength === 0 ||
            itemsLength > 0) && (
            <button
              type="button"
              onClick={
                handleClose
              }
              className="text-black w-10 h-10"
            >
              <ChevronLeft
                size={28}
              />
            </button>
          )}
        </div>

        <div className="mb-4">
          <h1 className="text-3xl text-[#1EC677]">
            Add your grocery items
          </h1>

          <p className="text-gray-500 mt-2">
            Select everything you
            usually buy.
          </p>
        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <input
          type="text"
          name="item_name"
          placeholder="Search item name or brand name"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            w-full
            h-10
            rounded-2xl
            border
            border-gray-200
            px-6
            py-6
            outline-none
            bg-white
            mb-4
          "
        />

        {/* =========================
            SEARCH STATUS
        ========================= */}

        {search !==
          debouncedSearch &&
          search.length >
            0 && (
            <p className="text-xs text-gray-400 mb-2 px-2">
              Searching...
            </p>
          )}

        {/* =========================
            CATEGORY TABS
        ========================= */}

        {/*
        <div
          className="
            flex
            overflow-x-auto
            gap-2
            mb-3
            pb-1
          "
        >
          {categoryTabs.map(
            (category) => (
              <button
                type="button"
                key={category}
                onClick={() =>
                  setActiveTab(
                    category
                  )
                }
                className={`
                  whitespace-nowrap
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-medium
                  border
                  transition-all

                  ${
                    activeTab ===
                    category
                      ? `
                          bg-[#0B2E1E]
                          text-white
                          border-[#0B2E1E]
                        `
                      : `
                          bg-white
                          text-gray-600
                          border-gray-200
                        `
                  }
                `}
              >
                {category}
              </button>
            )
          )}
        </div>
        */}

        {/* =========================
            MANUAL ENTRY
        ========================= */}

        {debouncedSearch.length >=
          2 &&
          items.length ===
            0 &&
          !loading && (
            <AddingOwn
              search={
                debouncedSearch
              }
              listId={
                listId
              }
              setSearch={
                setSearch
              }
            />
          )}

        {/* =========================
            ITEMS
        ========================= */}

        <div className="overflow-y-auto flex-1 pr-1 mt-3">
          <div className="grid grid-cols-1 gap-3">
            {items.map(
              (item) => {
                const isSelected =
                  selectedItems.some(
                    (
                      selected
                    ) =>
                      selected.id ===
                      item.id
                  );

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      toggleItem(
                        item
                      )
                    }
                    className={`
                      border
                      rounded-2xl
                      p-4
                      text-left
                      transition-all
                      flex
                      items-center
                      gap-3

                      ${
                        isSelected
                          ? `
                              bg-[#1EC677]
                              border-black
                            `
                          : `
                              bg-white
                              border-gray-200
                            `
                      }
                    `}
                  >
                    {/* Checkbox */}

                    <div
                      className={`
                        w-5
                        h-5
                        rounded-md
                        border
                        flex
                        items-center
                        justify-center
                        text-xs
                        font-bold
                        flex-shrink-0

                        ${
                          isSelected
                            ? `
                                bg-black
                                border-black
                                text-white
                              `
                            : `
                                border-gray-300
                              `
                        }
                      `}
                    >
                      {isSelected
                        ? "✓"
                        : ""}
                    </div>

                    {/* Item */}

                    <div className="flex flex-row w-full justify-between gap-3">
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium">
                          {
                            item.item_name
                          }
                        </span>

                        {item.item_brand && (
                          <span className="text-xs text-gray-400">
                            {
                              item.item_brand
                            }
                          </span>
                        )}
                      </div>

                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {
                          item.item_volume_mass
                        }
                        {item.item_unit}
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>

          {/* =========================
              INFINITE SCROLL TRIGGER
          ========================= */}

          <div
            ref={observerRef}
            className="
              h-16
              flex
              items-center
              justify-center
            "
          >
            {loading &&
              items.length >
                0 && (
                <span className="text-sm text-gray-400">
                  Loading more
                  items...
                </span>
              )}

            {!hasMore &&
              items.length >
                0 && (
                <span className="text-xs text-gray-400">
                  You&apos;ve
                  reached the end.
                </span>
              )}
          </div>
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="pt-5 mt-5 border-t">
          {itemsLength ===
            0 &&
            selectedItems.length ===
              0 &&
            search.length ===
              0 && (
              <p className="text-red-400 text-center text-xl">
                Please select at
                least one item
              </p>
            )}

          {selectedItems.length >
            0 && (
            <button
              type="button"
              onClick={
                handleAddItems
              }
              disabled={adding}
              className={`
                w-full
                h-[60px]
                rounded-2xl
                bg-[#0B2E1E]
                text-white
                font-bold
                text-lg
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
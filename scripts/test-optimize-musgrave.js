require("dotenv").config({
  path: ".env.local",
});

const {
  optimizeShoppingLocation,
} = require(
  "../app/_lib/grocery/services/optimizeShoppingLocation"
);


/*
 * ------------------------------------------------
 * Test data
 * ------------------------------------------------
 */

const items = [
  {
    id: "test-1",

    item_name: "Rice",
    item_brand: "Tastic",

    item_quantity: 2,

    item_volume_mass: 2,
    item_unit: "kg",
  },

  {
    id: "test-2",

    item_name: "Milk",
    item_brand: "Clover",

    item_quantity: 1,

    item_volume_mass: 2,
    item_unit: "l",
  },

  {
    id: "test-3",

    item_name: "Brown Rice",
    item_brand: "Tastic",

    item_quantity: 1,

    item_volume_mass: 2,
    item_unit: "kg",
  },
];


/*
 * ------------------------------------------------
 * Musgrave shared shopping location
 * ------------------------------------------------
 */

const location = {
  name: "Westwood",

  checkers: {
    storeId: "168545",
    storeName:
      "Checkers FX Westwood Mall",
  },

  pnp: {
    storeId: "KC20",
    storeName:
      "PnP Westwood",
  },
};


/*
 * ------------------------------------------------
 * Format requested item
 * ------------------------------------------------
 */

function formatRequestedItem(
  item
) {
  if (!item) {
    return "-";
  }

  return [
    item.item_brand,
    item.item_name,
    item.item_volume_mass,
    item.item_unit,
  ]
    .filter(
      value =>
        value !== null &&
        value !== undefined &&
        value !== ""
    )
    .join(" ");
}


/*
 * ------------------------------------------------
 * Format money
 * ------------------------------------------------
 */

function money(
  value
) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return "-";
  }

  return `R${number.toFixed(2)}`;
}


/*
 * ------------------------------------------------
 * Main test
 * ------------------------------------------------
 */

async function main() {

  console.log(
    "\n================================"
  );

  console.log(
    "GROSSARY PLUS — MUSGRAVE"
  );

  console.log(
    "================================"
  );

  console.log(
    `Checkers: ${location.checkers.storeName}`
  );

  console.log(
    `Checkers ID: ${location.checkers.storeId}`
  );

  console.log(
    `Pick n Pay: ${location.pnp.storeName}`
  );

  console.log(
    `PnP ID: ${location.pnp.storeId}`
  );

  console.log(
    `Items: ${items.length}`
  );


  /*
   * ------------------------------------------------
   * Run optimizer
   * ------------------------------------------------
   */

  const result =
    await optimizeShoppingLocation({
      items,
      location,
    });


  /*
   * ------------------------------------------------
   * Item-by-item comparison
   * ------------------------------------------------
   */

  console.log(
    "\n================================"
  );

  console.log(
    "ITEM PRICE COMPARISON"
  );

  console.log(
    "================================\n"
  );


  console.table(
    result.optimized.items.map(
      item => {

        const checkersPrice =
          item.checkers
            ?.unitPrice;

        const pnpPrice =
          item.pnp
            ?.unitPrice;


        const checkersStock =
          item.checkers
            ?.product
            ?.inStock;

        const pnpStock =
          item.pnp
            ?.product
            ?.inStock;


        return {
          requested:
            formatRequestedItem(
              item.requestedItem
            ),

          checkers:
            money(
              checkersPrice
            ),

          checkersStock:
            checkersStock === true
              ? "In stock"
              : checkersStock === false
                ? "Out of stock"
                : "Unknown",

          pnp:
            money(
              pnpPrice
            ),

          pnpStock:
            pnpStock === true
              ? "In stock"
              : pnpStock === false
                ? "Out of stock"
                : "Unknown",

          winner:
            item.selectedRetailer ||
            "UNMATCHED",

          quantity:
            item.quantity,

          selectedTotal:
            money(
              item.lineTotal
            ),

          promoSaving:
            money(
              item.promotionalSavings ||
              0
            ),
        };
      }
    )
  );


  /*
   * ------------------------------------------------
   * Checkers allocation
   * ------------------------------------------------
   */

  const checkersAllocation =
    result
      .optimized
      .allocations
      .checkers;


  console.log(
    "\n================================"
  );

  console.log(
    "CHECKERS SHOPPING LIST"
  );

  console.log(
    "================================"
  );

  console.log(
    location.checkers.storeName
  );


  if (
    checkersAllocation
      .items
      .length === 0
  ) {

    console.log(
      "No items assigned to Checkers."
    );

  } else {

    console.table(
      checkersAllocation
        .items
        .map(
          item => ({
            item:
              item.product
                ?.productName ||
              formatRequestedItem(
                item.requestedItem
              ),

            quantity:
              item.quantity,

            unitPrice:
              money(
                item.unitPrice
              ),

            total:
              money(
                item.lineTotal
              ),

            promoSaving:
              money(
                item.promotionalSavings ||
                0
              ),
          })
        )
    );

  }


  console.log(
    `Checkers spend: ${money(
      checkersAllocation.total
    )}`
  );


  /*
   * ------------------------------------------------
   * PnP allocation
   * ------------------------------------------------
   */

  const pnpAllocation =
    result
      .optimized
      .allocations
      .pnp;


  console.log(
    "\n================================"
  );

  console.log(
    "PICK N PAY SHOPPING LIST"
  );

  console.log(
    "================================"
  );

  console.log(
    location.pnp.storeName
  );


  if (
    pnpAllocation
      .items
      .length === 0
  ) {

    console.log(
      "No items assigned to Pick n Pay."
    );

  } else {

    console.table(
      pnpAllocation
        .items
        .map(
          item => ({
            item:
              item.product
                ?.productName ||
              formatRequestedItem(
                item.requestedItem
              ),

            quantity:
              item.quantity,

            unitPrice:
              money(
                item.unitPrice
              ),

            total:
              money(
                item.lineTotal
              ),

            promoSaving:
              money(
                item.promotionalSavings ||
                0
              ),
          })
        )
    );

  }


  console.log(
    `PnP spend: ${money(
      pnpAllocation.total
    )}`
  );


  /*
   * ------------------------------------------------
   * Single-store options
   * ------------------------------------------------
   */

  const checkersOnly =
    result
      .singleStoreOptions
      .checkers;


  const pnpOnly =
    result
      .singleStoreOptions
      .pnp;


  const cheapestSingleStore =
    result
      .singleStoreOptions
      .cheapest;


  console.log(
    "\n================================"
  );

  console.log(
    "SINGLE-STORE OPTIONS"
  );

  console.log(
    "================================"
  );


  if (
    checkersOnly.complete
  ) {

    console.log(
      `Checkers only: ${money(
        checkersOnly.total
      )}`
    );

  } else {

    console.log(
      "Checkers only: Incomplete"
    );

  }


  if (
    pnpOnly.complete
  ) {

    console.log(
      `PnP only: ${money(
        pnpOnly.total
      )}`
    );

  } else {

    console.log(
      "PnP only: Incomplete"
    );

  }


  if (
    cheapestSingleStore
  ) {

    console.log(
      `Cheapest single store: ${cheapestSingleStore.retailer} — ${money(
        cheapestSingleStore.total
      )}`
    );

  } else {

    console.log(
      "Cheapest single store: None"
    );

  }


  /*
   * ------------------------------------------------
   * Final Grossary Plus result
   * ------------------------------------------------
   */

  console.log(
    "\n================================"
  );

  console.log(
    "GROSSARY PLUS RESULT"
  );

  console.log(
    "================================"
  );


  console.log(
    `Optimized total: ${money(
      result.optimized.total
    )}`
  );


  console.log(
    `Retailer promotion savings: ${money(
      result
        .optimized
        .promotionalSavings
    )}`
  );


  if (
    result.combinationSavings !==
    null
  ) {

    console.log(
      `Combination savings: ${money(
        result.combinationSavings
      )}`
    );

  } else {

    console.log(
      "Combination savings: N/A"
    );

  }


  console.log(
    `Stores used: ${result.optimized.storesUsed}`
  );

  console.log(
    `Matched: ${result.matchedCount}/${result.itemCount}`
  );

  console.log(
    `Unmatched: ${result.unmatchedCount}`
  );

  console.log(
    `Complete basket: ${result.complete}`
  );


  /*
   * ------------------------------------------------
   * Unmatched products
   * ------------------------------------------------
   */

  if (
    result.unmatchedItems.length >
    0
  ) {

    console.log(
      "\n================================"
    );

    console.log(
      "UNMATCHED PRODUCTS"
    );

    console.log(
      "================================\n"
    );


    console.table(
      result
        .unmatchedItems
        .map(
          item => ({
            requested:
              formatRequestedItem(
                item.requestedItem
              ),

            checkersMatch:
              item.checkers
                ?.product
                ?.productName ||
              "None",

            checkersScore:
              item.checkers
                ?.score ??
              0,

            pnpMatch:
              item.pnp
                ?.product
                ?.productName ||
              "None",

            pnpScore:
              item.pnp
                ?.score ??
              0,
          })
        )
    );

  }


  /*
   * ------------------------------------------------
   * Store integrity check
   * ------------------------------------------------
   */

  const wrongCheckersStore =
    result
      .baskets
      .checkers
      .matched
      .filter(
        item =>
          String(
            item.product
              ?.providerStoreId
          ) !==
          String(
            location
              .checkers
              .storeId
          )
      );


  const wrongPnpStore =
    result
      .baskets
      .pnp
      .matched
      .filter(
        item =>
          String(
            item.product
              ?.providerStoreId
          ) !==
          String(
            location
              .pnp
              .storeId
          )
      );


  console.log(
    "\n================================"
  );

  console.log(
    "STORE INTEGRITY"
  );

  console.log(
    "================================"
  );


  if (
    wrongCheckersStore.length ===
    0
  ) {

    console.log(
      `✓ Checkers products belong to ${location.checkers.storeId}`
    );

  } else {

    console.log(
      "✗ Checkers store mismatch detected."
    );

  }


  if (
    wrongPnpStore.length ===
    0
  ) {

    console.log(
      `✓ PnP products belong to ${location.pnp.storeId}`
    );

  } else {

    console.log(
      "✗ PnP store mismatch detected."
    );

  }

}


/*
 * ------------------------------------------------
 * Run
 * ------------------------------------------------
 */

main().catch(
  error => {

    console.error(
      "\nGROSSARY PLUS OPTIMIZER TEST FAILED"
    );

    console.error(
      error
    );

    process.exitCode = 1;

  }
);
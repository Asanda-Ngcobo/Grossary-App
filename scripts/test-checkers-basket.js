require("dotenv").config({
  path: ".env.local",
});

const {
  getCheckersBasket,
} = require(
  "../app/_lib/grocery/services/getCheckersBasket"
);


/*
 * Checkers Musgrave
 */
const STORE_ID =
  "162387";

const STORE_NAME =
  "Checkers Musgrave Centre";


async function main() {

  const listItems = [
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


  console.log(
    "\n================================"
  );

  console.log(
    "CHECKERS STORE-SPECIFIC BASKET TEST"
  );

  console.log(
    "================================"
  );

  console.log(
    "Store:",
    STORE_NAME
  );

  console.log(
    "Store ID:",
    STORE_ID
  );

  console.log(
    "Items:",
    listItems.length
  );


  /*
   * IMPORTANT:
   *
   * The Checkers basket now requires
   * an exact branch ID.
   */
  const basket =
    await getCheckersBasket(
      listItems,
      {
        storeId:
          STORE_ID,
      }
    );


  console.log(
    "\n================================"
  );

  console.log(
    "CHECKERS BASKET"
  );

  console.log(
    "================================\n"
  );


  console.table(
    basket.items.map(
      item => ({
        requested:
          [
            item.requestedItem
              ?.item_brand,

            item.requestedItem
              ?.item_name,

            item.requestedItem
              ?.item_volume_mass,

            item.requestedItem
              ?.item_unit,
          ]
            .filter(Boolean)
            .join(" "),

        matched:
          item.product
            ?.productName ||
          "NO MATCH",

        productStoreId:
          item.product
            ?.providerStoreId ||
          null,

        matchedResult:
          item.matched,

        score:
          item.score,

        quantity:
          item.quantity,

        unitPrice:
          item.unitPrice !== null
            ? `R${item.unitPrice.toFixed(2)}`
            : "-",

        total:
          item.lineTotal !== null
            ? `R${item.lineTotal.toFixed(2)}`
            : "-",

        promoSaving:
          `R${(
            item.promotionalSavings ||
            0
          ).toFixed(2)}`,

        stock:
          item.product
            ?.inStock === true
            ? "In stock"
            : item.product
                ?.inStock === false
              ? "Out of stock"
              : "Unknown",
      })
    )
  );


  /*
   * ------------------------------------------------
   * Basket summary
   * ------------------------------------------------
   */

  console.log(
    "\n================================"
  );

  console.log(
    "BASKET SUMMARY"
  );

  console.log(
    "================================"
  );


  console.log(
    `Store: ${STORE_NAME}`
  );

  console.log(
    `Store ID: ${basket.storeId}`
  );

  console.log(
    `Basket total: R${basket.total.toFixed(2)}`
  );

  console.log(
    `Promotion savings: R${basket.promotionalSavings.toFixed(2)}`
  );

  console.log(
    `Matched: ${basket.matchedCount}/${basket.itemCount}`
  );

  console.log(
    `Unmatched: ${basket.unmatchedCount}`
  );

  console.log(
    `Complete basket: ${basket.complete}`
  );


  /*
   * ------------------------------------------------
   * Unmatched items
   * ------------------------------------------------
   */

  if (
    basket.unmatched.length > 0
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
      basket.unmatched.map(
        item => ({
          requested:
            [
              item.requestedItem
                ?.item_brand,

              item.requestedItem
                ?.item_name,

              item.requestedItem
                ?.item_volume_mass,

              item.requestedItem
                ?.item_unit,
            ]
              .filter(Boolean)
              .join(" "),

          query:
            item.searchQuery,

          bestScore:
            item.score,

          reasons:
            (
              item.reasons ||
              []
            ).join(", "),
        })
      )
    );
  }


  /*
   * ------------------------------------------------
   * Store integrity check
   * ------------------------------------------------
   *
   * Every matched product MUST belong
   * to Checkers Musgrave.
   */

  const wrongStoreProducts =
    basket.matched.filter(
      item =>
        String(
          item.product
            ?.providerStoreId
        ) !== String(
          STORE_ID
        )
    );


  console.log(
    "\n================================"
  );

  console.log(
    "STORE INTEGRITY CHECK"
  );

  console.log(
    "================================"
  );


  if (
    wrongStoreProducts.length ===
    0
  ) {

    console.log(
      `✓ All matched products belong to store ${STORE_ID}.`
    );

  } else {

    console.error(
      "✗ WARNING: Products from another Checkers branch were found!"
    );

    console.table(
      wrongStoreProducts.map(
        item => ({
          product:
            item.product
              ?.productName,

          expectedStore:
            STORE_ID,

          actualStore:
            item.product
              ?.providerStoreId,
        })
      )
    );
  }
}


main().catch(error => {

  console.error(
    "\nCHECKERS BASKET TEST FAILED"
  );

  console.error(
    error
  );

  process.exitCode = 1;

});
require("dotenv").config({
  path: ".env.local",
});


const {
  getPnpBasket,
} = require(
  "../app/_lib/grocery/services/getPnpBasket"
);


/*
 * ------------------------------------------------
 * Money helper
 * ------------------------------------------------
 */

function formatMoney(
  value
) {
  const amount =
    Number(value);


  if (
    !Number.isFinite(amount)
  ) {
    return "-";
  }


  return `R${amount.toFixed(2)}`;
}


/*
 * ------------------------------------------------
 * Test Grossary list
 * ------------------------------------------------
 */

const items = [
  {
    item_name:
      "Rice",

    item_brand:
      "Tastic",

    item_volume_mass:
      2,

    item_unit:
      "kg",

    item_quantity:
      2,
  },

  {
    item_name:
      "Milk",

    item_brand:
      "Clover",

    item_volume_mass:
      2,

    item_unit:
      "L",

    item_quantity:
      1,
  },

  {
    item_name:
      "Domestos",

    item_brand:
      "Domestos",

    item_volume_mass:
      750,

    item_unit:
      "ml",

    item_quantity:
      1,
  },
];


/*
 * ------------------------------------------------
 * Main
 * ------------------------------------------------
 */

async function main() {

  console.log(
    "\n=============================="
  );

  console.log(
    "BUILDING PNP BASKET"
  );

  console.log(
    "==============================\n"
  );


  console.table(
    items.map(
      item => ({
        item:
          [
            item.item_brand,
            item.item_name,
            item.item_volume_mass,
            item.item_unit,
          ]
            .filter(Boolean)
            .join(" "),

        quantity:
          item.item_quantity,
      })
    )
  );


const basket =
  await getPnpBasket(
    items,
    {
      storeId: "KC06",
    }
  );

  /*
   * ------------------------------------------------
   * Basket items
   * ------------------------------------------------
   */

  console.log(
    "\n=============================="
  );

  console.log(
    "PNP BASKET RESULTS"
  );

  console.log(
    "==============================\n"
  );


  console.table(
    basket.items.map(
      result => ({
        requested:
          [
            result
              .requestedItem
              ?.item_brand,

            result
              .requestedItem
              ?.item_name,

            result
              .requestedItem
              ?.item_volume_mass,

            result
              .requestedItem
              ?.item_unit,
          ]
            .filter(Boolean)
            .join(" "),

        matched:
          result.product
            ?.productName ||
          "UNMATCHED",

        score:
          result.score,

        qty:
          result.quantity,

        unitPrice:
          formatMoney(
            result.unitPrice
          ),

        lineTotal:
          formatMoney(
            result.lineTotal
          ),

        promoSavings:
          formatMoney(
            result
              .promotionalSavings
          ),

        inStock:
          result.product
            ?.inStock ??
          "-",
      })
    )
  );


  /*
   * ------------------------------------------------
   * Summary
   * ------------------------------------------------
   */

  console.log(
    "\n=============================="
  );

  console.log(
    "PNP BASKET SUMMARY"
  );

  console.log(
    "==============================\n"
  );


  console.log(
    "Items:",
    basket.itemCount
  );


  console.log(
    "Matched:",
    basket.matchedCount
  );


  console.log(
    "Unmatched:",
    basket.unmatchedCount
  );


  console.log(
    "Complete:",
    basket.complete
  );


  console.log(
    "Basket total:",
    formatMoney(
      basket.total
    )
  );


  console.log(
    "Promotion savings:",
    formatMoney(
      basket
        .promotionalSavings
    )
  );


  /*
   * ------------------------------------------------
   * Show unmatched details
   * ------------------------------------------------
   */

  if (
    basket.unmatched.length >
    0
  ) {

    console.log(
      "\n=============================="
    );

    console.log(
      "UNMATCHED ITEMS"
    );

    console.log(
      "==============================\n"
    );


    for (
      const item
      of basket.unmatched
    ) {

      console.log(
        "Requested:",
        item.searchQuery
      );


      console.log(
        "Best score:",
        item.score
      );


      console.log(
        "Reasons:",
        item.reasons
      );


      if (
        item.candidates
          ?.length
      ) {

        console.table(
          item.candidates.map(
            candidate => ({
              product:
                candidate
                  .product
                  ?.productName,

              price:
                formatMoney(
                  candidate
                    .product
                    ?.price
                ),

              score:
                candidate.score,

              reasons:
                candidate
                  .reasons
                  ?.join(
                    " | "
                  ),
            })
          )
        );

      }


      console.log("");

    }

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
      "\nPnP basket test failed:"
    );


    console.error(
      error
    );


    process.exitCode = 1;

  }
);
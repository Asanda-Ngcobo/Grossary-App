require("dotenv").config({
  path: ".env.local",
});

const {
  searchPnpProducts,
} = require(
  "../app/_lib/grocery/providers/pnp"
);

const {
  normalizePnpProducts,
} = require(
  "../app/_lib/grocery/normalizers/pnp"
);

const {
  matchProduct,
} = require(
  "../app/_lib/grocery/matchProduct"
);


/*
 * ------------------------------------------------
 * Extract products from Parse response
 * ------------------------------------------------
 */

function extractProducts(response) {
  return (
    response?.data?.products ||
    response?.products ||
    response?.data?.items ||
    response?.items ||
    []
  );
}


/*
 * ------------------------------------------------
 * Format money
 * ------------------------------------------------
 */

function formatMoney(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "-";
  }

  return `R${amount.toFixed(2)}`;
}


/*
 * ------------------------------------------------
 * Main test
 * ------------------------------------------------
 */

async function main() {

  const query =
    process.argv
      .slice(2)
      .join(" ") ||
    "Bakers Zoo Zoos Cream Biscuit 125g";


  const requestedItem = {
    item_name: "Cream Biscuit",
    item_brand: "Bakers Zoo Zoos",
    item_volume_mass: 125,
    item_unit: "g",
    item_quantity: 1,
  };


  console.log(
    `\nSearching PnP for: "${query}"\n`
  );


  /*
   * ----------------------------------------------
   * Search PnP
   * ----------------------------------------------
   */

  const response =
    await searchPnpProducts(
      query,
      {
        page: 0,
        pageSize: 3,
      }
    );


  const products =
    extractProducts(
      response
    );


  console.log(
    "=============================="
  );

  console.log(
    `RAW PRODUCTS FOUND: ${products.length}`
  );

  console.log(
    "==============================\n"
  );

/*
 * ----------------------------------------------
 * Inspect raw Parse products
 * ----------------------------------------------
 */

console.log(
  "\n=============================="
);

console.log(
  "RAW PNP PRODUCT DATA"
);

console.log(
  "==============================\n"
);


products.forEach(
  (product, index) => {

    console.log(
      `\n---------- PRODUCT ${index + 1} ----------`
    );

    console.dir(
      product,
      {
        depth: null,
      }
    );

  }
);
  /*
   * ----------------------------------------------
   * Normalize
   * ----------------------------------------------
   */

  const normalizedProducts =
    normalizePnpProducts(
      products
    );


  console.log(
    "=============================="
  );

  console.log(
    "NORMALIZED PRODUCTS"
  );

  console.log(
    "==============================\n"
  );


  console.table(
    normalizedProducts.map(
      product => ({
        id:
          product.providerProductId,

        name:
          product.productName,

        supplier:
          product.supplier,

        price:
          formatMoney(
            product.price
          ),

        regularPrice:
          formatMoney(
            product.regularPrice
          ),

        savings:
          formatMoney(
            product.promotionalSavings
          ),

        promotion:
          product.isPromotion,

        inStock:
          product.inStock,
      })
    )
  );


  /*
   * ----------------------------------------------
   * Match requested Grossary item
   * ----------------------------------------------
   */

  const result =
    matchProduct(
      requestedItem,
      normalizedProducts
    );


  console.log(
    "\n=============================="
  );

  console.log(
    "PRODUCT MATCH"
  );

  console.log(
    "==============================\n"
  );


  const requestedDescription =
    [
      requestedItem.item_brand,
      requestedItem.item_name,
      requestedItem.item_volume_mass,
      requestedItem.item_unit,
    ]
      .filter(Boolean)
      .join(" ");


  console.log(
    "Requested:",
    requestedDescription
  );


  /*
   * ----------------------------------------------
   * No confident match
   * ----------------------------------------------
   */

  if (!result.matched) {

    console.log(
      "Matched: NONE"
    );

    console.log(
      "Best score:",
      result.score
    );

    console.log(
      "Reasons:",
      result.reasons
    );


    /*
     * Show the best candidates.
     * Very useful while developing
     * the matching algorithm.
     */

    if (
      result.candidates?.length
    ) {

      console.log(
        "\nTOP CANDIDATES:\n"
      );


      console.table(
        result.candidates.map(
          candidate => ({
            product:
              candidate.product
                ?.productName,

            price:
              formatMoney(
                candidate.product
                  ?.price
              ),

            score:
              candidate.score,

            reasons:
              candidate.reasons
                ?.join(" | "),
          })
        )
      );

    }


    return;
  }


  /*
   * ----------------------------------------------
   * Successful match
   * ----------------------------------------------
   */

  const product =
    result.match;


  const quantity =
    Number(
      requestedItem.item_quantity
    ) || 1;


  const lineTotal =
    product.price *
    quantity;


  const promotionSavings =
    (
      product.promotionalSavings ||
      0
    ) *
    quantity;


  console.log(
    "Matched:",
    product.productName
  );


  console.log(
    "Score:",
    result.score
  );


  console.log(
    "Reasons:",
    result.reasons
  );


  console.log(
    "Unit price:",
    formatMoney(
      product.price
    )
  );


  console.log(
    "Quantity:",
    quantity
  );


  console.log(
    "Line total:",
    formatMoney(
      lineTotal
    )
  );


  console.log(
    "In stock:",
    product.inStock
  );


  console.log(
    "Promotion:",
    product.isPromotion
  );


  console.log(
    "Promotion savings:",
    formatMoney(
      promotionSavings
    )
  );


  /*
   * ----------------------------------------------
   * Show top candidates
   * ----------------------------------------------
   */

  console.log(
    "\nTOP CANDIDATES:\n"
  );


  console.table(
    result.candidates.map(
      candidate => ({
        product:
          candidate.product
            ?.productName,

        price:
          formatMoney(
            candidate.product
              ?.price
          ),

        score:
          candidate.score,

        reasons:
          candidate.reasons
            ?.join(" | "),
      })
    )
  );

}


/*
 * ------------------------------------------------
 * Run
 * ------------------------------------------------
 */

main().catch(
  error => {

    console.error(
      "\nPnP product test failed:"
    );

    console.error(
      error
    );

    process.exitCode = 1;

  }
);
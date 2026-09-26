require("dotenv").config({
  path: ".env.local",
});


const {
  searchPnpStoreProducts,
} = require(
  "../app/_lib/grocery/providers/pnp"
);


const stores = [
  {
    name:
      "PnP Musgrave Road",

    storeId:
      "KC06",
  },

  {
    name:
      "PnP Westwood",

    storeId:
      "KC20",
  },
];


/*
 * ------------------------------------------------
 * Extract products from Parse response
 * ------------------------------------------------
 */

function extractProducts(response) {

  return (
    response?.products ||
    response?.data?.products ||
    response?.data?.items ||
    response?.items ||
    []
  );

}


/*
 * ------------------------------------------------
 * Test one store
 * ------------------------------------------------
 */

async function testStore(
  store,
  query
) {

  console.log(
    "\n========================================"
  );

  console.log(
    store.name
  );

  console.log(
    `STORE ID: ${store.storeId}`
  );

  console.log(
    "========================================\n"
  );


  /*
   * ----------------------------------------------
   * Search store-specific products
   * ----------------------------------------------
   */

  const response =
    await searchPnpStoreProducts(
      query,
      store.storeId,
      {
        page: 0,
        pageSize: 10,
      }
    );


  /*
   * ----------------------------------------------
   * Response context
   * ----------------------------------------------
   */

  console.log(
    "Response storeId:",
    response?.storeId
  );

  console.log(
    "Response query:",
    response?.query
  );


  /*
   * ----------------------------------------------
   * Extract products
   * ----------------------------------------------
   */

  const products =
    extractProducts(
      response
    );


  console.log(
    "\n=============================="
  );

  console.log(
    `RAW PRODUCTS FOUND: ${products.length}`
  );

  console.log(
    "==============================\n"
  );


  /*
   * ----------------------------------------------
   * Print FULL raw product data
   * ----------------------------------------------
   *
   * This is the important part for investigating
   * PnP promotions and Smart Shopper pricing.
   * ----------------------------------------------
   */

  console.log(
    "=============================="
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
   * Compact product table
   * ----------------------------------------------
   */

  console.log(
    "\n=============================="
  );

  console.log(
    "PRODUCT SUMMARY"
  );

  console.log(
    "==============================\n"
  );


  console.table(
    products.map(
      product => ({

        name:
          product.name,

        storeId:
          product.storeId,

        price:
          product.price,

        oldPrice:
          product.oldPrice,

        savings:
          product.savings,

        promotion:
          product.onPromotion,

        available:
          product.available,

        inStock:
          product.inStock,

        stockLevel:
          product.stockLevel,

        stockStatus:
          product.stockStatus,

        code:
          product.code,

      })
    )
  );


  return {
    store,
    response,
    products,
  };

}


/*
 * ------------------------------------------------
 * Main
 * ------------------------------------------------
 */

async function main() {

  const query =
    process.argv
      .slice(2)
      .join(" ") ||
    "Tastic Rice 2kg";


  console.log(
    "\n================================"
  );

  console.log(
    "PNP STORE-SPECIFIC PRICE TEST"
  );

  console.log(
    "================================"
  );

  console.log(
    "Product:",
    query
  );


  const results = [];


  /*
   * Sequential deliberately because
   * of Parse rate limits.
   */

  for (
    const store
    of stores
  ) {

    const result =
      await testStore(
        store,
        query
      );

    results.push(
      result
    );


    /*
     * Give Parse a little breathing room
     * between requests.
     */

    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          3000
        )
    );

  }


  /*
   * ------------------------------------------------
   * Compare stores
   * ------------------------------------------------
   */

  console.log(
    "\n=============================="
  );

  console.log(
    "STORE COMPARISON"
  );

  console.log(
    "==============================\n"
  );


  console.table(
    results.map(
      result => {

        const firstProduct =
          result.products[0];


        return {

          store:
            result.store.name,

          requestedStoreId:
            result.store.storeId,

          responseStoreId:
            result.response
              ?.storeId,

          productStoreId:
            firstProduct
              ?.storeId,

          product:
            firstProduct
              ?.name,

          price:
            firstProduct
              ?.price,

          oldPrice:
            firstProduct
              ?.oldPrice,

          savings:
            firstProduct
              ?.savings,

          promotion:
            firstProduct
              ?.onPromotion,

          available:
            firstProduct
              ?.available,

          stockLevel:
            firstProduct
              ?.stockLevel,

        };

      }
    )
  );

}


/*
 * ------------------------------------------------
 * Run
 * ------------------------------------------------
 */

main()
  .catch(
    error => {

      console.error(
        "\nPnP store test failed:"
      );

      console.error(
        error
      );

      process.exitCode = 1;

    }
  );
require("dotenv").config({
  path: ".env.local",
});

const {
  searchCheckersStoreProducts,
} = require(
  "../app/_lib/grocery/providers/checkers"
);


/*
 * ----------------------------------------
 * Test stores
 * ----------------------------------------
 */

const stores = [
  {
    name: "Checkers Musgrave Centre",
    storeId: "162387",
  },
  {
    name: "Checkers FX Westwood Mall",
    storeId: "168545",
  },
];


const query =
  "Tastic Rice 2kg";


/*
 * ----------------------------------------
 * Test one store
 * ----------------------------------------
 */

async function testStore(store) {

  console.log(
    "\n================================"
  );

  console.log(store.name);

  console.log(
    `Requested Store ID: ${store.storeId}`
  );

  console.log(
    "================================\n"
  );


  const response =
    await searchCheckersStoreProducts(
      query,
      store.storeId,
      {
        page: 0,
        limit: 10,
      }
    );


  /*
   * Parse responses sometimes
   * contain a data wrapper.
   */
  const data =
    response?.data ??
    response;


  console.log(
    "Response Store ID:",
    data?.storeId
  );

  console.log(
    "Response Store Name:",
    data?.storeName
  );

  console.log(
    "Response Store Brand:",
    data?.storeBrand
  );

  console.log(
    "Response Query:",
    data?.query
  );

  console.log(
    "Total Count:",
    data?.totalCount
  );


  const products =
    Array.isArray(data?.products)
      ? data.products
      : [];


  console.log(
    "\nProducts received:",
    products.length
  );


  console.table(
    products.map(product => ({
      name:
        product.displayName ??
        product.name ??
        null,

      storeId:
        product.storeId ??
        product.store?.storeId ??
        null,

      price:
        product.price ??
        null,

      priceWithoutDecimal:
        product.priceWithoutDecimal ??
        null,

      oldPrice:
        product.oldPrice ??
        null,

      discount:
        product.discount ??
        null,

      promotion:
        product.isOnPromotion ??
        null,

      available:
        product.isStockAvailable ??
        null,

      stockOnHand:
        product.stockOnHand ??
        null,

      articleNumber:
        product.articleNumber ??
        null,

      id:
        product.id ??
        null,
    }))
  );


  /*
   * We especially want this because
   * we don't yet know the exact schema
   * of products[] from the new endpoint.
   */
  if (products.length > 0) {

    console.log(
      "\nFIRST RAW PRODUCT"
    );

    console.log(
      "================================\n"
    );

    console.dir(
      products[0],
      {
        depth: null,
      }
    );

  }


  return {
    store,
    data,
    products,
  };
}


/*
 * ----------------------------------------
 * Main
 * ----------------------------------------
 */

async function main() {

  console.log(
    "\n================================"
  );

  console.log(
    "CHECKERS STORE-SPECIFIC TEST"
  );

  console.log(
    "================================"
  );

  console.log(
    "Product:",
    query
  );


  const results = [];


  for (const store of stores) {

    const result =
      await testStore(store);

    results.push(result);


    /*
     * Avoid hitting Parse rate limit.
     */
    await new Promise(
      resolve =>
        setTimeout(resolve, 3000)
    );

  }


  /*
   * ----------------------------------------
   * Comparison
   * ----------------------------------------
   */

  console.log(
    "\n================================"
  );

  console.log(
    "STORE COMPARISON"
  );

  console.log(
    "================================\n"
  );


  console.table(
    results.map(result => {

      const firstProduct =
        result.products[0] ??
        null;


      return {

        requestedStore:
          result.store.name,

        requestedStoreId:
          result.store.storeId,

        responseStoreId:
          result.data?.storeId ??
          null,

        responseStoreName:
          result.data?.storeName ??
          null,

        product:
          firstProduct?.displayName ??
          firstProduct?.name ??
          null,

        productStoreId:
          firstProduct?.storeId ??
          firstProduct?.store?.storeId ??
          null,

        price:
          firstProduct?.price ??
          null,

        available:
          firstProduct?.isStockAvailable ??
          null,

        stockOnHand:
          firstProduct?.stockOnHand ??
          null,
      };

    })
  );

}


main().catch(error => {

  console.error(
    "\nCHECKERS STORE TEST FAILED"
  );

  console.error(
    error
  );

  process.exitCode = 1;

});
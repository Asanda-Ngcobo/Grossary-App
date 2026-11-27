
require("dotenv").config({
  path: ".env.local",
});

const {
  searchReefProducts,
} = require("./searchReefProducts");


/*
 * ----------------------------------------
 * Test configuration
 * ----------------------------------------
 */

const query =
  "Golden Cloud Brown Bread Wheat Flour 2.5kg";


const location = {
  name: "Checkers Musgrave Road",

  // Add the coordinates for the location
  // you want ReefAPI to use.
  latitude: -29.8490,
  longitude: 30.9996,
};


/*
 * ----------------------------------------
 * Extract products
 * ----------------------------------------
 */

function extractProducts(response) {

  return (
    response?.data?.products ||
    response?.data?.items ||
    response?.products ||
    response?.items ||
    []
  );

}


/*
 * ----------------------------------------
 * Test one location
 * ----------------------------------------
 */

async function testLocation(location) {

  console.log(
    "\n================================"
  );

  console.log(location.name);

  console.log(
    "================================\n"
  );


  const response =
    await searchReefProducts(
      query,
      {
        latitude: location.latitude,
        longitude: location.longitude,

        page: 1,
        pageSize: 10,
      }
    );


  /*
   * ----------------------------------------
   * Response context
   * ----------------------------------------
   */

  console.log(
    "Response success:",
    response?.ok
  );

  console.log(
    "Response message:",
    response?.message
  );


  /*
   * ----------------------------------------
   * Extract products
   * ----------------------------------------
   */

  const products =
    extractProducts(response);


  console.log(
    "\nProducts received:",
    products.length
  );


  /*
   * ----------------------------------------
   * Product summary
   * ----------------------------------------
   */

  console.table(
    products.map(product => ({

      name:
        product.name ??
        product.title ??
        product.description ??
        null,

      productId:
        product.product_id ??
        product.id ??
        null,

      brand:
        product.brand ??
        null,

      price:
        product.price ??
        null,

      memberPrice:
        product.member_price ??
        null,

      wasPrice:
        product.was_price ??
        null,

      barcode:
        product.barcode ??
        null,

      stock:
        product.stock ??
        null,

      image:
        product.image ??
        null,

    }))
  );


  /*
   * ----------------------------------------
   * Print FULL raw product data
   * ----------------------------------------
   */

  if (products.length > 0) {

    console.log(
      "\n================================"
    );

    console.log(
      "FIRST RAW PRODUCT"
    );

    console.log(
      "================================\n"
    );

    console.dir(
      products[0],
      {
        depth: null,
        colors: true,
      }
    );

  }


  /*
   * ----------------------------------------
   * Print FULL raw response
   * ----------------------------------------
   */

  console.log(
    "\n================================"
  );

  console.log(
    "FULL RAW REEFAPI RESPONSE"
  );

  console.log(
    "================================\n"
  );

  console.dir(
    response,
    {
      depth: null,
      colors: true,
    }
  );


  return {
    location,
    response,
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
    "REEFAPI CHECKERS PRODUCT SEARCH"
  );

  console.log(
    "================================"
  );

  console.log(
    "Search query:",
    query
  );


  const result =
    await testLocation(location);


  console.log(
    "\n================================"
  );

  console.log(
    "SEARCH COMPLETED"
  );

  console.log(
    "================================"
  );

}


main().catch(error => {

  console.error(
    "\nREEFAPI SEARCH FAILED"
  );

  console.error(error);

  process.exitCode = 1;

});


require("dotenv").config({
  path: ".env.local",
});

const {
  getProduct,
} = require("./reefapi");


/*
 * ----------------------------------------
 * Test product
 * ----------------------------------------
 */
const product = {
  name: "SASKO Cake Wheat Flour Bag 2.5kg",

  productId: "10137552EA",

  latitude: -29.849,
  longitude: 30.9996,

  site: "checkers",
};

/*
 * ----------------------------------------
 * Extract product data
 * ----------------------------------------
 */

function extractProduct(response) {

  return (
    response?.data?.product ||
    response?.data ||
    response?.product ||
    response
  );

}


/*
 * ----------------------------------------
 * Test one product
 * ----------------------------------------
 */

async function testProduct(product) {

  console.log(
    "\n================================"
  );

  console.log(
    "REEF API PRODUCT TEST"
  );

  console.log(
    "================================\n"
  );

  console.log(
    "Product:",
    product.name
  );

  console.log(
    "Product ID:",
    product.productId
  );

  console.log(
    "Site:",
    product.site
  );

  console.log(
    "Latitude:",
    product.latitude
  );

  console.log(
    "Longitude:",
    product.longitude
  );


  /*
   * ----------------------------------------
   * Call ReefAPI
   * ----------------------------------------
   */

  const response =
    await getProduct({

      productId:
        product.productId,

      latitude:
        product.latitude,

      longitude:
        product.longitude,

      site:
        product.site,

    });


  /*
   * ----------------------------------------
   * Response context
   * ----------------------------------------
   */

  console.log(
    "\n================================"
  );

  console.log(
    "RESPONSE CONTEXT"
  );

  console.log(
    "================================\n"
  );

  console.log(
    "Success:",
    response?.ok
  );

  console.log(
    "Message:",
    response?.message
  );


  /*
   * ----------------------------------------
   * Extract product
   * ----------------------------------------
   */

  const productData =
    extractProduct(response);


  /*
   * ----------------------------------------
   * Full raw response
   * ----------------------------------------
   */

  console.log(
    "\n================================"
  );

  console.log(
    "RAW REEF API RESPONSE"
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


  /*
   * ----------------------------------------
   * Product summary
   * ----------------------------------------
   */

  console.log(
    "\n================================"
  );

  console.log(
    "PRODUCT SUMMARY"
  );

  console.log(
    "================================\n"
  );

  console.table([{

    name:
      productData?.name ??
      productData?.title ??
      null,

    productId:
      productData?.product_id ??
      productData?.id ??
      null,

    brand:
      productData?.brand ??
      null,

    price:
      productData?.price ??
      null,

    memberPrice:
      productData?.member_price ??
      null,

    wasPrice:
      productData?.was_price ??
      null,

    pricePerKg:
      productData?.price_per_kg ??
      null,

    offers:
      Array.isArray(productData?.offers)
        ? productData.offers.length
        : null,

    stock:
      productData?.stock ??
      null,

    barcode:
      productData?.barcode ??
      null,

    image:
      productData?.image ??
      null,

  }]);


  /*
   * ----------------------------------------
   * Promotions
   * ----------------------------------------
   */

  console.log(
    "\n================================"
  );

  console.log(
    "PROMOTION DETAILS"
  );

  console.log(
    "================================\n"
  );

  console.dir(
    productData?.offers ?? [],
    {
      depth: null,
      colors: true,
    }
  );


  return {
    product,
    response,
    productData,
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
    "REEF API CHECKERS TEST"
  );

  console.log(
    "================================"
  );


  const result =
    await testProduct(product);


  console.log(
    "\n================================"
  );

  console.log(
    "TEST COMPLETED"
  );

  console.log(
    "================================\n"
  );

}


main().catch(error => {

  console.error(
    "\nREEF API TEST FAILED"
  );

  console.error(error);

  process.exitCode = 1;

});

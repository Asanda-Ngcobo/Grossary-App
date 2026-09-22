/*
 * ------------------------------------------------
 * PnP Product Normalizer
 * ------------------------------------------------
 *
 * Supports:
 *
 * 1. search_products
 * 2. search_store_products
 *
 * Converts both Parse response formats into the
 * same internal Grossary product structure.
 */


/*
 * ------------------------------------------------
 * Number helper
 * ------------------------------------------------
 */

function toNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


/*
 * ------------------------------------------------
 * Image helper
 * ------------------------------------------------
 */

function getImage(images) {
  if (!Array.isArray(images)) {
    return null;
  }


  /*
   * Prefer full product image
   */
  const productImage =
    images.find(
      image =>
        image?.format === "product" &&
        image?.imageType === "PRIMARY"
    );

  if (productImage?.url) {
    return productImage.url;
  }


  /*
   * Then listing image
   */
  const listingImage =
    images.find(
      image =>
        image?.format === "listing" &&
        image?.imageType === "PRIMARY"
    );

  if (listingImage?.url) {
    return listingImage.url;
  }


  /*
   * New store endpoint may return
   * images in a simpler format.
   */
  const primaryImage =
    images.find(
      image =>
        image?.imageType === "PRIMARY" &&
        image?.url
    );

  if (primaryImage?.url) {
    return primaryImage.url;
  }


  /*
   * String URL fallback
   */
  const stringImage =
    images.find(
      image =>
        typeof image === "string"
    );

  if (stringImage) {
    return stringImage;
  }


  /*
   * Any image with URL
   */
  return (
    images.find(
      image =>
        image?.url
    )?.url ||
    null
  );
}


/*
 * ------------------------------------------------
 * Detect endpoint format
 * ------------------------------------------------
 */

function isStoreProduct(product) {
  return Boolean(
    product?.storeId
  );
}


/*
 * ------------------------------------------------
 * Price
 * ------------------------------------------------
 */

function getPrice(product) {

  /*
   * New search_store_products:
   *
   * price: 39.99
   */
  if (
    typeof product?.price ===
    "number"
  ) {
    return toNumber(
      product.price
    );
  }


  /*
   * Sometimes APIs return numeric
   * values as strings.
   */
  if (
    typeof product?.price ===
    "string"
  ) {
    return toNumber(
      product.price
    );
  }


  /*
   * Original search_products:
   *
   * price: {
   *   value: 42.99
   * }
   */
  return toNumber(
    product?.price?.value
  );
}


/*
 * ------------------------------------------------
 * Old / regular price
 * ------------------------------------------------
 */

function getOldPrice(product) {

  /*
   * New store endpoint
   */
  const directOldPrice =
    toNumber(
      product?.oldPrice
    );

  if (
    directOldPrice !== null &&
    directOldPrice > 0
  ) {
    return directOldPrice;
  }


  /*
   * Original endpoint
   */
  const nestedOldPrice =
    toNumber(
      product?.price?.oldPrice
    );

  if (
    nestedOldPrice !== null &&
    nestedOldPrice > 0
  ) {
    return nestedOldPrice;
  }


  return null;
}


/*
 * ------------------------------------------------
 * Promotional saving
 * ------------------------------------------------
 */

function getSavings(product) {

  /*
   * New store endpoint gives:
   *
   * savings: 5
   */
  const directSavings =
    toNumber(
      product?.savings
    );

  if (
    directSavings !== null &&
    directSavings > 0
  ) {
    return directSavings;
  }


  /*
   * Original endpoint:
   *
   * price.savings
   */
  const nestedSavings =
    toNumber(
      product?.price?.savings
    );

  if (
    nestedSavings !== null &&
    nestedSavings > 0
  ) {
    return nestedSavings;
  }


  return 0;
}


/*
 * ------------------------------------------------
 * Promotion status
 * ------------------------------------------------
 */

function getPromotionStatus(
  product,
  savings,
  oldPrice,
  price
) {

  /*
   * New store endpoint
   */
  if (
    product?.onPromotion ===
    true
  ) {
    return true;
  }


  /*
   * Original endpoint
   */
  if (
    product?.isOnPromotion ===
    true
  ) {
    return true;
  }


  /*
   * Explicit advertised savings
   */
  if (
    savings > 0
  ) {
    return true;
  }


  /*
   * Fallback only for identifying
   * that a markdown exists.
   *
   * We still DO NOT calculate
   * promotionalSavings from this.
   */
  if (
    oldPrice !== null &&
    price !== null &&
    oldPrice > price
  ) {
    return true;
  }


  return false;
}


/*
 * ------------------------------------------------
 * Stock status
 * ------------------------------------------------
 */

function getStockStatus(
  product
) {

  /*
   * IMPORTANT:
   *
   * New store endpoint can return:
   *
   * available: true
   * inStock: false
   * stockLevel: 0
   * stockStatus: "outOfStock"
   *
   * Therefore "available" must NOT
   * override branch stock information.
   */


  /*
   * 1. Explicit branch stock status
   */
  if (
    product?.stockStatus ===
    "outOfStock"
  ) {
    return false;
  }


  if (
    product?.stockStatus ===
    "inStock"
  ) {
    return true;
  }


  /*
   * 2. Explicit branch boolean
   */
  if (
    product?.inStock ===
    false
  ) {
    return false;
  }


  if (
    product?.inStock ===
    true
  ) {
    return true;
  }


  /*
   * 3. Explicit numeric stock level
   */
  const stockLevel =
    toNumber(
      product?.stockLevel
    );


  if (
    stockLevel !== null
  ) {
    return stockLevel > 0;
  }


  /*
   * 4. Original endpoint
   */
  if (
    product
      ?.stock
      ?.stockLevelStatus ===
    "outOfStock"
  ) {
    return false;
  }


  if (
    product
      ?.stock
      ?.stockLevelStatus ===
    "inStock"
  ) {
    return true;
  }


  /*
   * 5. Old boolean
   */
  if (
    product?.inStockIndicator ===
    false
  ) {
    return false;
  }


  if (
    product?.inStockIndicator ===
    true
  ) {
    return true;
  }


  /*
   * 6. Lowest-confidence fallback
   */
  return (
    product?.available === true
  );
}


/*
 * ------------------------------------------------
 * Stock level
 * ------------------------------------------------
 */

function getStockLevel(
  product
) {

  const direct =
    toNumber(
      product?.stockLevel
    );


  if (
    direct !== null
  ) {
    return direct;
  }


  /*
   * Future compatibility in case
   * provider starts exposing quantity
   * under nested stock.
   */
  const nested =
    toNumber(
      product
        ?.stock
        ?.stockLevel
    );


  if (
    nested !== null
  ) {
    return nested;
  }


  return null;
}


/*
 * ------------------------------------------------
 * Normalize one PnP product
 * ------------------------------------------------
 */

function normalizePnpProduct(
  product
) {

  if (!product) {
    return null;
  }


  const price =
    getPrice(
      product
    );


  const oldPrice =
    getOldPrice(
      product
    );


  const promotionalSavings =
    getSavings(
      product
    );


  const isPromotion =
    getPromotionStatus(
      product,
      promotionalSavings,
      oldPrice,
      price
    );


  const inStock =
    getStockStatus(
      product
    );


  const stockOnHand =
    getStockLevel(
      product
    );


  return {

    /*
     * ----------------------------
     * Provider
     * ----------------------------
     */

    source:
      isStoreProduct(product)
        ? "parse_pnp_store"
        : "parse_pnp",

    retailer:
      "Pick n Pay",


    /*
     * ----------------------------
     * IDs
     * ----------------------------
     */

    providerProductId:
      product.code ||
      null,

    providerStoreId:
      product.storeId ||
      null,


    /*
     * ----------------------------
     * Product
     * ----------------------------
     */

    productName:
      product.name ||
      null,


    /*
     * IMPORTANT:
     *
     * brandSellerId is supplier /
     * manufacturer and is NOT always
     * the consumer-facing brand.
     *
     * Example:
     * Tastic → TIGER BRANDS
     */
    brand:
      null,

    supplier:
      product.brandSellerId ||
      null,


    /*
     * ----------------------------
     * Barcode
     * ----------------------------
     */

    barcode:
      null,

    barcodes:
      [],


    /*
     * ----------------------------
     * Price
     * ----------------------------
     */

    price,

    regularPrice:
      oldPrice !== null
        ? oldPrice
        : price,


    /*
     * We use Parse/PnP's explicit
     * advertised saving.
     *
     * Do NOT calculate this from
     * oldPrice - price.
     */
    promotionalSavings:
      Number(
        (
          promotionalSavings ||
          0
        ).toFixed(2)
      ),

    isPromotion,


    /*
     * ----------------------------
     * Stock
     * ----------------------------
     */

    inStock,

    stockOnHand,

    stockStatus:
      product.stockStatus ||
      product
        ?.stock
        ?.stockLevelStatus ||
      null,

    available:
      product.available ??
      null,


    /*
     * ----------------------------
     * Media
     * ----------------------------
     */

    imageUrl:
      getImage(
        product.images
      ),


    /*
     * ----------------------------
     * Categories
     * ----------------------------
     */

    categories:
      Array.isArray(
        product.categoryNames
      )
        ? product.categoryNames
        : [],


    /*
     * ----------------------------
     * Other metadata
     * ----------------------------
     */

    onlineOnly:
      product
        ?.price
        ?.onlineOnlyPrice ===
      true,

    sponsored:
      product
        ?.sponsoredProduct ===
      true,

    articleNumber:
      null,


    /*
     * ----------------------------
     * Keep raw provider response
     * ----------------------------
     */

    raw:
      product,
  };
}


/*
 * ------------------------------------------------
 * Normalize array
 * ------------------------------------------------
 */

function normalizePnpProducts(
  products
) {

  if (
    !Array.isArray(
      products
    )
  ) {
    return [];
  }


  return products
    .map(
      normalizePnpProduct
    )
    .filter(Boolean);
}


module.exports = {
  normalizePnpProduct,
  normalizePnpProducts,
};
function toNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


/*
 * ------------------------------------------------
 * Price
 * ------------------------------------------------
 */

function getPrice(product) {
  /*
   * New store-specific endpoint
   *
   * price: 39.99
   */
  const directPrice =
    toNumber(product?.price);

  if (directPrice !== null) {
    return directPrice;
  }


  /*
   * Old generic endpoint
   *
   * priceWithoutDecimal: 3999
   */
  const cents =
    toNumber(
      product?.priceWithoutDecimal
    );

  if (cents !== null) {
    return cents / 100;
  }


  return null;
}


/*
 * ------------------------------------------------
 * Regular / old price
 * ------------------------------------------------
 */

function getOldPrice(product) {
  const oldPrice =
    toNumber(product?.oldPrice);

  if (
    oldPrice !== null &&
    oldPrice > 0
  ) {
    return oldPrice;
  }


  const oldPriceCents =
    toNumber(
      product?.oldPriceWithoutDecimal
    );

  if (
    oldPriceCents !== null &&
    oldPriceCents > 0
  ) {
    return oldPriceCents / 100;
  }


  return null;
}


/*
 * ------------------------------------------------
 * Promotional saving
 * ------------------------------------------------
 */

function getPromotionalSavings(
  product
) {
  /*
   * New store endpoint explicitly
   * provides promotionSaving.
   *
   * This is preferable to calculating:
   *
   * oldPrice - price
   */
  const saving =
    toNumber(
      product?.promotionSaving
    );

  if (
    saving !== null &&
    saving > 0
  ) {
    return saving;
  }


  /*
   * Older generic endpoint sometimes
   * exposed discount.
   *
   * Only use it when it is numeric.
   */
  const discount =
    toNumber(
      product?.discount
    );

  if (
    discount !== null &&
    discount > 0
  ) {
    return discount;
  }


  return 0;
}


/*
 * ------------------------------------------------
 * Image
 * ------------------------------------------------
 */

function getImage(product) {
  /*
   * New endpoint
   */
  if (
    Array.isArray(
      product?.imageUrls
    ) &&
    product.imageUrls.length > 0
  ) {
    return (
      product.imageUrls[0] ||
      null
    );
  }


  /*
   * Old endpoint
   */
  return (
    product?.imageProductCardURL ||
    product?.imageURL ||
    null
  );
}


/*
 * ------------------------------------------------
 * Stock
 * ------------------------------------------------
 */

function getStockStatus(product) {
  /*
   * Old Checkers endpoint exposes
   * explicit stock information.
   */
  if (
    product?.isStockAvailable ===
    true
  ) {
    return true;
  }


  if (
    product?.isStockAvailable ===
    false
  ) {
    return false;
  }


  if (
    product?.outOfStock === true
  ) {
    return false;
  }


  if (
    product?.outOfStock === false
  ) {
    return true;
  }


  /*
   * New search_store_products response
   * currently does NOT expose stock
   * availability.
   *
   * Do not invent true/false.
   */
  return null;
}


/*
 * ------------------------------------------------
 * Normalize one product
 * ------------------------------------------------
 */

function normalizeCheckersProduct(
  product
) {
  if (!product) {
    return null;
  }


  const price =
    getPrice(product);

  const oldPrice =
    getOldPrice(product);

  const promotionalSavings =
    getPromotionalSavings(product);


  const isPromotion =
    product?.isOnPromotion === true ||
    promotionalSavings > 0;


  const inStock =
    getStockStatus(product);


  return {
    /*
     * Provider
     */
    source:
      product?.storeId
        ? "parse_checkers_store"
        : "parse_checkers",

    retailer:
      "Checkers",


    /*
     * IDs
     */
    providerProductId:
      product.id ||
      null,

    providerStoreId:
      product.storeId ||
      product.store?.storeId ||
      null,

    articleNumber:
      product.articleNumber ||
      null,


    /*
     * Product
     */
    productName:
      product.displayName ||
      product.name ||
      null,

    brand:
      product.brand ||
      null,


    /*
     * Barcode
     */
    barcode:
      Array.isArray(
        product.barcodes
      )
        ? product.barcodes[0] ||
          null
        : null,

    barcodes:
      Array.isArray(
        product.barcodes
      )
        ? product.barcodes
        : [],


    /*
     * Pricing
     */
    price,

    regularPrice:
      oldPrice !== null
        ? oldPrice
        : price,

    promotionalSavings:
      Number(
        promotionalSavings
          .toFixed(2)
      ),

    isPromotion,


    /*
     * Stock
     */
    inStock,

    stockOnHand:
      product.stockOnHand ??
      null,


    /*
     * Unit
     */
    unitOfMeasure:
      product.unitOfMeasure ||
      null,


    /*
     * Images
     */
    imageUrl:
      getImage(product),


    /*
     * Promotion metadata
     */
    bonusBuyIds:
      Array.isArray(
        product.bonusBuyIds
      )
        ? product.bonusBuyIds
        : [],


    /*
     * Keep original response
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

function normalizeCheckersProducts(
  products
) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products
    .map(
      normalizeCheckersProduct
    )
    .filter(Boolean);
}


module.exports = {
  normalizeCheckersProduct,
  normalizeCheckersProducts,
};
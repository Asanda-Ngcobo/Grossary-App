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
 * Handles:
 *
 * - Standard PnP promotions
 * - Smart Shopper promotions
 * - Fixed-price Smart Shopper promotions
 * - Multi-buy Smart Shopper promotions
 * - Promotion dates
 * - Store-specific stock
 *
 *
 * IMPORTANT:
 *
 * STANDARD PNP PROMOTION
 *
 * Example:
 *
 * price.value = 14.99
 * price.oldPrice = 17.99
 * price.savings = 3
 *
 * Normalized:
 *
 * price = 14.99
 * regularPrice = 17.99
 * promotionalSavings = 3
 *
 *
 * SMART SHOPPER FIXED PRICE
 *
 * Example:
 *
 * price = 39.99
 * promotion message = "R29.99"
 *
 * Normalized:
 *
 * price = 39.99
 * loyaltyPrice = 29.99
 * loyaltySavings = 10
 * promotionMechanic = "FIXED_PRICE"
 *
 *
 * SMART SHOPPER MULTI-BUY
 *
 * Example:
 *
 * price = 21.99
 * promotion message = "2 For R32.00"
 *
 * Normalized:
 *
 * price = 21.99
 * loyaltyPrice = 16
 * loyaltySavings = 11.98
 * promotionMechanic = "MULTIBUY"
 * promotionQuantity = 2
 * promotionBundlePrice = 32
 *
 *
 * IMPORTANT:
 *
 * loyaltyPrice for MULTIBUY represents the
 * effective unit price only.
 *
 * It must NOT later be blindly multiplied
 * by the user's quantity.
 *
 * The optimizer must respect:
 *
 * promotionQuantity
 * promotionBundlePrice
 *
 * ------------------------------------------------
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
 * Promotion message parser
 * ------------------------------------------------
 *
 * Supported examples:
 *
 * R29.99
 *
 * ->
 *
 * {
 *   mechanic: "FIXED_PRICE",
 *   quantity: 1,
 *   bundlePrice: 29.99,
 *   unitPrice: 29.99
 * }
 *
 *
 * 2 For R32.00
 *
 * ->
 *
 * {
 *   mechanic: "MULTIBUY",
 *   quantity: 2,
 *   bundlePrice: 32,
 *   unitPrice: 16
 * }
 *
 *
 * Unknown formats are preserved in the
 * promotion metadata but are NOT used to
 * calculate prices.
 * ------------------------------------------------
 */

function parsePromotionMessage(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return null;

  }


  const text =
    value.trim();


  /*
   * ------------------------------------------------
   * Fixed price
   *
   * R29.99
   * R30
   * ------------------------------------------------
   */

  const fixedPriceMatch =
    text.match(
      /^R\s*(\d+(?:\.\d{1,2})?)$/i
    );


  if (fixedPriceMatch) {

    const price =
      toNumber(
        fixedPriceMatch[1]
      );


    if (
      price === null
    ) {

      return null;

    }


    return {

      mechanic:
        "FIXED_PRICE",

      quantity:
        1,

      bundlePrice:
        price,

      unitPrice:
        price,

    };

  }


  /*
   * ------------------------------------------------
   * Multi-buy
   *
   * 2 For R32.00
   * 2 FOR R32
   * 3 for R50
   * 4 For R100.00
   * ------------------------------------------------
   */

  const multiBuyMatch =
    text.match(
      /^(\d+)\s*FOR\s*R\s*(\d+(?:\.\d{1,2})?)$/i
    );


  if (multiBuyMatch) {

    const quantity =
      toNumber(
        multiBuyMatch[1]
      );


    const bundlePrice =
      toNumber(
        multiBuyMatch[2]
      );


    if (
      quantity === null ||
      quantity <= 0 ||
      bundlePrice === null ||
      bundlePrice < 0
    ) {

      return null;

    }


    return {

      mechanic:
        "MULTIBUY",

      quantity,

      bundlePrice,

      unitPrice:
        Number(
          (
            bundlePrice /
            quantity
          ).toFixed(2)
        ),

    };

  }


  /*
   * Promotion exists, but we don't
   * understand its pricing mechanic.
   *
   * Do not guess.
   */

  return {

    mechanic:
      "UNKNOWN",

    quantity:
      null,

    bundlePrice:
      null,

    unitPrice:
      null,

  };
}


/*
 * ------------------------------------------------
 * Image helper
 * ------------------------------------------------
 */

function getImage(images) {

  if (
    !Array.isArray(images)
  ) {

    return null;

  }


  const productImage =
    images.find(
      image =>
        image?.format ===
          "product" &&
        image?.imageType ===
          "PRIMARY"
    );


  if (
    productImage?.url
  ) {

    return productImage.url;

  }


  const listingImage =
    images.find(
      image =>
        image?.format ===
          "listing" &&
        image?.imageType ===
          "PRIMARY"
    );


  if (
    listingImage?.url
  ) {

    return listingImage.url;

  }


  const primaryImage =
    images.find(
      image =>
        image?.imageType ===
          "PRIMARY" &&
        image?.url
    );


  if (
    primaryImage?.url
  ) {

    return primaryImage.url;

  }


  const stringImage =
    images.find(
      image =>
        typeof image ===
          "string"
    );


  if (
    stringImage
  ) {

    return stringImage;

  }


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

function isStoreProduct(
  product
) {

  return Boolean(
    product?.storeId
  );
}


/*
 * ------------------------------------------------
 * Price
 * ------------------------------------------------
 */

function getPrice(
  product
) {

  /*
   * search_store_products
   */

  if (
    typeof product?.price ===
      "number"
  ) {

    return toNumber(
      product.price
    );

  }


  if (
    typeof product?.price ===
      "string"
  ) {

    return toNumber(
      product.price
    );

  }


  /*
   * search_products
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

function getOldPrice(
  product
) {

  /*
   * search_store_products
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
   * search_products
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
 * Standard promotional saving
 * ------------------------------------------------
 */

function getSavings(
  product
) {

  /*
   * search_store_products
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
   * search_products
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
 * Get promotions
 * ------------------------------------------------
 *
 * STORE ENDPOINT:
 *
 * promotions: [
 *   {
 *     code: "...",
 *     message: "R29.99",
 *     type: "SMART_SHOPPER",
 *     startDate: "...",
 *     endDate: "..."
 *   }
 * ]
 *
 *
 * GENERAL ENDPOINT:
 *
 * potentialPromotions: [
 *   {
 *     code: "...",
 *     promotionTextMessage: "R29.99",
 *     promotionDisplayType: "SMART_SHOPPER",
 *     startDate: "...",
 *     endDate: "...",
 *     valid: false
 *   }
 * ]
 * ------------------------------------------------
 */

function getPromotions(
  product
) {

  /*
   * Store-specific endpoint.
   *
   * Already comes in the structure
   * we want.
   */

  if (
    Array.isArray(
      product?.promotions
    )
  ) {

    return product.promotions;

  }


  /*
   * General search endpoint.
   *
   * Convert its naming into the same
   * shape as the store endpoint.
   */

  if (
    Array.isArray(
      product
        ?.potentialPromotions
    )
  ) {

    return product
      .potentialPromotions
      .map(
        promotion => ({

          code:
            promotion?.code ||
            null,

          message:
            promotion
              ?.promotionTextMessage ||
            null,

          type:
            promotion
              ?.promotionDisplayType ||
            null,

          startDate:
            promotion?.startDate ||
            null,

          endDate:
            promotion?.endDate ||
            null,

          valid:
            promotion?.valid,

        })
      );

  }


  return [];
}


/*
 * ------------------------------------------------
 * Smart Shopper promotion
 * ------------------------------------------------
 */

function getSmartShopperPromotion(
  product
) {

  const promotions =
    getPromotions(
      product
    );


  const smartShopperPromotions =
    promotions.filter(
      promotion =>
        String(
          promotion?.type ||
          ""
        )
          .toUpperCase()
          .includes(
            "SMART_SHOPPER"
          )
    );


  if (
    !smartShopperPromotions.length
  ) {

    return null;

  }


  /*
   * Prefer a Smart Shopper promotion
   * whose pricing mechanic Grossary
   * understands.
   */

  const understoodPromotion =
    smartShopperPromotions.find(
      promotion => {

        const parsed =
          parsePromotionMessage(
            promotion?.message
          );


        return (
          parsed &&
          parsed.mechanic !==
            "UNKNOWN"
        );

      }
    );


  return (
    understoodPromotion ||
    smartShopperPromotions[0]
  );
}


/*
 * ------------------------------------------------
 * Promotion type
 * ------------------------------------------------
 */

function getPromotionType(
  product,
  isPromotion
) {

  const smartShopper =
    getSmartShopperPromotion(
      product
    );


  if (
    smartShopper
  ) {

    return "SMART_SHOPPER";

  }


  if (
    isPromotion
  ) {

    return "STANDARD";

  }


  return null;
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
   * Store endpoint
   */

  if (
    product?.onPromotion ===
      true
  ) {

    return true;

  }


  /*
   * General endpoint
   */

  if (
    product?.isOnPromotion ===
      true
  ) {

    return true;

  }


  /*
   * Promotion metadata exists
   */

  if (
    getPromotions(
      product
    ).length > 0
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
   * Price markdown fallback.
   *
   * This is only used to detect that
   * a promotion exists.
   *
   * We do NOT use this calculation
   * as promotionalSavings.
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
   * 3. Explicit stock level
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
    product
      ?.inStockIndicator ===
      false
  ) {

    return false;

  }


  if (
    product
      ?.inStockIndicator ===
      true
  ) {

    return true;

  }


  /*
   * 6. Lowest-confidence fallback
   */

  if (
    product?.available ===
      true
  ) {

    return true;

  }


  if (
    product?.available ===
      false
  ) {

    return false;

  }


  /*
   * Unknown stock should remain unknown.
   *
   * Do not convert unknown to false.
   */

  return null;
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

  if (
    !product
  ) {

    return null;

  }


  /*
   * ----------------------------------------------
   * Standard price
   * ----------------------------------------------
   */

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


  /*
   * ----------------------------------------------
   * Promotion metadata
   * ----------------------------------------------
   */

  const promotions =
    getPromotions(
      product
    );


  const smartShopperPromotion =
    getSmartShopperPromotion(
      product
    );


  /*
   * ----------------------------------------------
   * Parse Smart Shopper pricing mechanic
   * ----------------------------------------------
   */

  const parsedPromotion =
    smartShopperPromotion
      ? parsePromotionMessage(
          smartShopperPromotion
            ?.message
        )
      : null;


  /*
   * Effective per-unit loyalty price.
   *
   * FIXED_PRICE:
   *
   * "R29.99"
   * -> R29.99/unit
   *
   *
   * MULTIBUY:
   *
   * "2 For R32"
   * -> R16/unit effective price
   *
   *
   * IMPORTANT:
   *
   * MULTIBUY loyaltyPrice must NOT be
   * blindly multiplied by arbitrary
   * quantities later.
   *
   * The optimizer must respect:
   *
   * promotionQuantity
   * promotionBundlePrice
   */

  const loyaltyPrice =
    parsedPromotion
      ?.unitPrice ??
    null;


  const promotionMechanic =
    parsedPromotion
      ?.mechanic ??
    null;


  const promotionQuantity =
    parsedPromotion
      ?.quantity ??
    null;


  const promotionBundlePrice =
    parsedPromotion
      ?.bundlePrice ??
    null;


  /*
   * ----------------------------------------------
   * Loyalty savings
   * ----------------------------------------------
   *
   * FIXED_PRICE:
   *
   * Normal:
   * R39.99
   *
   * Smart Shopper:
   * R29.99
   *
   * Saving:
   * R10.00 per item
   *
   *
   * MULTIBUY:
   *
   * Normal:
   * 2 × R21.99 = R43.98
   *
   * Smart Shopper:
   * 2 For R32
   *
   * Saving:
   * R11.98 per qualifying bundle
   * ----------------------------------------------
   */

  let loyaltySavings =
    0;


  if (
    price !== null &&
    parsedPromotion
  ) {

    /*
     * Fixed loyalty price
     */

    if (
      parsedPromotion
        .mechanic ===
        "FIXED_PRICE" &&
      parsedPromotion
        .unitPrice !==
        null &&
      price >
        parsedPromotion
          .unitPrice
    ) {

      loyaltySavings =
        Number(
          (
            price -
            parsedPromotion
              .unitPrice
          ).toFixed(2)
        );

    }


    /*
     * Multi-buy loyalty promotion
     */

    if (
      parsedPromotion
        .mechanic ===
        "MULTIBUY" &&
      parsedPromotion
        .quantity &&
      parsedPromotion
        .bundlePrice !==
        null
    ) {

      const normalBundlePrice =
        price *
        parsedPromotion
          .quantity;


      loyaltySavings =
        Math.max(
          0,
          Number(
            (
              normalBundlePrice -
              parsedPromotion
                .bundlePrice
            ).toFixed(2)
          )
        );

    }

  }


  /*
   * ----------------------------------------------
   * Promotion status
   * ----------------------------------------------
   */

  const isPromotion =
    getPromotionStatus(
      product,
      promotionalSavings,
      oldPrice,
      price
    );


  const promotionType =
    getPromotionType(
      product,
      isPromotion
    );


  /*
   * ----------------------------------------------
   * Promotion dates / details
   * ----------------------------------------------
   */

  const promotionStartsAt =
    smartShopperPromotion
      ?.startDate ||
    promotions[0]
      ?.startDate ||
    null;


  const promotionEndsAt =
    smartShopperPromotion
      ?.endDate ||
    promotions[0]
      ?.endDate ||
    null;


  const promotionCode =
    smartShopperPromotion
      ?.code ||
    promotions[0]
      ?.code ||
    null;


  const promotionMessage =
    smartShopperPromotion
      ?.message ||
    promotions[0]
      ?.message ||
    null;


  /*
   * ----------------------------------------------
   * Stock
   * ----------------------------------------------
   */

  const inStock =
    getStockStatus(
      product
    );


  const stockOnHand =
    getStockLevel(
      product
    );


  /*
   * ----------------------------------------------
   * Normalized product
   * ----------------------------------------------
   */

  return {

    /*
     * --------------------------------------------
     * Provider
     * --------------------------------------------
     */

    source:
      isStoreProduct(
        product
      )
        ? "parse_pnp_store"
        : "parse_pnp",

    retailer:
      "Pick n Pay",


    /*
     * --------------------------------------------
     * IDs
     * --------------------------------------------
     */

    providerProductId:
      product.code ||
      null,

    providerStoreId:
      product.storeId ||
      null,


    /*
     * --------------------------------------------
     * Product
     * --------------------------------------------
     */

    productName:
      product.name ||
      null,


    /*
     * brandSellerId appears to represent
     * supplier/manufacturer rather than
     * necessarily the consumer-facing brand.
     */

    brand:
      null,

    supplier:
      product.brandSellerId ||
      null,


    /*
     * --------------------------------------------
     * Barcode
     * --------------------------------------------
     */

    barcode:
      null,

    barcodes:
      [],


    /*
     * --------------------------------------------
     * Standard pricing
     * --------------------------------------------
     */

    price,

    regularPrice:
      oldPrice !== null
        ? oldPrice
        : price,

    promotionalSavings:
      Number(
        (
          promotionalSavings ||
          0
        ).toFixed(2)
      ),

    isPromotion,


    /*
     * --------------------------------------------
     * Loyalty / Smart Shopper
     * --------------------------------------------
     */

    loyaltyPrice,

    loyaltySavings,

    requiresLoyaltyCard:
      promotionType ===
      "SMART_SHOPPER",


    /*
     * --------------------------------------------
     * Promotion pricing mechanic
     * --------------------------------------------
     */

    promotionMechanic,

    promotionQuantity,

    promotionBundlePrice,


    /*
     * --------------------------------------------
     * Promotion metadata
     * --------------------------------------------
     */

    promotionType,

    promotionCode,

    promotionMessage,

    promotionStartsAt,

    promotionEndsAt,

    promotions,


    /*
     * --------------------------------------------
     * Stock
     * --------------------------------------------
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
     * --------------------------------------------
     * Media
     * --------------------------------------------
     */

    imageUrl:
      getImage(
        product.images
      ),


    /*
     * --------------------------------------------
     * Categories
     * --------------------------------------------
     */

    categories:
      Array.isArray(
        product.categoryNames
      )
        ? product.categoryNames
        : [],


    /*
     * --------------------------------------------
     * Other metadata
     * --------------------------------------------
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
     * --------------------------------------------
     * Raw provider response
     * --------------------------------------------
     *
     * Always preserve this.
     *
     * It allows us to support additional
     * PnP promotion mechanics later without
     * losing the original provider data.
     * --------------------------------------------
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
    .filter(
      Boolean
    );
}


/*
 * ------------------------------------------------
 * Exports
 * ------------------------------------------------
 */

module.exports = {
  normalizePnpProduct,
  normalizePnpProducts,

  /*
   * Exporting this makes promotion parsing
   * easy to test independently.
   */

  parsePromotionMessage,
};
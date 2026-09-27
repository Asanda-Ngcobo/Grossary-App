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
   * Store-specific endpoint
   */

  const directPrice =
    toNumber(product?.price);

  if (directPrice !== null) {
    return directPrice;
  }


  /*
   * Generic endpoint
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
   * Store endpoint explicitly
   * provides promotionSaving.
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
   * Older generic endpoint
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
   * search_store_products currently
   * does not expose stock status.
   */

  return null;
}


/*
 * ------------------------------------------------
 * Parse Checkers multibuy promotion message
 * ------------------------------------------------
 *
 * Checkers does not always expose useful
 * promotionQuantity / promotionBundlePrice
 * values for multibuy Bonus Buys.
 *
 * The customer-facing promotion message,
 * however, may clearly contain:
 *
 * 2 for R34
 * 4 for R45
 * 2 For R34.00
 * 3 FOR R100
 * 2 for R 34
 *
 * We can safely derive the quantity and
 * bundle price from that message.
 * ------------------------------------------------
 */

function parseCheckersMultibuyMessage(
  message
) {
  if (!message) {
    return null;
  }


  const text =
    String(message)
      .trim()
      .replace(/\s+/g, " ");


  /*
   * Handles:
   *
   * 2 for R34
   * 2 For R34.00
   * 4 FOR R45
   * 3 for 100
   * 2 FOR R 34
   * 2 x for R34
   */

  const match =
    text.match(
      /(\d+)\s*(?:x\s*)?for\s*r?\s*(\d+(?:[.,]\d{1,2})?)/i
    );


  if (!match) {
    return null;
  }


  const quantity =
    Number(match[1]);


  const bundlePrice =
    Number(
      match[2]
        .replace(",", ".")
    );


  if (
    !Number.isFinite(quantity) ||
    quantity <= 1 ||
    !Number.isFinite(
      bundlePrice
    ) ||
    bundlePrice <= 0
  ) {
    return null;
  }


  return {
    mechanic:
      "MULTIBUY",

    quantity,

    bundlePrice,
  };
}


/*
 * ------------------------------------------------
 * Normalize Checkers promotion mechanic
 * ------------------------------------------------
 */

function normalizePromotionMechanic(
  mechanic,
  promotionMessage
) {
  const normalized =
    String(mechanic || "")
      .trim()
      .toLowerCase();


  /*
   * Checkers calls this:
   *
   * fixed_discount
   *
   * But its meaning is:
   *
   * "Overrides the price of the product"
   *
   * Therefore this is equivalent to
   * Grossary's FIXED_PRICE mechanic.
   */

  if (
    normalized ===
      "fixed_discount" ||
    normalized ===
      "fixed price" ||
    normalized ===
      "fixed_price"
  ) {
    return "FIXED_PRICE";
  }


  /*
   * Known/common multibuy names.
   *
   * If Parse starts returning one of these,
   * Grossary will recognise it directly.
   */

  if (
    normalized ===
      "multibuy" ||
    normalized ===
      "multi_buy" ||
    normalized ===
      "multi-buy" ||
    normalized ===
      "multi buy"
  ) {
    return "MULTIBUY";
  }


  /*
   * IMPORTANT FALLBACK
   *
   * Even if Checkers/Parse gives us an
   * unfamiliar internal mechanic, a message
   * such as:
   *
   * "2 for R34"
   *
   * or
   *
   * "4 for R45"
   *
   * unambiguously describes a multibuy.
   */

  const parsedMultibuy =
    parseCheckersMultibuyMessage(
      promotionMessage
    );


  if (parsedMultibuy) {
    return "MULTIBUY";
  }


  return "UNKNOWN";
}


/*
 * ------------------------------------------------
 * Promotion active check
 * ------------------------------------------------
 */

function isPromotionActive(
  promotion
) {
  if (!promotion) {
    return false;
  }

  if (
    promotion.active === false
  ) {
    return false;
  }


  const now =
    Date.now();


  const start =
    promotion.startsAt
      ? new Date(
          promotion.startsAt
        ).getTime()
      : toNumber(
          promotion.startDate
        );


  const end =
    promotion.endsAt
      ? new Date(
          promotion.endsAt
        ).getTime()
      : toNumber(
          promotion.endDate
        );


  if (
    Number.isFinite(start) &&
    now < start
  ) {
    return false;
  }


  if (
    Number.isFinite(end) &&
    now > end
  ) {
    return false;
  }


  return true;
}


/*
 * ------------------------------------------------
 * Normalize one Checkers Bonus Buy
 * ------------------------------------------------
 */

function normalizeCheckersBonusBuy(
  response
) {
  if (!response) {
    return null;
  }


  /*
   * Parse returns:
   *
   * {
   *   status: "success",
   *   data: {...}
   * }
   *
   * But supporting response.data ?? response
   * makes this helper easier to test.
   */

  const data =
    response?.data ??
    response;


  if (!data) {
    return null;
  }


  const promotion =
    data.promotion ||
    null;


  const bonusBuyId =
    data.bonusBuyId ||
    promotion?.bonusBuyId ||
    data.raw?.id ||
    null;


  const normalPrice =
    toNumber(
      data.normalPrice
    );


  const promotionPrice =
    toNumber(
      data.promotionPrice ??
      promotion?.promotionPrice ??
      promotion?.discountValue
    );


  /*
   * ------------------------------------------------
   * Promotion message
   * ------------------------------------------------
   *
   * We calculate this before the mechanic
   * because the message can tell us whether
   * an otherwise UNKNOWN mechanic is actually
   * a MULTIBUY.
   */

  const promotionMessage =
    promotion
      ?.promotionMessage ||
    promotion?.name ||
    promotion
      ?.longDescription ||
    data?.promotionMessage ||
    data?.name ||
    null;


  /*
   * ------------------------------------------------
   * Parse multibuy message
   * ------------------------------------------------
   */

  const parsedMultibuy =
    parseCheckersMultibuyMessage(
      promotionMessage
    );


  /*
   * ------------------------------------------------
   * Normalize mechanic
   * ------------------------------------------------
   */

  const promotionMechanic =
    normalizePromotionMechanic(
      promotion
        ?.promotionMechanic,
      promotionMessage
    );


  /*
   * ------------------------------------------------
   * Promotion quantity
   * ------------------------------------------------
   *
   * MULTIBUY:
   *
   * Message takes priority because it is the
   * customer-facing promotion.
   *
   * "2 for R34"
   *
   * becomes:
   *
   * promotionQuantity: 2
   *
   *
   * FIXED_PRICE:
   *
   * Quantity remains 1.
   */

  let promotionQuantity =
    1;


  if (
    promotionMechanic ===
    "MULTIBUY"
  ) {
    promotionQuantity =
      parsedMultibuy
        ?.quantity ??
      toNumber(
        promotion
          ?.promotionQuantity
      ) ??
      1;
  }


  /*
   * ------------------------------------------------
   * Promotion bundle price
   * ------------------------------------------------
   *
   * MULTIBUY:
   *
   * "2 for R34"
   *
   * becomes:
   *
   * promotionBundlePrice: 34
   *
   *
   * FIXED_PRICE:
   *
   * bundle price remains the promotional
   * member price.
   */

  let promotionBundlePrice =
    null;


  if (
    promotionMechanic ===
    "MULTIBUY"
  ) {
    promotionBundlePrice =
      parsedMultibuy
        ?.bundlePrice ??
      toNumber(
        promotion
          ?.promotionBundlePrice
      ) ??
      promotionPrice;
  } else {
    promotionBundlePrice =
      toNumber(
        promotion
          ?.promotionBundlePrice
      ) ??
      promotionPrice;
  }


  /*
   * ------------------------------------------------
   * Saving
   * ------------------------------------------------
   *
   * FIXED PRICE:
   *
   * normal price - promotional price
   *
   *
   * MULTIBUY:
   *
   * normal unit price × qualifying quantity
   * minus bundle price.
   *
   * Example:
   *
   * Normal = R22.99
   * Promo  = 2 for R34
   *
   * R22.99 × 2 = R45.98
   *
   * R45.98 - R34 = R11.98
   *
   * Therefore:
   *
   * loyaltySavings = R11.98 per qualifying
   * bundle.
   */

  let saving =
    null;


  if (
    promotionMechanic ===
      "MULTIBUY" &&
    normalPrice !== null &&
    promotionQuantity > 1 &&
    promotionBundlePrice !==
      null
  ) {
    saving =
      (
        normalPrice *
        promotionQuantity
      ) -
      promotionBundlePrice;
  } else {
    /*
     * Prefer explicit Parse saving for
     * non-multibuy promotions.
     */

    saving =
      toNumber(
        data.saving
      );


    if (
      saving === null &&
      normalPrice !== null &&
      promotionPrice !== null
    ) {
      saving =
        normalPrice -
        promotionPrice;
    }
  }


  saving =
    Math.max(
      0,
      Number(
        saving || 0
      )
    );


  /*
   * ------------------------------------------------
   * Loyalty requirement
   * ------------------------------------------------
   */

  const requiresLoyaltyCard =
    promotion
      ?.requiresLoyaltyCard ===
      true ||
    promotion
      ?.promotionType ===
      "fox_members" ||
    promotion
      ?.memberTypeName ===
      "Xtra Savings Members";


  /*
   * ------------------------------------------------
   * Active promotion
   * ------------------------------------------------
   */

  const active =
    data.availableAtStore !==
      false &&
    isPromotionActive(
      promotion
    );


  /*
   * ------------------------------------------------
   * Loyalty price
   * ------------------------------------------------
   *
   * FIXED_PRICE:
   *
   * loyaltyPrice is meaningful because the
   * promotion defines a unit/member price.
   *
   *
   * MULTIBUY:
   *
   * There is no single loyalty unit price.
   * The meaningful values are:
   *
   * promotionQuantity
   * promotionBundlePrice
   *
   * So loyaltyPrice stays null.
   */

  const loyaltyPrice =
    requiresLoyaltyCard &&
    promotionMechanic !==
      "MULTIBUY"
      ? promotionPrice
      : null;


  return {
    /*
     * Provider
     */

    source:
      "parse_checkers_bonus_buy",

    retailer:
      "Checkers",


    /*
     * Store
     */

    providerStoreId:
      data.storeId ||
      null,

    storeName:
      data.storeName ||
      null,

    storeBrand:
      data.storeBrand ||
      "Checkers",

    availableAtStore:
      data.availableAtStore ===
      true,


    /*
     * Promotion identity
     */

    bonusBuyId,

    promotionCode:
      bonusBuyId,

    providerPromotionCode:
      promotion?.code ||
      null,

    providerPromotionId:
      promotion?.promotionId ||
      null,


    /*
     * Pricing
     */

    normalPrice,

    promotionPrice,

    saving:
      Number(
        saving.toFixed(2)
      ),


    /*
     * Grossary loyalty pricing
     *
     * Checkers Xtra Savings is represented
     * using the same normalized fields as
     * PnP Smart Shopper.
     */

    loyaltyPrice,

    loyaltySavings:
      requiresLoyaltyCard
        ? Number(
            saving.toFixed(2)
          )
        : 0,

    requiresLoyaltyCard,


    /*
     * Promotion
     */

    isPromotion:
      active,

    promotionType:
      requiresLoyaltyCard
        ? "XTRA_SAVINGS"
        : "CHECKERS_PROMOTION",

    promotionMessage,

    promotionMechanic,

    promotionQuantity,

    promotionBundlePrice,


    /*
     * Dates
     */

    promotionStartsAt:
      promotion?.startsAt ||
      null,

    promotionEndsAt:
      promotion?.endsAt ||
      null,


    /*
     * Checkers metadata
     */

    memberTypeName:
      promotion
        ?.memberTypeName ||
      null,

    memberTypeDescription:
      promotion
        ?.memberTypeDescription ||
      null,

    redemptionLimit:
      toNumber(
        promotion
          ?.redemptionLimit
      ),

    channelIndicator:
      promotion
        ?.channelIndicator ||
      null,

    channelSpecificPromotions:
      promotion
        ?.channelSpecificPromotions ||
      null,


    /*
     * Products covered by
     * this Bonus Buy
     */

    qualifyingProductCodes:
      Array.isArray(
        promotion
          ?.qualifyingProductCodes
      )
        ? promotion
            .qualifyingProductCodes
        : [],

    qualifyingProductIds:
      Array.isArray(
        promotion
          ?.qualifyingProductIds
      )
        ? promotion
            .qualifyingProductIds
        : [],


    /*
     * Keep provider data
     */

    raw:
      data.raw ||
      data,
  };
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
    getPromotionalSavings(
      product
    );


  const isPromotion =
    product?.isOnPromotion ===
      true ||
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
        ? product
            .barcodes[0] ||
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
     * Loyalty defaults
     *
     * These are populated later
     * if a Bonus Buy is resolved.
     */

    loyaltyPrice:
      null,

    loyaltySavings:
      0,

    requiresLoyaltyCard:
      false,

    promotionType:
      null,

    promotionCode:
      null,

    promotionMessage:
      null,

    promotionMechanic:
      null,

    promotionQuantity:
      null,

    promotionBundlePrice:
      null,

    promotionStartsAt:
      null,

    promotionEndsAt:
      null,


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
     * Bonus Buy references
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

  normalizeCheckersBonusBuy,

  normalizePromotionMechanic,

  parseCheckersMultibuyMessage,

  isPromotionActive,
};
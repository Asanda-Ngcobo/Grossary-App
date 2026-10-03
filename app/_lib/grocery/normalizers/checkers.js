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
  const directPrice =
    toNumber(product?.price);

  if (directPrice !== null) {
    return directPrice;
  }

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

  return null;
}


/*
 * ------------------------------------------------
 * Parse Checkers multibuy promotion
 * ------------------------------------------------
 *
 * Examples:
 *
 * Buy 2 For R34
 * 2 for R34
 * Buy 4 For R55
 * 3 FOR R100
 * 2 for R 34
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

  const match =
    text.match(
      /(?:buy\s*)?(\d+)\s*(?:x\s*)?for\s*r?\s*(\d+(?:[.,]\d{1,2})?)/i
    );

  if (!match) {
    return null;
  }

  const quantity =
    Number(match[1]);

  const bundlePrice =
    Number(
      match[2].replace(
        ",",
        "."
      )
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
 * Parse quantity percentage promotion
 * ------------------------------------------------
 *
 * Examples:
 *
 * Buy 2 & Save 20%
 * Buy 2 and Save 25%
 * Buy 3 & Save 10%
 *
 * These require a qualifying quantity.
 * ------------------------------------------------
 */

function parseCheckersQuantityPercentageMessage(
  message
) {
  if (!message) {
    return null;
  }

  const text =
    String(message)
      .trim()
      .replace(/\s+/g, " ");

  const match =
    text.match(
      /^buy\s*(\d+)\s*(?:&|and)?\s*save\s*(\d+(?:[.,]\d+)?)\s*%$/i
    );

  if (!match) {
    return null;
  }

  const quantity =
    Number(match[1]);

  const discountPercentage =
    Number(
      String(
        match[2]
      ).replace(
        ",",
        "."
      )
    );

  if (
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    !Number.isFinite(
      discountPercentage
    ) ||
    discountPercentage <= 0 ||
    discountPercentage >= 100
  ) {
    return null;
  }

  return {
    mechanic:
      "QUANTITY_PERCENTAGE",

    quantity,

    discountPercentage,
  };
}


/*
 * ------------------------------------------------
 * Parse percentage discount
 * ------------------------------------------------
 *
 * Examples:
 *
 * Save 30%
 * Save 25%
 * Save 10.5%
 *
 * IMPORTANT:
 *
 * "Save 30%" means 30 PERCENT OFF.
 *
 * It does NOT mean:
 *
 * loyaltyPrice = R30
 *
 * and it does NOT mean:
 *
 * promotionBundlePrice = R30
 *
 * ------------------------------------------------
 */

function parseCheckersPercentageDiscountMessage(
  message
) {
  if (!message) {
    return null;
  }

  const text =
    String(message)
      .trim()
      .replace(/\s+/g, " ");

  const match =
    text.match(
      /^save\s*(\d+(?:[.,]\d+)?)\s*%$/i
    );

  if (!match) {
    return null;
  }

  const discountPercentage =
    Number(
      String(
        match[1]
      ).replace(
        ",",
        "."
      )
    );

  if (
    !Number.isFinite(
      discountPercentage
    ) ||
    discountPercentage <= 0 ||
    discountPercentage >= 100
  ) {
    return null;
  }

  return {
    mechanic:
      "PERCENTAGE_DISCOUNT",

    quantity:
      1,

    discountPercentage,
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
   * ------------------------------------------------
   * First inspect the customer-facing message.
   *
   * This is important because Parse may expose
   * a generic/raw mechanic while the promotion
   * message tells us exactly what the offer is.
   * ------------------------------------------------
   */

  const parsedQuantityPercentage =
    parseCheckersQuantityPercentageMessage(
      promotionMessage
    );

  if (parsedQuantityPercentage) {
    return "QUANTITY_PERCENTAGE";
  }


  const parsedPercentageDiscount =
    parseCheckersPercentageDiscountMessage(
      promotionMessage
    );

  if (parsedPercentageDiscount) {
    return "PERCENTAGE_DISCOUNT";
  }


  const parsedMultibuy =
    parseCheckersMultibuyMessage(
      promotionMessage
    );

  if (parsedMultibuy) {
    return "MULTIBUY";
  }


  /*
   * Checkers fixed_discount normally means
   * the promotion value is the resulting
   * member price.
   *
   * Example:
   *
   * normal R45.99
   * Now R36.99
   *
   * discountValue = 36.99
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
   * Known multibuy mechanic names.
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
   * Known quantity percentage mechanic names.
   */

  if (
    normalized ===
      "quantity_percentage" ||
    normalized ===
      "quantity percentage" ||
    normalized ===
      "quantity-percent" ||
    normalized ===
      "quantity_percent"
  ) {
    return "QUANTITY_PERCENTAGE";
  }


  /*
   * IMPORTANT:
   *
   * A simple percentage discount is NOT the
   * same as QUANTITY_PERCENTAGE.
   *
   * Save 30%
   *
   * =>
   *
   * PERCENTAGE_DISCOUNT
   *
   * Buy 2 & Save 30%
   *
   * =>
   *
   * QUANTITY_PERCENTAGE
   */

  if (
    normalized ===
      "percentage_discount" ||
    normalized ===
      "percentage discount" ||
    normalized ===
      "percent_discount" ||
    normalized ===
      "percent discount"
  ) {
    return "PERCENTAGE_DISCOUNT";
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


  /*
   * ------------------------------------------------
   * Normal price
   * ------------------------------------------------
   */

  const normalPrice =
    toNumber(
      data.normalPrice
    );


  /*
   * ------------------------------------------------
   * Raw promotion value
   * ------------------------------------------------
   *
   * IMPORTANT:
   *
   * This value does NOT always mean a price.
   *
   * Examples:
   *
   * Now R36.99
   * -> promotionPrice may mean R36.99
   *
   * Save 30%
   * -> provider may return 30
   * -> that means 30%, NOT R30
   *
   * We therefore parse the mechanic BEFORE
   * deciding what this number means.
   * ------------------------------------------------
   */

  const rawPromotionValue =
    toNumber(
      data.promotionPrice ??
      promotion?.promotionPrice ??
      promotion?.discountValue
    );


  /*
   * ------------------------------------------------
   * Promotion message
   * ------------------------------------------------
   */

  const promotionMessage =
    promotion?.promotionMessage ||
    promotion?.name ||
    promotion?.longDescription ||
    data?.promotionMessage ||
    data?.name ||
    null;


  /*
   * ------------------------------------------------
   * Parse customer-facing promotion
   * ------------------------------------------------
   */

  const parsedMultibuy =
    parseCheckersMultibuyMessage(
      promotionMessage
    );

  const parsedQuantityPercentage =
    parseCheckersQuantityPercentageMessage(
      promotionMessage
    );

  const parsedPercentageDiscount =
    parseCheckersPercentageDiscountMessage(
      promotionMessage
    );


  /*
   * ------------------------------------------------
   * Normalize mechanic
   * ------------------------------------------------
   */

  const promotionMechanic =
    normalizePromotionMechanic(
      promotion?.promotionMechanic,
      promotionMessage
    );


  /*
   * ------------------------------------------------
   * Promotion quantity
   * ------------------------------------------------
   */

  let promotionQuantity =
    1;

  if (
    promotionMechanic ===
      "MULTIBUY"
  ) {
    promotionQuantity =
      parsedMultibuy?.quantity ??
      toNumber(
        promotion
          ?.promotionQuantity
      ) ??
      1;
  }

  else if (
    promotionMechanic ===
      "QUANTITY_PERCENTAGE"
  ) {
    promotionQuantity =
      parsedQuantityPercentage
        ?.quantity ??
      toNumber(
        promotion
          ?.promotionQuantity
      ) ??
      1;
  }

  else if (
    promotionMechanic ===
      "PERCENTAGE_DISCOUNT"
  ) {
    /*
     * Save 30%
     *
     * applies per unit.
     */

    promotionQuantity =
      1;
  }


  /*
   * ------------------------------------------------
   * Percentage discount
   * ------------------------------------------------
   */

  let promotionDiscountPercentage =
    null;

  if (
    promotionMechanic ===
      "QUANTITY_PERCENTAGE"
  ) {
    promotionDiscountPercentage =
      parsedQuantityPercentage
        ?.discountPercentage ??
      toNumber(
        promotion
          ?.promotionDiscountPercentage
      ) ??
      toNumber(
        promotion
          ?.discountPercentage
      ) ??
      null;
  }

  else if (
    promotionMechanic ===
      "PERCENTAGE_DISCOUNT"
  ) {
    /*
     * Prefer the message:
     *
     * Save 30%
     *
     * over raw provider numeric values because
     * those values may have been placed in a
     * field normally used for prices.
     */

    promotionDiscountPercentage =
      parsedPercentageDiscount
        ?.discountPercentage ??
      toNumber(
        promotion
          ?.promotionDiscountPercentage
      ) ??
      toNumber(
        promotion
          ?.discountPercentage
      ) ??
      null;
  }


  /*
   * ------------------------------------------------
   * Promotion price
   * ------------------------------------------------
   *
   * FIXED_PRICE:
   *
   * promotionPrice is meaningful.
   *
   * MULTIBUY:
   *
   * promotion value represents the bundle.
   *
   * QUANTITY_PERCENTAGE:
   *
   * no fixed unit price.
   *
   * PERCENTAGE_DISCOUNT:
   *
   * calculate unit loyalty price from the
   * normal price and percentage.
   * ------------------------------------------------
   */

  let promotionPrice =
    rawPromotionValue;

  if (
    promotionMechanic ===
      "PERCENTAGE_DISCOUNT"
  ) {
    if (
      normalPrice !== null &&
      promotionDiscountPercentage !==
        null
    ) {
      promotionPrice =
        normalPrice *
        (
          1 -
          promotionDiscountPercentage /
            100
        );
    }

    else {
      /*
       * Do NOT use the raw 30 from:
       *
       * Save 30%
       *
       * as R30.
       */

      promotionPrice =
        null;
    }
  }


  /*
   * ------------------------------------------------
   * Promotion bundle price
   * ------------------------------------------------
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
      rawPromotionValue;
  }

  else if (
    promotionMechanic ===
      "QUANTITY_PERCENTAGE"
  ) {
    /*
     * No fixed bundle price.
     *
     * Basket pricing calculates the qualifying
     * quantity discount.
     */

    promotionBundlePrice =
      null;
  }

  else if (
    promotionMechanic ===
      "PERCENTAGE_DISCOUNT"
  ) {
    /*
     * Save 30% is not a bundle price.
     */

    promotionBundlePrice =
      null;
  }

  else {
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
   */

  let saving =
    null;


  /*
   * MULTIBUY
   *
   * R22.99 each
   * Buy 2 for R34
   *
   * saving:
   *
   * (22.99 × 2) - 34
   */

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
  }


  /*
   * QUANTITY_PERCENTAGE
   *
   * R50 each
   * Buy 2 & Save 20%
   *
   * qualifying total:
   *
   * 50 × 2 = 100
   *
   * saving:
   *
   * 100 × 20% = R20
   */

  else if (
    promotionMechanic ===
      "QUANTITY_PERCENTAGE" &&
    normalPrice !== null &&
    promotionQuantity > 0 &&
    promotionDiscountPercentage !==
      null
  ) {
    const qualifyingNormalTotal =
      normalPrice *
      promotionQuantity;

    saving =
      qualifyingNormalTotal *
      (
        promotionDiscountPercentage /
        100
      );
  }


  /*
   * PERCENTAGE_DISCOUNT
   *
   * R100
   * Save 30%
   *
   * saving:
   *
   * 100 × 30% = R30
   *
   * loyalty price:
   *
   * 100 - 30 = R70
   */

  else if (
    promotionMechanic ===
      "PERCENTAGE_DISCOUNT" &&
    normalPrice !== null &&
    promotionDiscountPercentage !==
      null
  ) {
    saving =
      normalPrice *
      (
        promotionDiscountPercentage /
        100
      );
  }


  /*
   * FIXED_PRICE / other promotion
   */

  else {
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
   * meaningful unit price.
   *
   * MULTIBUY:
   *
   * depends on quantity.
   *
   * QUANTITY_PERCENTAGE:
   *
   * depends on qualifying quantity.
   *
   * PERCENTAGE_DISCOUNT:
   *
   * meaningful discounted unit price can be
   * calculated directly.
   * ------------------------------------------------
   */

  let loyaltyPrice =
    null;

  if (
    requiresLoyaltyCard &&
    promotionMechanic ===
      "FIXED_PRICE"
  ) {
    loyaltyPrice =
      promotionPrice;
  }

  else if (
    requiresLoyaltyCard &&
    promotionMechanic ===
      "PERCENTAGE_DISCOUNT"
  ) {
    loyaltyPrice =
      promotionPrice;
  }

  else if (
    requiresLoyaltyCard &&
    promotionMechanic !==
      "MULTIBUY" &&
    promotionMechanic !==
      "QUANTITY_PERCENTAGE"
  ) {
    loyaltyPrice =
      promotionPrice;
  }


  /*
   * Round calculated monetary values.
   */

  if (
    promotionPrice !== null
  ) {
    promotionPrice =
      Number(
        promotionPrice.toFixed(2)
      );
  }

  if (
    loyaltyPrice !== null
  ) {
    loyaltyPrice =
      Number(
        loyaltyPrice.toFixed(2)
      );
  }

  if (
    promotionBundlePrice !== null
  ) {
    promotionBundlePrice =
      Number(
        promotionBundlePrice
          .toFixed(2)
      );
  }


  /*
   * ------------------------------------------------
   * Normalized Bonus Buy
   * ------------------------------------------------
   */

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
     * Loyalty pricing
     */

    loyaltyPrice,

    /*
     * Saving for ONE qualifying promotion group.
     *
     * For:
     *
     * Save 30%
     *
     * promotionQuantity = 1, therefore this is
     * the saving for one item.
     *
     * Basket calculation can multiply/recalculate
     * according to requested item quantity.
     */

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

    promotionDiscountPercentage,


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
     * Products covered by this Bonus Buy
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
     * Loyalty defaults
     *
     * Populated when Bonus Buy is resolved.
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

    promotionDiscountPercentage:
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


/*
 * ------------------------------------------------
 * Exports
 * ------------------------------------------------
 */

module.exports = {
  normalizeCheckersProduct,

  normalizeCheckersProducts,

  normalizeCheckersBonusBuy,

  normalizePromotionMechanic,

  parseCheckersMultibuyMessage,

  parseCheckersQuantityPercentageMessage,

  parseCheckersPercentageDiscountMessage,

  isPromotionActive,
};
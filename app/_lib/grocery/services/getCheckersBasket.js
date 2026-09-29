const {
  searchCheckersStoreProducts,
  getCheckersBonusBuy,
} = require("../providers/checkers");

const {
  normalizeCheckersProducts,
  normalizeCheckersBonusBuy,
} = require("../normalizers/checkers");

const {
  matchProduct,
} = require("../matchProduct");

const {
  getFreshCachedProducts,
  saveProductsToCache,
} = require("./productPriceCache");

/*
 * ------------------------------------------------
 * Build Checkers search query
 * ------------------------------------------------
 */

function buildCheckersSearchQuery(item) {
  return [
    item.item_brand,
    item.item_name,
    item.item_volume_mass,
    item.item_unit,
  ]
    .filter(
      value =>
        value !== null &&
        value !== undefined &&
        value !== ""
    )
    .join(" ");
}

/*
 * ------------------------------------------------
 * Extract products from Parse response
 * ------------------------------------------------
 */

function extractCheckersProducts(response) {
  const data =
    response?.data ??
    response;

  return Array.isArray(data?.products)
    ? data.products
    : [];
}

/*
 * ------------------------------------------------
 * Quantity
 * ------------------------------------------------
 */

function getQuantity(item) {
  const quantity =
    Number(item?.item_quantity);

  if (
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    return 1;
  }

  return quantity;
}

/*
 * ------------------------------------------------
 * Promotion active
 * ------------------------------------------------
 */

function isPromotionActive(product) {
  if (!product) {
    return false;
  }

  const now = Date.now();

  if (product.promotionStartsAt) {
    const start =
      new Date(
        product.promotionStartsAt
      ).getTime();

    if (
      Number.isFinite(start) &&
      now < start
    ) {
      return false;
    }
  }

  if (product.promotionEndsAt) {
    const end =
      new Date(
        product.promotionEndsAt
      ).getTime();

    if (
      Number.isFinite(end) &&
      now > end
    ) {
      return false;
    }
  }

  return true;
}

/*
 * ------------------------------------------------
 * Can use loyalty pricing
 * ------------------------------------------------
 *
 * TEMPORARY:
 *
 * useLoyaltyPricing defaults to true while
 * Grossary+ loyalty pricing is being tested.
 *
 * Later this should come from the user's
 * actual Xtra Savings eligibility.
 * ------------------------------------------------
 */

function canUseLoyaltyPricing(
  product,
  {
    useLoyaltyPricing = true,
  } = {}
) {
  if (!useLoyaltyPricing) {
    return false;
  }

  if (
    product?.requiresLoyaltyCard !== true
  ) {
    return false;
  }

  if (!isPromotionActive(product)) {
    return false;
  }

  return true;
}

/*
 * ------------------------------------------------
 * Calculate Checkers product pricing
 * ------------------------------------------------
 *
 * Supports:
 *
 * 1. Normal pricing
 * 2. Xtra Savings FIXED_PRICE
 * 3. Xtra Savings MULTIBUY
 * ------------------------------------------------
 */

function calculateCheckersProductPricing(
  product,
  quantity,
  {
    useLoyaltyPricing = true,
  } = {}
) {
  /*
   * ------------------------------------------------
   * Normal price
   * ------------------------------------------------
   */

  const normalUnitPrice =
    Number(product?.price);

  if (!Number.isFinite(normalUnitPrice)) {
    return null;
  }

  /*
   * ------------------------------------------------
   * Quantity
   * ------------------------------------------------
   */

  const safeQuantity =
    Number.isFinite(Number(quantity)) &&
    Number(quantity) > 0
      ? Number(quantity)
      : 1;

  const normalTotal =
    normalUnitPrice * safeQuantity;

  /*
   * Existing Checkers normalizer treats
   * promotionalSavings as a per-unit value.
   */

  const promotionalSavings =
    (
      Number(
        product?.promotionalSavings
      ) || 0
    ) * safeQuantity;

  /*
   * ------------------------------------------------
   * Can this customer use Xtra Savings?
   * ------------------------------------------------
   */

  const loyaltyAllowed =
    canUseLoyaltyPricing(
      product,
      {
        useLoyaltyPricing,
      }
    );

  /*
   * ------------------------------------------------
   * Promotion metadata
   * ------------------------------------------------
   */

  const mechanic =
    product?.promotionMechanic;

  const promotionQuantity =
    Math.max(
      1,
      Number(
        product?.promotionQuantity
      ) || 1
    );

  const promotionBundlePrice =
    Number(
      product?.promotionBundlePrice
    );

  const promotionDiscountPercentage =
    Number(
      product?.promotionDiscountPercentage
    );

  /*
   * =================================================
   * MULTIBUY
   * =================================================
   *
   * Example:
   *
   * Normal price:
   * R14.99 each
   *
   * Promotion:
   * 4 for R55
   *
   * quantity = 4
   *
   * normalTotal:
   * R59.96
   *
   * lineTotal:
   * R55
   *
   * loyaltySavings:
   * R4.96
   *
   * IMPORTANT:
   *
   * MULTIBUY does NOT have a true discounted
   * single-unit price.
   *
   * promotionBundlePrice is the amount paid
   * for the qualifying group.
   * =================================================
   */

  if (
    loyaltyAllowed &&
    mechanic === "MULTIBUY" &&
    promotionQuantity > 1 &&
    Number.isFinite(
      promotionBundlePrice
    ) &&
    promotionBundlePrice > 0
  ) {
    const qualifyingBundles =
      Math.floor(
        safeQuantity /
        promotionQuantity
      );

    const remainingQuantity =
      safeQuantity %
      promotionQuantity;

    /*
     * Customer must have at least one complete
     * qualifying bundle.
     */

    if (qualifyingBundles > 0) {
      const bundleTotal =
        qualifyingBundles *
        promotionBundlePrice;

      const remainingTotal =
        remainingQuantity *
        normalUnitPrice;

      const lineTotal =
        bundleTotal +
        remainingTotal;

      const loyaltySavings =
        Math.max(
          0,
          normalTotal -
          lineTotal
        );

      return {
        normalUnitPrice,

        normalTotal:
          Number(
            normalTotal.toFixed(2)
          ),

        /*
         * Keep unitPrice as the normal shelf price.
         *
         * There is no true single-unit loyalty
         * price for something such as "4 for R55".
         */

        unitPrice:
          normalUnitPrice,

        /*
         * lineTotal is what the customer
         * actually pays.
         */

        lineTotal:
          Number(
            lineTotal.toFixed(2)
          ),

        promotionalSavings:
          Number(
            promotionalSavings.toFixed(2)
          ),

        loyaltySavings:
          Number(
            loyaltySavings.toFixed(2)
          ),

        loyaltyApplied:
          loyaltySavings > 0,

        promotionMechanic:
          mechanic,

        promotionQuantity,

        promotionBundlePrice:
          Number(
            promotionBundlePrice.toFixed(2)
          ),

        promotionDiscountPercentage:
          null,

        qualifyingBundles,

        remainingQuantity,
      };
    }
  }

  /*
   * =================================================
   * QUANTITY_PERCENTAGE
   * =================================================
   *
   * Example:
   *
   * Buy 2 & Save 25%
   *
   * Normal unit price:
   * R52.99
   *
   * Quantity:
   * 2
   *
   * Normal total:
   * R105.98
   *
   * 25% saving:
   * approximately R26.50
   *
   * Customer pays:
   * approximately R79.49
   *
   * IMPORTANT:
   *
   * The discount only applies to complete
   * qualifying groups.
   *
   * Example:
   *
   * Buy 2 & Save 25%
   * quantity = 5
   *
   * 4 products qualify.
   * 1 product remains at normal price.
   * =================================================
   */

  if (
    loyaltyAllowed &&
    mechanic ===
      "QUANTITY_PERCENTAGE" &&
    promotionQuantity > 1 &&
    Number.isFinite(
      promotionDiscountPercentage
    ) &&
    promotionDiscountPercentage > 0
  ) {
    const qualifyingBundles =
      Math.floor(
        safeQuantity /
        promotionQuantity
      );

    const qualifyingQuantity =
      qualifyingBundles *
      promotionQuantity;

    const remainingQuantity =
      safeQuantity -
      qualifyingQuantity;

    /*
     * Customer must have at least one complete
     * qualifying group.
     */

    if (qualifyingBundles > 0) {
      const qualifyingNormalTotal =
        qualifyingQuantity *
        normalUnitPrice;

      const discountRate =
        promotionDiscountPercentage /
        100;

      const loyaltySavings =
        qualifyingNormalTotal *
        discountRate;

      const discountedTotal =
        qualifyingNormalTotal -
        loyaltySavings;

      const remainingTotal =
        remainingQuantity *
        normalUnitPrice;

      const lineTotal =
        discountedTotal +
        remainingTotal;

      return {
        normalUnitPrice,

        normalTotal:
          Number(
            normalTotal.toFixed(2)
          ),

        /*
         * Keep normal shelf price as unitPrice.
         *
         * The promotion depends on buying the
         * required quantity.
         */

        unitPrice:
          normalUnitPrice,

        lineTotal:
          Number(
            lineTotal.toFixed(2)
          ),

        promotionalSavings:
          Number(
            promotionalSavings.toFixed(2)
          ),

        loyaltySavings:
          Number(
            loyaltySavings.toFixed(2)
          ),

        loyaltyApplied:
          loyaltySavings > 0,

        promotionMechanic:
          mechanic,

        promotionQuantity,

        /*
         * QUANTITY_PERCENTAGE does not depend
         * on a fixed bundle price for the
         * calculation.
         */

        promotionBundlePrice:
          product?.promotionBundlePrice ??
          null,

        promotionDiscountPercentage,

        qualifyingBundles,

        remainingQuantity,
      };
    }
  }

  /*
   * =================================================
   * FIXED_PRICE
   * =================================================
   *
   * Example:
   *
   * Normal price:
   * R45.99
   *
   * Xtra Savings:
   * R36.99
   *
   * Every qualifying unit costs R36.99.
   *
   * Therefore FIXED_PRICE has a real
   * discounted unit price.
   * =================================================
   */

  if (
    loyaltyAllowed &&
    mechanic === "FIXED_PRICE"
  ) {
    const loyaltyUnitPrice =
      Number(
        product?.loyaltyPrice ??
        product?.promotionBundlePrice
      );

    if (
      Number.isFinite(
        loyaltyUnitPrice
      ) &&
      loyaltyUnitPrice > 0
    ) {
      const lineTotal =
        loyaltyUnitPrice *
        safeQuantity;

      const loyaltySavings =
        Math.max(
          0,
          normalTotal -
          lineTotal
        );

      return {
        normalUnitPrice,

        normalTotal:
          Number(
            normalTotal.toFixed(2)
          ),

        /*
         * FIXED_PRICE has a real loyalty
         * unit price, so expose it here.
         */

        unitPrice:
          loyaltyUnitPrice,

        lineTotal:
          Number(
            lineTotal.toFixed(2)
          ),

        promotionalSavings:
          Number(
            promotionalSavings.toFixed(2)
          ),

        loyaltySavings:
          Number(
            loyaltySavings.toFixed(2)
          ),

        loyaltyApplied:
          loyaltySavings > 0,

        promotionMechanic:
          mechanic,

        promotionQuantity:
          Number(
            product?.promotionQuantity
          ) || 1,

        promotionBundlePrice:
          Number.isFinite(
            promotionBundlePrice
          )
            ? promotionBundlePrice
            : loyaltyUnitPrice,

        promotionDiscountPercentage:
          product?.promotionDiscountPercentage ??
          null,

        qualifyingBundles:
          safeQuantity,

        remainingQuantity:
          0,
      };
    }
  }

  /*
   * =================================================
   * NORMAL PRICE FALLBACK
   * =================================================
   *
   * Used when:
   *
   * - there is no Xtra Savings promotion
   * - loyalty pricing is disabled
   * - promotion is inactive
   * - customer hasn't bought enough units
   *   to qualify for MULTIBUY
   * - customer hasn't bought enough units
   *   to qualify for QUANTITY_PERCENTAGE
   *
   * IMPORTANT:
   *
   * Preserve promotion metadata even when
   * the current requested quantity does not
   * qualify.
   *
   * Example:
   *
   * Promotion:
   * Buy 2 & Save 25%
   *
   * Requested:
   * quantity = 1
   *
   * Customer pays normal price, but Grossary
   * still knows that the product has the
   * Buy 2 & Save 25% promotion.
   * =================================================
   */

  return {
    normalUnitPrice,

    normalTotal:
      Number(
        normalTotal.toFixed(2)
      ),

    unitPrice:
      normalUnitPrice,

    lineTotal:
      Number(
        normalTotal.toFixed(2)
      ),

    promotionalSavings:
      Number(
        promotionalSavings.toFixed(2)
      ),

    loyaltySavings:
      0,

    loyaltyApplied:
      false,

    promotionMechanic:
      mechanic || null,

    promotionQuantity:
      product?.promotionQuantity ??
      null,

    promotionBundlePrice:
      product?.promotionBundlePrice ??
      null,

    promotionDiscountPercentage:
      product?.promotionDiscountPercentage ??
      null,

    qualifyingBundles:
      0,

    remainingQuantity:
      safeQuantity,
  };
}

/*
 * ------------------------------------------------
 * Apply Bonus Buy promotion to one product
 * ------------------------------------------------
 */

function applyBonusBuyToProduct(
  product,
  bonusBuy
) {
  if (
    !product ||
    !bonusBuy
  ) {
    return product;
  }

  /*
   * Critical store safety check.
   */

  if (
    bonusBuy.providerStoreId &&
    product.providerStoreId &&
    String(
      bonusBuy.providerStoreId
    ) !==
      String(
        product.providerStoreId
      )
  ) {
    return product;
  }

  /*
   * The Bonus Buy endpoint returns the
   * qualifying provider product IDs and
   * article/product codes.
   *
   * Only enrich products that actually
   * belong to this promotion.
   */

  const productId =
    product.providerProductId
      ? String(
          product.providerProductId
        )
      : null;

  const articleNumber =
    product.articleNumber
      ? String(
          product.articleNumber
        )
      : null;

  const articleCode =
    articleNumber
      ? `${articleNumber}EA`
      : null;

  const qualifyingIds =
    Array.isArray(
      bonusBuy.qualifyingProductIds
    )
      ? bonusBuy.qualifyingProductIds.map(
          String
        )
      : [];

  const qualifyingCodes =
    Array.isArray(
      bonusBuy.qualifyingProductCodes
    )
      ? bonusBuy.qualifyingProductCodes.map(
          String
        )
      : [];

  const matchesById =
    productId &&
    qualifyingIds.includes(
      productId
    );

  const matchesByCode =
    (
      articleCode &&
      qualifyingCodes.includes(
        articleCode
      )
    ) ||
    (
      articleNumber &&
      qualifyingCodes.some(
        code =>
          String(code).replace(
            /EA$/i,
            ""
          ) ===
          articleNumber
      )
    );

  /*
   * If Parse gives us qualifying lists,
   * require the product to be in them.
   */

  if (
    (
      qualifyingIds.length > 0 ||
      qualifyingCodes.length > 0
    ) &&
    !matchesById &&
    !matchesByCode
  ) {
    return product;
  }

  return {
    ...product,

    /*
     * Keep normal customer price.
     */

    price:
      product.price,

    /*
     * Loyalty / Xtra Savings pricing.
     */

    loyaltyPrice:
      bonusBuy.loyaltyPrice,

    loyaltySavings:
      bonusBuy.loyaltySavings,

    requiresLoyaltyCard:
      bonusBuy.requiresLoyaltyCard,

    /*
     * Promotion metadata.
     */

    isPromotion:
      bonusBuy.isPromotion,

    promotionType:
      bonusBuy.promotionType,

    promotionCode:
      bonusBuy.promotionCode,

    promotionMessage:
      bonusBuy.promotionMessage,

    promotionMechanic:
      bonusBuy.promotionMechanic,

   promotionQuantity:
  bonusBuy.promotionQuantity,

promotionBundlePrice:
  bonusBuy.promotionBundlePrice,

promotionDiscountPercentage:
  bonusBuy.promotionDiscountPercentage,

promotionStartsAt:
  bonusBuy.promotionStartsAt,

    promotionEndsAt:
      bonusBuy.promotionEndsAt,

    /*
     * Preserve useful promotion data.
     */

    promotions: [
      ...(
        Array.isArray(
          product.promotions
        )
          ? product.promotions
          : []
      ),

      {
        promotionCode:
          bonusBuy.promotionCode,

        promotionType:
          bonusBuy.promotionType,

        promotionMessage:
          bonusBuy.promotionMessage,

        promotionMechanic:
          bonusBuy.promotionMechanic,

        loyaltyPrice:
          bonusBuy.loyaltyPrice,

        loyaltySavings:
          bonusBuy.loyaltySavings,

        requiresLoyaltyCard:
          bonusBuy.requiresLoyaltyCard,

       promotionQuantity:
  bonusBuy.promotionQuantity,

promotionBundlePrice:
  bonusBuy.promotionBundlePrice,

promotionDiscountPercentage:
  bonusBuy.promotionDiscountPercentage,

promotionStartsAt:
  bonusBuy.promotionStartsAt,

        promotionEndsAt:
          bonusBuy.promotionEndsAt,
      },
    ],
  };
}

/*
 * ------------------------------------------------
 * Resolve Checkers Bonus Buys
 * ------------------------------------------------
 */

async function enrichCheckersBonusBuys(
  products,
  storeId,
  bonusBuyCache = new Map()
) {
  if (
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return products || [];
  }

  const bonusBuyIds =
    new Set();

  for (const product of products) {
    const ids =
      Array.isArray(
        product.bonusBuyIds
      )
        ? product.bonusBuyIds
        : [];

    for (
      const bonusBuyId
      of ids
    ) {
      if (bonusBuyId) {
        bonusBuyIds.add(
          String(bonusBuyId)
        );
      }
    }
  }

  if (bonusBuyIds.size === 0) {
    return products;
  }

  /*
   * Resolve each unique promotion once.
   */

  for (
    const bonusBuyId
    of bonusBuyIds
  ) {
    if (
      bonusBuyCache.has(
        bonusBuyId
      )
    ) {
      continue;
    }

    try {
      console.log(
        `→ Resolving Checkers Bonus Buy ${bonusBuyId} for store ${storeId}...`
      );

      const response =
        await getCheckersBonusBuy(
          bonusBuyId,
          storeId
        );

      const normalized =
        normalizeCheckersBonusBuy(
          response
        );

      /*
       * Store safety.
       */

      if (
        normalized &&
        normalized.providerStoreId &&
        String(
          normalized.providerStoreId
        ) !==
          String(storeId)
      ) {
        console.warn(
          `Ignoring Checkers Bonus Buy ${bonusBuyId}: returned store ${normalized.providerStoreId}, expected ${storeId}`
        );

        bonusBuyCache.set(
          bonusBuyId,
          null
        );

        continue;
      }

      if (
        normalized &&
        normalized.availableAtStore ===
          false
      ) {
        console.log(
          `Checkers Bonus Buy ${bonusBuyId} is not available at store ${storeId}`
        );

        bonusBuyCache.set(
          bonusBuyId,
          null
        );

        continue;
      }

      bonusBuyCache.set(
        bonusBuyId,
        normalized || null
      );

      if (normalized) {
        console.log(
          `✓ Checkers Bonus Buy resolved: ${
            normalized.promotionMessage ||
            bonusBuyId
          }`
        );
      }
    } catch (error) {
      /*
       * Promotion lookup failure should not
       * destroy the whole basket.
       */

      console.error(
        `Checkers Bonus Buy ${bonusBuyId} failed:`,
        error.message
      );

      bonusBuyCache.set(
        bonusBuyId,
        null
      );
    }
  }

  /*
   * Apply resolved promotions.
   */

  return products.map(
    product => {
      let enriched =
        product;

      const ids =
        Array.isArray(
          product.bonusBuyIds
        )
          ? product.bonusBuyIds
          : [];

      for (
        const bonusBuyId
        of ids
      ) {
        const promotion =
          bonusBuyCache.get(
            String(
              bonusBuyId
            )
          );

        if (!promotion) {
          continue;
        }

        enriched =
          applyBonusBuyToProduct(
            enriched,
            promotion
          );
      }

      return enriched;
    }
  );
}

/*
 * ------------------------------------------------
 * Build failed basket result
 * ------------------------------------------------
 */

function buildUnmatchedResult({
  item,
  storeId,
  searchQuery,
  matchResult,
  priceSource,
  reasons,
}) {
  return {
    retailer:
      "Checkers",

    storeId,

    matched:
      false,

    requestedItem:
      item,

    searchQuery,

    product:
      null,

    score:
      matchResult?.score || 0,

    reasons:
      reasons ||
      matchResult?.reasons ||
      [],

    quantity:
      getQuantity(item),

    unitPrice:
      null,

    normalUnitPrice:
      null,

    normalTotal:
      null,

    lineTotal:
      null,

    promotionalSavings:
      0,

    loyaltySavings:
      0,

    loyaltyApplied:
      false,

    promotionMechanic:
      null,

    promotionQuantity:
      null,

    promotionBundlePrice:
  null,

promotionDiscountPercentage:
  null,

qualifyingBundles:
  0,

    remainingQuantity:
      getQuantity(item),

    priceSource,

    candidates:
      matchResult?.candidates ||
      [],
  };
}

/*
 * ------------------------------------------------
 * Build successful basket result
 * ------------------------------------------------
 */

function buildMatchedResult({
  item,
  storeId,
  searchQuery,
  matchResult,
  priceSource,
  useLoyaltyPricing = true,
}) {
  const product =
    matchResult.match;

  const quantity =
    getQuantity(item);

  const pricing =
    calculateCheckersProductPricing(
      product,
      quantity,
      {
        useLoyaltyPricing,
      }
    );

  /*
   * Invalid price
   */

  if (!pricing) {
    return {
      retailer:
        "Checkers",

      storeId,

      matched:
        false,

      requestedItem:
        item,

      searchQuery,

      product,

      score:
        matchResult.score,

      reasons: [
        ...(
          matchResult.reasons ||
          []
        ),

        "invalid price",
      ],

      quantity,

      unitPrice:
        null,

      normalUnitPrice:
        null,

      normalTotal:
        null,

      lineTotal:
        null,

      promotionalSavings:
        0,

      loyaltySavings:
        0,

      loyaltyApplied:
        false,

      promotionMechanic:
        product?.promotionMechanic ??
        null,

      promotionQuantity:
        product?.promotionQuantity ??
        null,

    promotionBundlePrice:
  product?.promotionBundlePrice ??
  null,

promotionDiscountPercentage:
  product?.promotionDiscountPercentage ??
  null,

qualifyingBundles:
  0,

      remainingQuantity:
        quantity,

      priceSource,

      candidates:
        matchResult.candidates ||
        [],
    };
  }

  return {
    retailer:
      "Checkers",

    storeId,

    matched:
      true,

    requestedItem:
      item,

    searchQuery,

    product,

    score:
      matchResult.score,

    reasons:
      matchResult.reasons ||
      [],

    quantity,

    /*
     * Actual customer price Grossary+
     * uses for this basket.
     */

    unitPrice:
      pricing.unitPrice,

    lineTotal:
      pricing.lineTotal,

    /*
     * Normal Checkers price before
     * Xtra Savings.
     */

    normalUnitPrice:
      pricing.normalUnitPrice,

    normalTotal:
      pricing.normalTotal,

    /*
     * Savings remain separate.
     */

    promotionalSavings:
      pricing.promotionalSavings,

    loyaltySavings:
      pricing.loyaltySavings,

    loyaltyApplied:
      pricing.loyaltyApplied,

    /*
     * Promotion mechanics.
     */

    promotionMechanic:
      pricing.promotionMechanic,

    promotionQuantity:
      pricing.promotionQuantity,

    promotionBundlePrice:
      pricing.promotionBundlePrice,

promotionDiscountPercentage:
  pricing.promotionDiscountPercentage ??
  product?.promotionDiscountPercentage ??
  null,

    /*
     * MULTIBUY details.
     */

    qualifyingBundles:
      pricing.qualifyingBundles ??
      0,

    remainingQuantity:
      pricing.remainingQuantity ??
      0,

    /*
     * cache = Supabase
     * api = fresh Parse request
     */

    priceSource,

    candidates:
      matchResult.candidates ||
      [],
  };
}

/*
 * ------------------------------------------------
 * Get one Checkers basket item
 * ------------------------------------------------
 */

async function getCheckersBasketItem(
  item,
  {
    storeId,
    cachedProducts = [],
    bonusBuyCache = new Map(),
    useLoyaltyPricing = true,
  } = {}
) {
  /*
   * Checkers prices must always belong
   * to a specific branch.
   */

  if (!storeId) {
    throw new Error(
      "Checkers storeId is required."
    );
  }

  const searchQuery =
    buildCheckersSearchQuery(
      item
    );

  /*
   * =====================================
   * 1. TRY CACHE FIRST
   * =====================================
   */

  const cacheMatch =
    matchProduct(
      item,
      cachedProducts
    );

  if (
    cacheMatch.matched &&
    cacheMatch.match
  ) {
    console.log(
      `✓ Checkers cache hit: ${searchQuery}`
    );

    return buildMatchedResult({
      item,
      storeId,
      searchQuery,

      matchResult:
        cacheMatch,

      priceSource:
        "cache",

      useLoyaltyPricing,
    });
  }

  /*
   * =====================================
   * 2. CACHE MISS
   * =====================================
   */

  console.log(
    `✗ Checkers cache miss: ${searchQuery}`
  );

  console.log(
    `→ Fetching Checkers ${storeId} from Parse...`
  );

  /*
   * =====================================
   * 3. SEARCH EXACT CHECKERS BRANCH
   * =====================================
   */

  const response =
    await searchCheckersStoreProducts(
      searchQuery,
      storeId,
      {
        page: 0,
        limit: 20,
      }
    );

  /*
   * =====================================
   * 4. NORMALIZE RESULTS
   * =====================================
   */

  const rawProducts =
    extractCheckersProducts(
      response
    );

  let normalizedProducts =
    normalizeCheckersProducts(
      rawProducts
    );

  /*
   * Critical safety check.
   *
   * Never allow a product from another
   * Checkers branch into this basket.
   */

  normalizedProducts =
    normalizedProducts.filter(
      product =>
        String(
          product.providerStoreId
        ) ===
        String(storeId)
    );

  console.log(
    `Checkers API returned ${normalizedProducts.length} valid products for ${searchQuery}`
  );

  /*
   * =====================================
   * 5. RESOLVE BONUS BUY PROMOTIONS
   * =====================================
   */

  const storeProducts =
    await enrichCheckersBonusBuys(
      normalizedProducts,
      storeId,
      bonusBuyCache
    );

  /*
   * =====================================
   * 6. CACHE ENRICHED PRODUCTS
   * =====================================
   */

  if (storeProducts.length > 0) {
    try {
      await saveProductsToCache({
        retailer:
          "Checkers",

        storeId,

        products:
          storeProducts,
      });

      console.log(
        `✓ Cached ${storeProducts.length} Checkers products`
      );
    } catch (cacheError) {
      /*
       * Cache failure must not stop fresh
       * Checkers pricing from being used.
       */

      console.error(
        "Checkers cache save failed:",
        cacheError.message
      );
    }

    /*
     * Reuse fetched products for later
     * items in this same basket.
     */

    cachedProducts.push(
      ...storeProducts
    );
  }

  /*
   * =====================================
   * 7. MATCH FRESH RESULTS
   * =====================================
   */

  const apiMatch =
    matchProduct(
      item,
      storeProducts
    );

  if (
    !apiMatch.matched ||
    !apiMatch.match
  ) {
    return buildUnmatchedResult({
      item,
      storeId,
      searchQuery,

      matchResult:
        apiMatch,

      priceSource:
        "api",
    });
  }

  /*
   * =====================================
   * 8. RETURN FRESH API MATCH
   * =====================================
   */

  return buildMatchedResult({
    item,
    storeId,
    searchQuery,

    matchResult:
      apiMatch,

    priceSource:
      "api",

    useLoyaltyPricing,
  });
}

/*
 * ------------------------------------------------
 * Build complete Checkers basket
 * ------------------------------------------------
 */

async function getCheckersBasket(
  items,
  {
    storeId,

    /*
     * TEMPORARY:
     *
     * true while Grossary+ loyalty
     * pricing is being tested.
     *
     * Later determine this from user's
     * loyalty cards.
     */

    useLoyaltyPricing = true,
  } = {}
) {
  if (!Array.isArray(items)) {
    throw new Error(
      "Checkers basket items must be an array."
    );
  }

  if (!storeId) {
    throw new Error(
      "Checkers storeId is required."
    );
  }

  const results = [];

  /*
   * =====================================
   * LOAD CACHE ONCE
   * =====================================
   */

  let cachedProducts = [];

  try {
    cachedProducts =
      await getFreshCachedProducts({
        retailer:
          "Checkers",

        storeId,
      });

    console.log(
      `Checkers ${storeId}: ${cachedProducts.length} fresh cached products`
    );

    console.log(
      "Checkers cached products:",
      {
        storeId,

        count:
          cachedProducts.length,

        products:
          cachedProducts.map(
            product => ({
              name:
                product.productName,

              brand:
                product.brand,

              price:
                product.price,

              loyaltyPrice:
                product.loyaltyPrice,

              loyaltySavings:
                product.loyaltySavings,

              requiresLoyaltyCard:
                product.requiresLoyaltyCard,

              promotionType:
                product.promotionType,

              promotionMechanic:
                product.promotionMechanic,
promotionQuantity:
  product.promotionQuantity,

promotionBundlePrice:
  product.promotionBundlePrice,

promotionDiscountPercentage:
  product.promotionDiscountPercentage,

promotionMessage:
  product.promotionMessage,

              promotionEndsAt:
                product.promotionEndsAt,

              providerStoreId:
                product.providerStoreId,
            })
          ),
      }
    );
  } catch (error) {
    /*
     * Cache being unavailable should not
     * completely break retailer pricing.
     */

    console.error(
      "Checkers cache lookup failed:",
      error.message
    );

    cachedProducts = [];
  }

  /*
   * Basket-local Bonus Buy cache.
   *
   * Multiple products can share the same
   * Bonus Buy ID, so only resolve it once.
   */

  const bonusBuyCache =
    new Map();

  /*
   * =====================================
   * PROCESS ITEMS SEQUENTIALLY
   * =====================================
   *
   * Do not use Promise.all().
   *
   * Products fetched for item 1 can then
   * become candidates for item 2.
   */

  for (const item of items) {
    try {
      const result =
        await getCheckersBasketItem(
          item,
          {
            storeId,
            cachedProducts,
            bonusBuyCache,
            useLoyaltyPricing,
          }
        );

      results.push(
        result
      );
    } catch (error) {
      console.error(
        `Checkers search failed for "${buildCheckersSearchQuery(
          item
        )}":`,
        error.message
      );

      /*
       * One failed search should not destroy
       * the entire basket.
       */

      results.push(
        buildUnmatchedResult({
          item,

          storeId,

          searchQuery:
            buildCheckersSearchQuery(
              item
            ),

          priceSource:
            "error",

          reasons: [
            `search failed: ${error.message}`,
          ],
        })
      );
    }
  }

  /*
   * =====================================
   * BASKET SUMMARY
   * =====================================
   */

  const matched =
    results.filter(
      result =>
        result.matched
    );

  const unmatched =
    results.filter(
      result =>
        !result.matched
    );

  /*
   * Actual amount customer pays.
   */

  const total =
    matched.reduce(
      (
        sum,
        result
      ) =>
        sum +
        (
          result.lineTotal ||
          0
        ),
      0
    );

  /*
   * Total before Xtra Savings.
   */

  const normalTotal =
    matched.reduce(
      (
        sum,
        result
      ) =>
        sum +
        (
          result.normalTotal ||
          0
        ),
      0
    );

  /*
   * Standard retailer promotion savings.
   */

  const promotionalSavings =
    matched.reduce(
      (
        sum,
        result
      ) =>
        sum +
        (
          result.promotionalSavings ||
          0
        ),
      0
    );

  /*
   * Xtra Savings.
   */

  const loyaltySavings =
    matched.reduce(
      (
        sum,
        result
      ) =>
        sum +
        (
          result.loyaltySavings ||
          0
        ),
      0
    );

  /*
   * =====================================
   * CACHE / API STATISTICS
   * =====================================
   */

  const cacheHits =
    results.filter(
      result =>
        result.priceSource ===
        "cache"
    ).length;

  const apiResults =
    results.filter(
      result =>
        result.priceSource ===
        "api"
    ).length;

  const failedResults =
    results.filter(
      result =>
        result.priceSource ===
        "error"
    ).length;

  return {
    retailer:
      "Checkers",

    storeId,

    items:
      results,

    matched,

    unmatched,

    /*
     * Actual optimized Checkers spend.
     */

    total:
      Number(
        total.toFixed(2)
      ),

    /*
     * Normal total before Xtra Savings.
     */

    normalTotal:
      Number(
        normalTotal.toFixed(2)
      ),

    /*
     * Savings kept separately.
     */

    promotionalSavings:
      Number(
        promotionalSavings.toFixed(2)
      ),

    loyaltySavings:
      Number(
        loyaltySavings.toFixed(2)
      ),

    itemCount:
      results.length,

    matchedCount:
      matched.length,

    unmatchedCount:
      unmatched.length,

    complete:
      unmatched.length === 0,

    /*
     * Useful while developing Grossary+
     * and monitoring API costs.
     */

    cacheStats: {
      freshProductsLoaded:
        cachedProducts.length,

      cacheHits,

      apiResults,

      failedResults,

      bonusBuysResolved:
        Array.from(
          bonusBuyCache.values()
        ).filter(Boolean).length,

      bonusBuyRequests:
        bonusBuyCache.size,
    },
  };
}

/*
 * ------------------------------------------------
 * Exports
 * ------------------------------------------------
 */

module.exports = {
  buildCheckersSearchQuery,
  extractCheckersProducts,
  getQuantity,
  isPromotionActive,
  canUseLoyaltyPricing,
  calculateCheckersProductPricing,
  applyBonusBuyToProduct,
  enrichCheckersBonusBuys,
  getCheckersBasketItem,
  getCheckersBasket,
};
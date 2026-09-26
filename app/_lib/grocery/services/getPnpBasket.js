const {
  searchPnpStoreProducts,
} = require(
  "../providers/pnp"
);


const {
  normalizePnpProducts,
} = require(
  "../normalizers/pnp"
);


const {
  matchProduct,
} = require(
  "../matchProduct"
);


const {
  getFreshCachedProducts,
  saveProductsToCache,
} = require(
  "./productPriceCache"
);


/*
 * ------------------------------------------------
 * Build PnP search query
 * ------------------------------------------------
 */

function buildPnpSearchQuery(
  item
) {

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
 * Extract products
 * ------------------------------------------------
 */

function extractPnpProducts(
  response
) {

  return (
    response?.data?.products ||
    response?.products ||
    response?.data?.items ||
    response?.items ||
    []
  );
}


/*
 * ------------------------------------------------
 * Quantity
 * ------------------------------------------------
 */

function getQuantity(
  item
) {

  const quantity =
    Number(
      item?.item_quantity
    );


  return (
    Number.isFinite(
      quantity
    ) &&
    quantity > 0
  )
    ? quantity
    : 1;
}


/*
 * ------------------------------------------------
 * Check promotion dates
 * ------------------------------------------------
 *
 * If the provider supplied promotion dates,
 * make sure the promotion is active before
 * applying loyalty pricing.
 *
 * If no dates are available, we rely on the
 * normalized promotion state.
 * ------------------------------------------------
 */

function isPromotionActive(
  product,
  now = new Date()
) {

  if (
    !product?.isPromotion
  ) {

    return false;

  }


  if (
    product.promotionStartsAt
  ) {

    const start =
      new Date(
        product.promotionStartsAt
      );


    if (
      !Number.isNaN(
        start.getTime()
      ) &&
      start.getTime() >
        now.getTime()
    ) {

      return false;

    }

  }


  if (
    product.promotionEndsAt
  ) {

    const end =
      new Date(
        product.promotionEndsAt
      );


    if (
      !Number.isNaN(
        end.getTime()
      ) &&
      end.getTime() <=
        now.getTime()
    ) {

      return false;

    }

  }


  return true;
}


/*
 * ------------------------------------------------
 * Calculate PnP product pricing
 * ------------------------------------------------
 *
 * This is quantity-aware.
 *
 *
 * NORMAL PRICE
 *
 * R45.99 × 1
 * = R45.99
 *
 *
 * SMART SHOPPER FIXED PRICE
 *
 * Normal:
 * R45.99
 *
 * Smart Shopper:
 * R36.99
 *
 * Quantity 1:
 * = R36.99
 *
 *
 * SMART SHOPPER MULTIBUY
 *
 * Normal:
 * R21.99 each
 *
 * Smart Shopper:
 * 2 For R32
 *
 * Quantity 1:
 * = R21.99
 *
 * Quantity 2:
 * = R32.00
 *
 * Quantity 3:
 * = R53.99
 *
 * Quantity 4:
 * = R64.00
 *
 *
 * IMPORTANT:
 *
 * Loyalty pricing is currently enabled by
 * useLoyaltyPricing.
 *
 * Later this should be connected to the
 * user's actual Grossary loyalty-card data.
 * ------------------------------------------------
 */

function calculatePnpProductPricing(
  product,
  quantity,
  {
    useLoyaltyPricing = true,
  } = {}
) {

  const normalUnitPrice =
    Number(
      product?.price
    );


  if (
    !Number.isFinite(
      normalUnitPrice
    )
  ) {

    return null;

  }


  /*
   * Normal customer-pay total.
   */

  const normalTotal =
    Number(
      (
        normalUnitPrice *
        quantity
      ).toFixed(2)
    );


  /*
   * Standard PnP promotion saving.
   *
   * This is NOT Smart Shopper.
   */

  const standardSavingPerUnit =
    Number(
      product
        ?.promotionalSavings
    ) || 0;


  const standardPromotionSavings =
    Number(
      (
        standardSavingPerUnit *
        quantity
      ).toFixed(2)
    );


  /*
   * ------------------------------------------------
   * Can we apply loyalty pricing?
   * ------------------------------------------------
   */

  const canUseLoyalty =
    useLoyaltyPricing === true &&
    product
      ?.requiresLoyaltyCard ===
      true &&
    isPromotionActive(
      product
    );


  /*
   * No usable loyalty promotion.
   */

  if (
    !canUseLoyalty
  ) {

    return {

      unitPrice:
        normalUnitPrice,

      lineTotal:
        normalTotal,

      normalUnitPrice,

      normalTotal,

      promotionalSavings:
        standardPromotionSavings,

      loyaltySavings:
        0,

      loyaltyApplied:
        false,

      promotionType:
        product
          ?.promotionType ||
        null,

      promotionMechanic:
        product
          ?.promotionMechanic ||
        null,

      promotionQuantity:
        product
          ?.promotionQuantity ??
        null,

      promotionBundlePrice:
        product
          ?.promotionBundlePrice ??
        null,

      qualifyingBundles:
        0,

      remainingQuantity:
        quantity,

    };

  }


  /*
   * ------------------------------------------------
   * FIXED PRICE
   * ------------------------------------------------
   *
   * Example:
   *
   * Oros
   *
   * Normal:
   * R45.99
   *
   * Smart Shopper:
   * R36.99
   * ------------------------------------------------
   */

  if (
    product
      ?.promotionMechanic ===
      "FIXED_PRICE"
  ) {

    const loyaltyPrice =
      Number(
        product.loyaltyPrice
      );


    if (
      Number.isFinite(
        loyaltyPrice
      ) &&
      loyaltyPrice >= 0 &&
      loyaltyPrice <
        normalUnitPrice
    ) {

      const lineTotal =
        Number(
          (
            loyaltyPrice *
            quantity
          ).toFixed(2)
        );


      const loyaltySavings =
        Number(
          (
            normalTotal -
            lineTotal
          ).toFixed(2)
        );


      return {

        /*
         * For FIXED_PRICE this is the
         * actual customer-pay unit price.
         */

        unitPrice:
          loyaltyPrice,

        lineTotal,

        normalUnitPrice,

        normalTotal,

        /*
         * Keep standard and loyalty
         * savings separate.
         */

        promotionalSavings:
          0,

        loyaltySavings,

        loyaltyApplied:
          true,

        promotionType:
          product
            ?.promotionType ||
          "SMART_SHOPPER",

        promotionMechanic:
          "FIXED_PRICE",

        promotionQuantity:
          product
            ?.promotionQuantity ??
          1,

        promotionBundlePrice:
          product
            ?.promotionBundlePrice ??
          loyaltyPrice,

        qualifyingBundles:
          quantity,

        remainingQuantity:
          0,

      };

    }

  }


  /*
   * ------------------------------------------------
   * MULTIBUY
   * ------------------------------------------------
   *
   * Example:
   *
   * Coke
   *
   * Normal:
   * R21.99 each
   *
   * Smart Shopper:
   * 2 For R32
   * ------------------------------------------------
   */

  if (
    product
      ?.promotionMechanic ===
      "MULTIBUY"
  ) {

    const promotionQuantity =
      Number(
        product
          .promotionQuantity
      );


    const promotionBundlePrice =
      Number(
        product
          .promotionBundlePrice
      );


    if (
      Number.isFinite(
        promotionQuantity
      ) &&
      promotionQuantity > 0 &&
      Number.isFinite(
        promotionBundlePrice
      ) &&
      promotionBundlePrice >= 0
    ) {

      /*
       * Number of complete promotion bundles.
       */

      const qualifyingBundles =
        Math.floor(
          quantity /
          promotionQuantity
        );


      /*
       * Products left after complete bundles.
       */

      const remainingQuantity =
        quantity %
        promotionQuantity;


      /*
       * User doesn't qualify yet.
       *
       * Example:
       *
       * promotion = 2 For R32
       * quantity = 1
       *
       * They pay normal price.
       */

      if (
        qualifyingBundles === 0
      ) {

        return {

          unitPrice:
            normalUnitPrice,

          lineTotal:
            normalTotal,

          normalUnitPrice,

          normalTotal,

          promotionalSavings:
            0,

          loyaltySavings:
            0,

          loyaltyApplied:
            false,

          promotionType:
            product
              ?.promotionType ||
            "SMART_SHOPPER",

          promotionMechanic:
            "MULTIBUY",

          promotionQuantity,

          promotionBundlePrice,

          qualifyingBundles:
            0,

          remainingQuantity:
            quantity,

        };

      }


      /*
       * Complete bundles.
       */

      const bundlesTotal =
        qualifyingBundles *
        promotionBundlePrice;


      /*
       * Any remaining items are bought
       * at the normal unit price.
       */

      const remainingTotal =
        remainingQuantity *
        normalUnitPrice;


      const lineTotal =
        Number(
          (
            bundlesTotal +
            remainingTotal
          ).toFixed(2)
        );


      /*
       * Actual saving achieved for this
       * requested quantity.
       */

      const loyaltySavings =
        Math.max(
          0,
          Number(
            (
              normalTotal -
              lineTotal
            ).toFixed(2)
          )
        );


      /*
       * Effective average unit price.
       *
       * IMPORTANT:
       *
       * This is only useful for display.
       *
       * lineTotal is the authoritative
       * customer-pay amount.
       */

      const effectiveUnitPrice =
        Number(
          (
            lineTotal /
            quantity
          ).toFixed(2)
        );


      return {

        unitPrice:
          effectiveUnitPrice,

        lineTotal,

        normalUnitPrice,

        normalTotal,

        promotionalSavings:
          0,

        loyaltySavings,

        loyaltyApplied:
          true,

        promotionType:
          product
            ?.promotionType ||
          "SMART_SHOPPER",

        promotionMechanic:
          "MULTIBUY",

        promotionQuantity,

        promotionBundlePrice,

        qualifyingBundles,

        remainingQuantity,

      };

    }

  }


  /*
   * ------------------------------------------------
   * UNKNOWN loyalty promotion
   * ------------------------------------------------
   *
   * Never guess promotion maths.
   *
   * Use normal customer-pay price.
   * ------------------------------------------------
   */

  return {

    unitPrice:
      normalUnitPrice,

    lineTotal:
      normalTotal,

    normalUnitPrice,

    normalTotal,

    promotionalSavings:
      standardPromotionSavings,

    loyaltySavings:
      0,

    loyaltyApplied:
      false,

    promotionType:
      product
        ?.promotionType ||
      null,

    promotionMechanic:
      product
        ?.promotionMechanic ||
      null,

    promotionQuantity:
      product
        ?.promotionQuantity ??
      null,

    promotionBundlePrice:
      product
        ?.promotionBundlePrice ??
      null,

    qualifyingBundles:
      0,

    remainingQuantity:
      quantity,

  };
}


/*
 * ------------------------------------------------
 * Build unmatched basket result
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
      "Pick n Pay",

    storeId,

    matched:
      false,

    requestedItem:
      item,

    searchQuery,

    product:
      null,

    score:
      matchResult?.score ||
      0,

    reasons:
      reasons ||
      matchResult?.reasons ||
      [],

    quantity:
      getQuantity(
        item
      ),

    unitPrice:
      null,

    normalUnitPrice:
      null,

    lineTotal:
      null,

    normalTotal:
      null,

    promotionalSavings:
      0,

    loyaltySavings:
      0,

    loyaltyApplied:
      false,

    promotionType:
      null,

    promotionMechanic:
      null,

    promotionQuantity:
      null,

    promotionBundlePrice:
      null,

    qualifyingBundles:
      0,

    remainingQuantity:
      0,

    priceSource,

    candidates:
      matchResult?.candidates ||
      [],

  };
}


/*
 * ------------------------------------------------
 * Build matched basket result
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
    getQuantity(
      item
    );


  /*
   * Calculate the actual customer-pay
   * amount for this quantity.
   */

  const pricing =
    calculatePnpProductPricing(
      product,
      quantity,
      {
        useLoyaltyPricing,
      }
    );


  /*
   * ------------------------------------------------
   * Invalid price
   * ------------------------------------------------
   */

  if (
    !pricing
  ) {

    return {

      retailer:
        "Pick n Pay",

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

      lineTotal:
        null,

      normalTotal:
        null,

      promotionalSavings:
        0,

      loyaltySavings:
        0,

      loyaltyApplied:
        false,

      promotionType:
        null,

      promotionMechanic:
        null,

      promotionQuantity:
        null,

      promotionBundlePrice:
        null,

      qualifyingBundles:
        0,

      remainingQuantity:
        0,

      priceSource,

      candidates:
        matchResult.candidates ||
        [],

    };

  }


  return {

    retailer:
      "Pick n Pay",

    storeId,

    matched:
      true,

    requestedItem:
      item,

    searchQuery,

    /*
     * Keep full normalized product.
     *
     * This includes:
     *
     * price
     * loyaltyPrice
     * loyaltySavings
     * promotionType
     * promotionMechanic
     * promotionQuantity
     * promotionBundlePrice
     * promotionMessage
     * promotionStartsAt
     * promotionEndsAt
     */

    product,

    score:
      matchResult.score,

    reasons:
      matchResult.reasons ||
      [],

    quantity,


    /*
     * Actual/effective customer-pay
     * unit price.
     *
     * For MULTIBUY this is the average
     * effective price for display.
     */

    unitPrice:
      pricing.unitPrice,


    /*
     * Normal PnP unit price.
     */

    normalUnitPrice:
      pricing.normalUnitPrice,


    /*
     * AUTHORITATIVE amount the customer
     * pays for this requested quantity.
     */

    lineTotal:
      pricing.lineTotal,


    /*
     * What the quantity would cost at
     * the normal PnP price.
     */

    normalTotal:
      pricing.normalTotal,


    /*
     * Standard promotion saving.
     */

    promotionalSavings:
      pricing
        .promotionalSavings,


    /*
     * Smart Shopper saving.
     */

    loyaltySavings:
      pricing
        .loyaltySavings,

    loyaltyApplied:
      pricing
        .loyaltyApplied,


    /*
     * Promotion metadata.
     */

    promotionType:
      pricing
        .promotionType,

    promotionMechanic:
      pricing
        .promotionMechanic,

    promotionQuantity:
      pricing
        .promotionQuantity,

    promotionBundlePrice:
      pricing
        .promotionBundlePrice,

    qualifyingBundles:
      pricing
        .qualifyingBundles,

    remainingQuantity:
      pricing
        .remainingQuantity,


    /*
     * cache = Supabase cache value
     * api   = fresh Parse result
     */

    priceSource,


    candidates:
      matchResult.candidates ||
      [],

  };
}


/*
 * ------------------------------------------------
 * Get one PnP basket item
 * ------------------------------------------------
 */

async function getPnpBasketItem(
  item,
  {
    storeId,
    cachedProducts = [],

    /*
     * Temporary default for testing.
     *
     * Later this should come from the
     * user's Grossary loyalty cards.
     */

    useLoyaltyPricing = true,

  } = {}
) {

  if (
    !storeId
  ) {

    throw new Error(
      "PnP storeId is required."
    );

  }


  const searchQuery =
    buildPnpSearchQuery(
      item
    );


  // =====================================
  // 1. TRY CACHE FIRST
  // =====================================

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
      `✓ PnP cache hit: ${searchQuery}`
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


  // =====================================
  // 2. CACHE MISS
  // =====================================

  console.log(
    `✗ PnP cache miss: ${searchQuery}`
  );


  console.log(
    `→ Fetching PnP ${storeId} from Parse...`
  );


  // =====================================
  // 3. STORE-SPECIFIC PNP SEARCH
  // =====================================

  const response =
    await searchPnpStoreProducts(
      searchQuery,
      storeId,
      {
        page: 0,
        pageSize: 20,
      }
    );


  // =====================================
  // 4. NORMALIZE RESULTS
  // =====================================

  const rawProducts =
    extractPnpProducts(
      response
    );


  const normalizedProducts =
    normalizePnpProducts(
      rawProducts
    );


  /*
   * Extra store safety.
   */

  const storeProducts =
    normalizedProducts.filter(
      product =>
        String(
          product.providerStoreId
        ) ===
        String(
          storeId
        )
    );


  console.log(
    `PnP API returned ${storeProducts.length} valid products for ${searchQuery}`
  );


  // =====================================
  // 5. CACHE ALL RETURNED PRODUCTS
  // =====================================

  if (
    storeProducts.length > 0
  ) {

    try {

      await saveProductsToCache({

        retailer:
          "Pick n Pay",

        storeId,

        products:
          storeProducts,

      });


      console.log(
        `✓ Cached ${storeProducts.length} PnP products`
      );

    } catch (
      cacheError
    ) {

      /*
       * Cache-write problems should not
       * stop Grossary from using fresh
       * retailer results.
       */

      console.error(
        "PnP cache save failed:",
        cacheError.message
      );

    }


    /*
     * Reuse newly downloaded products
     * for later items in this basket.
     */

    cachedProducts.push(
      ...storeProducts
    );

  }


  // =====================================
  // 6. MATCH FRESH API PRODUCTS
  // =====================================

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


  // =====================================
  // 7. RETURN FRESH API MATCH
  // =====================================

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
 * Build complete PnP basket
 * ------------------------------------------------
 */

async function getPnpBasket(
  items,
  {
    storeId,

    /*
     * Temporary testing default.
     *
     * Later:
     *
     * true only if the Grossary user
     * has the relevant loyalty card.
     */

    useLoyaltyPricing = true,

  } = {}
) {

  if (
    !Array.isArray(
      items
    )
  ) {

    throw new Error(
      "PnP basket items must be an array."
    );

  }


  if (
    !storeId
  ) {

    throw new Error(
      "PnP storeId is required."
    );

  }


  const results =
    [];


  // =====================================
  // LOAD CACHE ONCE
  // =====================================

  let cachedProducts =
    [];


  try {

    cachedProducts =
      await getFreshCachedProducts({

        retailer:
          "Pick n Pay",

        storeId,

      });


    console.log(
      `PnP ${storeId}: ${cachedProducts.length} fresh cached products`
    );


    /*
     * Useful while testing promotion
     * normalization.
     */

    console.log(
      "PnP cached products:",
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

              promotionType:
                product.promotionType,

              promotionMechanic:
                product
                  .promotionMechanic,

              promotionQuantity:
                product
                  .promotionQuantity,

              promotionBundlePrice:
                product
                  .promotionBundlePrice,

              promotionEndsAt:
                product
                  .promotionEndsAt,

              providerStoreId:
                product.providerStoreId,

            })
          ),

      }
    );

  } catch (
    error
  ) {

    console.error(
      "PnP cache lookup failed:",
      error.message
    );


    cachedProducts =
      [];

  }


  // =====================================
  // PROCESS ITEMS SEQUENTIALLY
  // =====================================

  /*
   * Sequential processing is deliberate.
   *
   * Products downloaded for one item can
   * immediately become candidates for the
   * next list item.
   */

  for (
    const item
    of items
  ) {

    try {

      const result =
        await getPnpBasketItem(
          item,
          {

            storeId,

            cachedProducts,

            useLoyaltyPricing,

          }
        );


      results.push(
        result
      );

    } catch (
      error
    ) {

      console.error(
        `PnP search failed for "${buildPnpSearchQuery(
          item
        )}":`,
        error.message
      );


      results.push(
        buildUnmatchedResult({

          item,

          storeId,

          searchQuery:
            buildPnpSearchQuery(
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


  // =====================================
  // BASKET SUMMARY
  // =====================================

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
   * Actual customer-pay basket total.
   */

  const total =
    matched.reduce(
      (
        sum,
        result
      ) =>
        sum +
        (
          Number(
            result.lineTotal
          ) || 0
        ),
      0
    );


  /*
   * Standard retailer promotional
   * savings.
   */

  const promotionalSavings =
    matched.reduce(
      (
        sum,
        result
      ) =>
        sum +
        (
          Number(
            result
              .promotionalSavings
          ) || 0
        ),
      0
    );


  /*
   * Loyalty-card savings.
   *
   * Kept separate from standard
   * promotional savings.
   */

  const loyaltySavings =
    matched.reduce(
      (
        sum,
        result
      ) =>
        sum +
        (
          Number(
            result.loyaltySavings
          ) || 0
        ),
      0
    );


  // =====================================
  // CACHE / API STATISTICS
  // =====================================

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
      "Pick n Pay",

    storeId,

    items:
      results,

    matched,

    unmatched,

    /*
     * Actual basket total after applicable
     * loyalty pricing.
     */

    total:
      Number(
        total.toFixed(2)
      ),


    /*
     * Standard PnP promotional savings.
     */

    promotionalSavings:
      Number(
        promotionalSavings
          .toFixed(2)
      ),


    /*
     * Smart Shopper savings.
     */

    loyaltySavings:
      Number(
        loyaltySavings
          .toFixed(2)
      ),


    itemCount:
      results.length,

    matchedCount:
      matched.length,

    unmatchedCount:
      unmatched.length,

    complete:
      unmatched.length ===
      0,

    cacheStats: {

      freshProductsLoaded:
        cachedProducts.length,

      cacheHits,

      apiResults,

      failedResults,

    },

  };
}


/*
 * ------------------------------------------------
 * Exports
 * ------------------------------------------------
 */

module.exports = {

  buildPnpSearchQuery,

  extractPnpProducts,

  calculatePnpProductPricing,

  getPnpBasketItem,

  getPnpBasket,

};
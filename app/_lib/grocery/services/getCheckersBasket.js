const {
  searchCheckersStoreProducts,
} = require(
  "../providers/checkers"
);

const {
  normalizeCheckersProducts,
} = require(
  "../normalizers/checkers"
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
 * Build Checkers search query
 * ------------------------------------------------
 */

function buildCheckersSearchQuery(
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
 * Extract products from Parse response
 * ------------------------------------------------
 */

function extractCheckersProducts(
  response
) {

  const data =
    response?.data ??
    response;


  return Array.isArray(
    data?.products
  )
    ? data.products
    : [];
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
      matchResult?.score ||
      0,

    reasons:
      reasons ||
      matchResult?.reasons ||
      [],

    quantity:
      Number(
        item.item_quantity
      ) || 1,

    unitPrice:
      null,

    lineTotal:
      null,

    promotionalSavings:
      0,

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
}) {

  const product =
    matchResult.match;


  const quantity =
    Number(
      item.item_quantity
    ) || 1;


  const unitPrice =
    Number(
      product.price
    );


  /*
   * ------------------------------------------------
   * Invalid price
   * ------------------------------------------------
   */

  if (
    !Number.isFinite(
      unitPrice
    )
  ) {

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

      lineTotal:
        null,

      promotionalSavings:
        0,

      priceSource,

      candidates:
        matchResult.candidates ||
        [],
    };

  }


  /*
   * ------------------------------------------------
   * Calculate line total
   * ------------------------------------------------
   */

  const lineTotal =
    unitPrice *
    quantity;


  /*
   * promotionalSavings is per unit.
   */
  const promotionalSavings =
    (
      Number(
        product.promotionalSavings
      ) || 0
    ) *
    quantity;


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

    unitPrice,

    lineTotal:
      Number(
        lineTotal.toFixed(2)
      ),

    promotionalSavings:
      Number(
        promotionalSavings.toFixed(2)
      ),

    /*
     * cache = today's Supabase data
     * api   = fresh Parse request
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


  // =====================================
  // 1. TRY TODAY'S CACHE FIRST
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
    });

  }


  // =====================================
  // 2. CACHE MISS
  // =====================================

  console.log(
    `✗ Checkers cache miss: ${searchQuery}`
  );


  console.log(
    `→ Fetching Checkers ${storeId} from Parse...`
  );


  // =====================================
  // 3. SEARCH EXACT CHECKERS BRANCH
  // =====================================

  const response =
    await searchCheckersStoreProducts(
      searchQuery,
      storeId,
      {
        page: 0,
        limit: 20,
      }
    );


  // =====================================
  // 4. NORMALIZE RESULTS
  // =====================================

  const rawProducts =
    extractCheckersProducts(
      response
    );


  const normalizedProducts =
    normalizeCheckersProducts(
      rawProducts
    );


  /*
   * Critical safety check.
   *
   * Never allow a product from another
   * Checkers branch into this basket.
   */
  const storeProducts =
    normalizedProducts.filter(
      product =>
        String(
          product.providerStoreId
        ) ===
        String(storeId)
    );


  console.log(
    `Checkers API returned ${storeProducts.length} valid products for ${searchQuery}`
  );


  // =====================================
  // 5. CACHE ALL RETURNED PRODUCTS
  // =====================================

  if (
    storeProducts.length >
    0
  ) {

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
       * A cache write failure must NOT
       * prevent Grossary from using the
       * fresh API result.
       */
      console.error(
        "Checkers cache save failed:",
        cacheError.message
      );

    }


    /*
     * Add these products to the same
     * in-memory cache used by the basket.
     *
     * This is important because the next
     * list item may be satisfied by the
     * products we just downloaded.
     */
    cachedProducts.push(
      ...storeProducts
    );

  }


  // =====================================
  // 6. MATCH AGAINST FRESH API RESULTS
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
  } = {}
) {

  if (
    !Array.isArray(items)
  ) {

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


  // =====================================
  // LOAD TODAY'S CACHE ONCE
  // =====================================

  let cachedProducts =
    [];


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
     *
     * Grossary can still fall back to
     * Parse.
     */
    console.error(
      "Checkers cache lookup failed:",
      error.message
    );


    cachedProducts =
      [];

  }


  // =====================================
  // PROCESS ITEMS SEQUENTIALLY
  // =====================================

  /*
   * Do not use Promise.all().
   *
   * Besides provider limits, processing
   * sequentially allows products fetched
   * for item 1 to become cache candidates
   * for item 2 during the same request.
   */
  for (
    const item
    of items
  ) {

    try {

      const result =
        await getCheckersBasketItem(
          item,
          {
            storeId,

            /*
             * Same array instance is shared
             * between all basket items.
             */
            cachedProducts,
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
       * One failed search should not
       * destroy the entire basket.
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
      "Checkers",

    storeId,

    items:
      results,

    matched,

    unmatched,

    total:
      Number(
        total.toFixed(2)
      ),

    promotionalSavings:
      Number(
        promotionalSavings.toFixed(2)
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


    /*
     * Useful while developing Grossary
     * Plus and monitoring API costs.
     */
    cacheStats: {

      freshProductsLoaded:
        cachedProducts.length,

      cacheHits,

      apiResults,

      failedResults,
    },
  };
}


module.exports = {
  buildCheckersSearchQuery,
  extractCheckersProducts,
  getCheckersBasketItem,
  getCheckersBasket,
};
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
 * Build matched basket result
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
   * Totals
   * ------------------------------------------------
   */

  const lineTotal =
    unitPrice *
    quantity;


  const promotionalSavings =
    (
      Number(
        product.promotionalSavings
      ) || 0
    ) *
    quantity;


  return {

    retailer:
      "Pick n Pay",

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
     * cache = today's Supabase value
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
  } = {}
) {

  if (!storeId) {
    throw new Error(
      "PnP storeId is required."
    );
  }


  const searchQuery =
    buildPnpSearchQuery(
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
   *
   * Use String() because provider IDs
   * may not always arrive with the same
   * primitive type.
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
    `PnP API returned ${storeProducts.length} valid products for ${searchQuery}`
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
          "Pick n Pay",

        storeId,

        products:
          storeProducts,
      });


      console.log(
        `✓ Cached ${storeProducts.length} PnP products`
      );

    } catch (cacheError) {

      /*
       * A cache-write problem should not
       * prevent Grossary from using the
       * fresh retailer result.
       */
      console.error(
        "PnP cache save failed:",
        cacheError.message
      );
    }


    /*
     * Reuse newly downloaded products
     * for later items in this same basket.
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


  if (!storeId) {

    throw new Error(
      "PnP storeId is required."
    );
  }


  const results =
    [];


  // =====================================
  // LOAD TODAY'S CACHE ONCE
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

          providerStoreId:
            product.providerStoreId,
        })
      ),
  }
);
  } catch (error) {

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
   * immediately become cache candidates
   * for the following list item.
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
          }
        );


      results.push(
        result
      );

    } catch (error) {

      console.error(
        `PnP search failed for "${buildPnpSearchQuery(
          item
        )}":`,
        error.message
      );


      /*
       * One failed retailer request should
       * not destroy the whole basket.
       */
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
      "Pick n Pay",

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
  buildPnpSearchQuery,
  extractPnpProducts,
  getPnpBasketItem,
  getPnpBasket,
};
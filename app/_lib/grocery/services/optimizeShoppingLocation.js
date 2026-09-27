const {
  getCheckersBasket,
} = require(
  "./getCheckersBasket"
);

const {
  getPnpBasket,
} = require(
  "./getPnpBasket"
);


/*
 * ------------------------------------------------
 * Find retailer result for a requested item
 * ------------------------------------------------
 */

function findBasketItem(
  basket,
  item
) {

  return basket.items.find(
    basketItem =>
      basketItem
        .requestedItem
        ?.id === item.id
  );
}


/*
 * ------------------------------------------------
 * Determine whether a retailer result can
 * actually be used by the optimizer
 * ------------------------------------------------
 */

function isUsableResult(
  result
) {

  if (!result) {
    return false;
  }


  if (!result.matched) {
    return false;
  }


  if (
    !Number.isFinite(
      Number(
        result.unitPrice
      )
    )
  ) {

    return false;
  }


  /*
   * Explicitly out-of-stock products
   * cannot be selected.
   *
   * null = stock unknown.
   */

  if (
    result.product?.inStock ===
    false
  ) {

    return false;
  }


  return true;
}


/*
 * ------------------------------------------------
 * Choose cheapest retailer for one item
 * ------------------------------------------------
 */

function chooseBestItemOption(
  item,
  checkersResult,
  pnpResult
) {

  const checkersUsable =
    isUsableResult(
      checkersResult
    );


  const pnpUsable =
    isUsableResult(
      pnpResult
    );


  /*
   * Neither retailer has a usable match.
   */

  if (
    !checkersUsable &&
    !pnpUsable
  ) {

    return {

      requestedItem:
        item,

      matched:
        false,

      retailer:
        null,

      storeId:
        null,

      product:
        null,

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

      loyaltySavings:
        0,

      checkers:
        checkersResult ||
        null,

      pnp:
        pnpResult ||
        null,

    };
  }


  /*
   * Only Checkers has the item.
   */

  if (
    checkersUsable &&
    !pnpUsable
  ) {

    return {

      ...checkersResult,

      selectedRetailer:
        "Checkers",

      checkers:
        checkersResult,

      pnp:
        pnpResult ||
        null,

    };
  }


  /*
   * Only PnP has the item.
   */

  if (
    !checkersUsable &&
    pnpUsable
  ) {

    return {

      ...pnpResult,

      selectedRetailer:
        "Pick n Pay",

      checkers:
        checkersResult ||
        null,

      pnp:
        pnpResult,

    };
  }


  /*
   * Both retailers have the item.
   *
   * Compare the effective unit price
   * returned by the basket provider.
   */

  const checkersPrice =
    Number(
      checkersResult.unitPrice
    );


  const pnpPrice =
    Number(
      pnpResult.unitPrice
    );


  if (
    checkersPrice <
    pnpPrice
  ) {

    return {

      ...checkersResult,

      selectedRetailer:
        "Checkers",

      checkers:
        checkersResult,

      pnp:
        pnpResult,

    };
  }


  if (
    pnpPrice <
    checkersPrice
  ) {

    return {

      ...pnpResult,

      selectedRetailer:
        "Pick n Pay",

      checkers:
        checkersResult,

      pnp:
        pnpResult,

    };
  }


  /*
   * Equal price.
   *
   * Keep Checkers as deterministic
   * tie-breaker for now.
   */

  return {

    ...checkersResult,

    selectedRetailer:
      "Checkers",

    priceTie:
      true,

    checkers:
      checkersResult,

    pnp:
      pnpResult,

  };
}


/*
 * ------------------------------------------------
 * Build retailer allocation
 * ------------------------------------------------
 */

function buildRetailerAllocation(
  optimizedItems,
  retailer
) {

  const items =
    optimizedItems.filter(
      item =>
        item.matched &&
        item.selectedRetailer ===
          retailer
    );


  const total =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item.lineTotal
          ) || 0
        ),
      0
    );


  const promotionalSavings =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item
              .promotionalSavings
          ) || 0
        ),
      0
    );


  const loyaltySavings =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item
              .loyaltySavings
          ) || 0
        ),
      0
    );


  return {

    retailer,

    items,

    itemCount:
      items.length,

    total:
      Number(
        total.toFixed(2)
      ),

    promotionalSavings:
      Number(
        promotionalSavings
          .toFixed(2)
      ),

    loyaltySavings:
      Number(
        loyaltySavings
          .toFixed(2)
      ),

  };
}


/*
 * ------------------------------------------------
 * Get all usable matched items from one
 * retailer basket.
 * ------------------------------------------------
 */

function getUsableBasketItems(
  basket
) {

  if (
    !Array.isArray(
      basket?.items
    )
  ) {

    return [];
  }


  return basket.items.filter(
    item =>
      isUsableResult(
        item
      )
  );
}


/*
 * ------------------------------------------------
 * Build a single-store option
 * ------------------------------------------------
 *
 * IMPORTANT:
 *
 * We no longer discard a retailer simply
 * because some requested products could
 * not be matched.
 *
 * A retailer can therefore produce:
 *
 * complete = true
 *
 * OR
 *
 * complete = false
 *
 * The partial option contains only products
 * that were confidently matched at that
 * retailer.
 * ------------------------------------------------
 */

function getSingleStoreOption(
  basket,
  store,
  totalRequestedItems
) {

  const matchedItems =
    getUsableBasketItems(
      basket
    );


  if (
    matchedItems.length ===
    0
  ) {

    return {

      retailer:
        basket?.retailer ||
        null,

      storeId:
        store?.storeId ||
        null,

      storeName:
        store?.storeName ||
        null,

      complete:
        false,

      partial:
        true,

      matchedCount:
        0,

      unmatchedCount:
        totalRequestedItems,

      coverage:
        0,

      total:
        null,

      promotionalSavings:
        0,

      loyaltySavings:
        0,

      items:
        [],

    };
  }


  const total =
    matchedItems.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item.lineTotal
          ) || 0
        ),
      0
    );


  const promotionalSavings =
    matchedItems.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item
              .promotionalSavings
          ) || 0
        ),
      0
    );


  const loyaltySavings =
    matchedItems.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item
              .loyaltySavings
          ) || 0
        ),
      0
    );


  const matchedCount =
    matchedItems.length;


  const unmatchedCount =
    Math.max(
      0,
      totalRequestedItems -
      matchedCount
    );


  const complete =
    unmatchedCount ===
    0;


  const coverage =
    totalRequestedItems > 0
      ? matchedCount /
        totalRequestedItems
      : 0;


  return {

    retailer:
      basket.retailer,

    storeId:
      store.storeId,

    storeName:
      store.storeName,

    complete,

    partial:
      !complete,

    matchedCount,

    unmatchedCount,

    coverage:
      Number(
        coverage.toFixed(4)
      ),

    total:
      Number(
        total.toFixed(2)
      ),

    promotionalSavings:
      Number(
        promotionalSavings
          .toFixed(2)
      ),

    loyaltySavings:
      Number(
        loyaltySavings
          .toFixed(2)
      ),

    items:
      matchedItems,

  };
}


/*
 * ------------------------------------------------
 * Find items matched at BOTH retailers
 * ------------------------------------------------
 *
 * This gives us a fair comparison when
 * neither store can supply the complete
 * requested list.
 *
 * We don't want to compare:
 *
 * Checkers: 4 items = R200
 *
 * against:
 *
 * PnP: 7 items = R350
 *
 * because those are different baskets.
 * ------------------------------------------------
 */

function getCommonMatchedItemIds(
  checkersBasket,
  pnpBasket
) {

  const checkersIds =
    new Set(
      getUsableBasketItems(
        checkersBasket
      )
        .map(
          item =>
            item
              ?.requestedItem
              ?.id
        )
        .filter(Boolean)
    );


  const pnpIds =
    new Set(
      getUsableBasketItems(
        pnpBasket
      )
        .map(
          item =>
            item
              ?.requestedItem
              ?.id
        )
        .filter(Boolean)
    );


  return new Set(
    [
      ...checkersIds,
    ].filter(
      id =>
        pnpIds.has(id)
    )
  );
}


/*
 * ------------------------------------------------
 * Build fair partial single-store option
 * ------------------------------------------------
 *
 * Uses the SAME requested items at both
 * retailers.
 * ------------------------------------------------
 */

function getComparablePartialOption(
  basket,
  store,
  commonMatchedIds,
  totalRequestedItems
) {

  const items =
    getUsableBasketItems(
      basket
    ).filter(
      item =>
        commonMatchedIds.has(
          item
            ?.requestedItem
            ?.id
        )
    );


  if (
    items.length ===
    0
  ) {

    return null;
  }


  const total =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item.lineTotal
          ) || 0
        ),
      0
    );


  const promotionalSavings =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item
              .promotionalSavings
          ) || 0
        ),
      0
    );


  const loyaltySavings =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item
              .loyaltySavings
          ) || 0
        ),
      0
    );


  const matchedCount =
    items.length;


  return {

    retailer:
      basket.retailer,

    storeId:
      store.storeId,

    storeName:
      store.storeName,

    complete:
      matchedCount ===
      totalRequestedItems,

    partial:
      matchedCount !==
      totalRequestedItems,

    matchedCount,

    unmatchedCount:
      Math.max(
        0,
        totalRequestedItems -
        matchedCount
      ),

    coverage:
      totalRequestedItems > 0
        ? Number(
            (
              matchedCount /
              totalRequestedItems
            ).toFixed(4)
          )
        : 0,

    total:
      Number(
        total.toFixed(2)
      ),

    promotionalSavings:
      Number(
        promotionalSavings
          .toFixed(2)
      ),

    loyaltySavings:
      Number(
        loyaltySavings
          .toFixed(2)
      ),

    items,

  };
}


/*
 * ------------------------------------------------
 * Pick cheapest option
 * ------------------------------------------------
 */

function getCheapestOption(
  options
) {

  const validOptions =
    options.filter(
      option =>
        option &&
        Number.isFinite(
          Number(
            option.total
          )
        )
    );


  if (
    validOptions.length ===
    0
  ) {

    return null;
  }


  return validOptions.reduce(
    (
      cheapest,
      option
    ) => {

      if (!cheapest) {
        return option;
      }


      return (
        Number(
          option.total
        ) <
        Number(
          cheapest.total
        )
      )
        ? option
        : cheapest;

    },
    null
  );
}


/*
 * ------------------------------------------------
 * Optimize one shared shopping location
 * ------------------------------------------------
 */

async function optimizeShoppingLocation({
  items,
  location,
}) {

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {

    throw new Error(
      "Grossary Plus requires at least one item."
    );
  }


  if (
    !location?.checkers?.storeId
  ) {

    throw new Error(
      "Checkers storeId is required."
    );
  }


  if (
    !location?.pnp?.storeId
  ) {

    throw new Error(
      "PnP storeId is required."
    );
  }


  /*
   * ------------------------------------------------
   * Price the same list at both stores
   * ------------------------------------------------
   *
   * Keep sequential for now because both
   * providers currently have Parse limits.
   */

  const checkersBasket =
    await getCheckersBasket(
      items,
      {
        storeId:
          location
            .checkers
            .storeId,
      }
    );


  const pnpBasket =
    await getPnpBasket(
      items,
      {
        storeId:
          location
            .pnp
            .storeId,
      }
    );


  /*
   * ------------------------------------------------
   * Optimize item by item
   * ------------------------------------------------
   */

  const optimizedItems =
    items.map(
      item => {

        const checkersResult =
          findBasketItem(
            checkersBasket,
            item
          );


        const pnpResult =
          findBasketItem(
            pnpBasket,
            item
          );


        return chooseBestItemOption(
          item,
          checkersResult,
          pnpResult
        );

      }
    );


  const unmatchedItems =
    optimizedItems.filter(
      item =>
        !item.matched
    );


  const matchedItems =
    optimizedItems.filter(
      item =>
        item.matched
    );


  /*
   * ------------------------------------------------
   * Split allocation
   * ------------------------------------------------
   */

  const checkersAllocation =
    buildRetailerAllocation(
      optimizedItems,
      "Checkers"
    );


  const pnpAllocation =
    buildRetailerAllocation(
      optimizedItems,
      "Pick n Pay"
    );


  const optimizedTotal =
    matchedItems.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item.lineTotal
          ) || 0
        ),
      0
    );


  const promotionalSavings =
    matchedItems.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item
              .promotionalSavings
          ) || 0
        ),
      0
    );


  const loyaltySavings =
    matchedItems.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          Number(
            item
              .loyaltySavings
          ) || 0
        ),
      0
    );


  /*
   * ------------------------------------------------
   * Full single-store alternatives
   * ------------------------------------------------
   *
   * These now contain useful information
   * even when the retailer only matched
   * part of the list.
   */

  const checkersOnly =
    getSingleStoreOption(
      checkersBasket,
      location.checkers,
      items.length
    );


  const pnpOnly =
    getSingleStoreOption(
      pnpBasket,
      location.pnp,
      items.length
    );


  /*
   * ------------------------------------------------
   * Complete single-store option
   * ------------------------------------------------
   */

  const cheapestComplete =
    getCheapestOption(
      [
        checkersOnly?.complete
          ? checkersOnly
          : null,

        pnpOnly?.complete
          ? pnpOnly
          : null,
      ]
    );


  /*
   * ------------------------------------------------
   * Partial single-store option
   * ------------------------------------------------
   *
   * IMPORTANT:
   *
   * Compare exactly the same products at
   * Checkers and PnP.
   */

  const commonMatchedIds =
    getCommonMatchedItemIds(
      checkersBasket,
      pnpBasket
    );


  const checkersPartial =
    getComparablePartialOption(
      checkersBasket,
      location.checkers,
      commonMatchedIds,
      items.length
    );


  const pnpPartial =
    getComparablePartialOption(
      pnpBasket,
      location.pnp,
      commonMatchedIds,
      items.length
    );


  const cheapestPartial =
    getCheapestOption(
      [
        checkersPartial,
        pnpPartial,
      ]
    );


  /*
   * ------------------------------------------------
   * Convenience option
   * ------------------------------------------------
   *
   * Priority:
   *
   * 1. Complete single-store basket
   *
   * 2. Fair partial single-store basket
   */

  const convenienceOption =
    cheapestComplete ||
    cheapestPartial;


  /*
   * Keep `cheapest` for compatibility with
   * the existing frontend/select-plan API.
   *
   * This means the frontend can immediately
   * show a convenience option even when
   * products are unmatched.
   */

  const cheapestSingleStore =
    convenienceOption;


  /*
   * ------------------------------------------------
   * Is optimized result complete?
   * ------------------------------------------------
   */

  const complete =
    unmatchedItems.length ===
    0;


  /*
   * ------------------------------------------------
   * Combination savings
   * ------------------------------------------------
   *
   * For a complete basket, compare against
   * the complete convenience option.
   *
   * For an incomplete basket we deliberately
   * do NOT compare optimizedTotal against a
   * partial convenience basket because they
   * may represent different item subsets.
   */

  let combinationSavings =
    null;


  if (
    complete &&
    cheapestComplete
  ) {

    combinationSavings =
      Math.max(
        0,

        Number(
          cheapestComplete.total
        ) -
        optimizedTotal
      );
  }


  /*
   * ------------------------------------------------
   * Number of retailers actually needed
   * ------------------------------------------------
   */

  const storesUsed =
    [
      checkersAllocation,
      pnpAllocation,
    ].filter(
      allocation =>
        allocation.itemCount >
        0
    ).length;


  /*
   * ------------------------------------------------
   * Final result
   * ------------------------------------------------
   */

  return {

    location: {

      name:
        location.name ||
        null,

      distanceKm:
        location.distanceKm ??
        null,

      checkers:
        location.checkers,

      pnp:
        location.pnp,

    },


    complete,


    itemCount:
      items.length,


    matchedCount:
      matchedItems.length,


    unmatchedCount:
      unmatchedItems.length,


    optimized: {

      total:
        Number(
          optimizedTotal.toFixed(2)
        ),

      promotionalSavings:
        Number(
          promotionalSavings
            .toFixed(2)
        ),

      loyaltySavings:
        Number(
          loyaltySavings
            .toFixed(2)
        ),

      storesUsed,

      items:
        optimizedItems,

      allocations: {

        checkers:
          checkersAllocation,

        pnp:
          pnpAllocation,

      },

    },


    singleStoreOptions: {

      /*
       * Retailer-specific options.
       *
       * These may be complete or partial.
       */

      checkers:
        checkersOnly,

      pnp:
        pnpOnly,


      /*
       * Cheapest complete basket.
       *
       * null when neither retailer has
       * every requested item.
       */

      cheapestComplete,


      /*
       * Fair partial comparison.
       */

      partial: {

        checkers:
          checkersPartial,

        pnp:
          pnpPartial,

      },


      cheapestPartial,


      /*
       * Backwards-compatible convenience
       * option.
       *
       * Complete is preferred.
       * Partial is fallback.
       */

      cheapest:
        cheapestSingleStore,

    },


    combinationSavings:
      combinationSavings !==
      null
        ? Number(
            combinationSavings
              .toFixed(2)
          )
        : null,


    unmatchedItems,


    /*
     * Keep raw baskets during development.
     */

    baskets: {

      checkers:
        checkersBasket,

      pnp:
        pnpBasket,

    },

  };
}


module.exports = {

  optimizeShoppingLocation,

  chooseBestItemOption,

  buildRetailerAllocation,

  isUsableResult,

  getSingleStoreOption,

  getComparablePartialOption,

};
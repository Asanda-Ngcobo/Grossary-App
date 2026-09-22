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
   * null = stock unknown, which is currently
   * the case for Checkers.
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
   * Compare UNIT prices.
   *
   * Quantity is identical for both,
   * so unit-price comparison gives
   * the same winner as line-total
   * comparison.
   */
  const checkersPrice =
    Number(
      checkersResult.unitPrice
    );

  const pnpPrice =
    Number(
      pnpResult.unitPrice
    );


  /*
   * Checkers cheaper.
   */
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


  /*
   * PnP cheaper.
   */
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
   * Same price.
   *
   * For now choose Checkers deterministically
   * rather than randomly moving equal-price
   * items between retailers.
   *
   * We'll improve tie handling later so that
   * we minimise the number of stores visited.
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
  };
}


/*
 * ------------------------------------------------
 * Get complete single-store total
 * ------------------------------------------------
 */

function getSingleStoreOption(
  basket,
  store
) {

  /*
   * A single-store option is only valid
   * when that retailer can supply every
   * requested item.
   */
  if (!basket.complete) {
    return {
      retailer:
        basket.retailer,

      storeId:
        store.storeId,

      storeName:
        store.storeName,

      complete:
        false,

      total:
        null,

      promotionalSavings:
        basket
          .promotionalSavings ||
        0,
    };
  }


  return {
    retailer:
      basket.retailer,

    storeId:
      store.storeId,

    storeName:
      store.storeName,

    complete:
      true,

    total:
      basket.total,

    promotionalSavings:
      basket
        .promotionalSavings ||
      0,
  };
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
   */

  /*
   * Keep these sequential for now.
   *
   * Both providers currently have
   * Parse request limits.
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


  /*
   * ------------------------------------------------
   * Single-store alternatives
   * ------------------------------------------------
   */

  const checkersOnly =
    getSingleStoreOption(
      checkersBasket,
      location.checkers
    );


  const pnpOnly =
    getSingleStoreOption(
      pnpBasket,
      location.pnp
    );


  const completeSingleStores =
    [
      checkersOnly,
      pnpOnly,
    ].filter(
      option =>
        option.complete &&
        Number.isFinite(
          Number(
            option.total
          )
        )
    );


  let cheapestSingleStore =
    null;


  if (
    completeSingleStores.length >
    0
  ) {
    cheapestSingleStore =
      completeSingleStores.reduce(
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
   * Combination savings
   * ------------------------------------------------
   *
   * Only calculate this when:
   *
   * 1. optimized basket contains every item
   * 2. at least one retailer can supply the
   *    entire list alone
   */

  const complete =
    unmatchedItems.length ===
    0;


  let combinationSavings =
    null;


  if (
    complete &&
    cheapestSingleStore
  ) {
    combinationSavings =
      Math.max(
        0,

        Number(
          cheapestSingleStore.total
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
      checkers:
        checkersOnly,

      pnp:
        pnpOnly,

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
     *
     * Very useful for debugging matches.
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
};
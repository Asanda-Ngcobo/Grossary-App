/**
 * ------------------------------------------------
 * Grossary Plus Shopping Optimizer
 * ------------------------------------------------
 *
 * Handles:
 *
 * - Standard retailer prices
 * - Standard retailer promotions
 * - Smart Shopper fixed-price promotions
 * - Smart Shopper multi-buy promotions
 * - Quantity-aware promotion calculations
 * - Store combinations within the same mall
 * - Grossary optimization savings
 * - Retailer promotional savings
 *
 *
 * IMPORTANT:
 *
 * Standard promotion:
 *
 * price = actual customer-pay price
 * promotionalSavings = advertised saving per unit
 *
 *
 * Smart Shopper FIXED_PRICE:
 *
 * Normal price = R39.99
 * Smart Shopper = R29.99
 *
 *
 * Smart Shopper MULTIBUY:
 *
 * Normal price = R21.99
 * Promotion = 2 For R32
 *
 * Quantity 1 = R21.99
 * Quantity 2 = R32.00
 * Quantity 3 = R53.99
 * Quantity 4 = R64.00
 *
 *
 * Loyalty promotions are only applied when
 * useLoyaltyPricing is true.
 * ------------------------------------------------
 */


/**
 * ------------------------------------------------
 * Generate combinations
 * ------------------------------------------------
 */

function combinations(
  items,
  size
) {

  const result = [];


  function generate(
    start,
    current
  ) {

    if (
      current.length === size
    ) {

      result.push(
        [...current]
      );

      return;

    }


    for (
      let i = start;
      i < items.length;
      i++
    ) {

      current.push(
        items[i]
      );

      generate(
        i + 1,
        current
      );

      current.pop();

    }

  }


  generate(
    0,
    []
  );


  return result;
}


/**
 * ------------------------------------------------
 * Quantity helper
 * ------------------------------------------------
 */

function getQuantity(
  item
) {

  const quantity =
    Number(
      item?.quantity
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


/**
 * ------------------------------------------------
 * Is promotion currently active?
 * ------------------------------------------------
 *
 * If no dates are available, we trust the
 * normalized provider promotion status.
 *
 * If dates are available, we respect them.
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


  /*
   * Check start date.
   */

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


  /*
   * Check end date.
   */

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


/**
 * ------------------------------------------------
 * Can loyalty pricing be used?
 * ------------------------------------------------
 *
 * For now this is controlled by
 * useLoyaltyPricing.
 *
 * Later we can make this retailer-specific:
 *
 * Smart Shopper -> Pick n Pay
 * Xtra Savings  -> Checkers
 * etc.
 * ------------------------------------------------
 */

function canUseLoyaltyPricing(
  product,
  useLoyaltyPricing
) {

  if (
    !useLoyaltyPricing
  ) {

    return false;

  }


  if (
    !product
      ?.requiresLoyaltyCard
  ) {

    return false;

  }


  if (
    !isPromotionActive(
      product
    )
  ) {

    return false;

  }


  return true;
}


/**
 * ------------------------------------------------
 * Calculate product pricing for requested quantity
 * ------------------------------------------------
 *
 * Returns the ACTUAL amount the customer would
 * pay for this product at this store.
 *
 * This is the key function that makes promotion
 * comparison quantity-aware.
 * ------------------------------------------------
 */

function calculateProductPricing(
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


  const normalTotal =
    Number(
      (
        normalUnitPrice *
        quantity
      ).toFixed(2)
    );


  /*
   * ------------------------------------------------
   * Standard retailer promotional savings
   * ------------------------------------------------
   *
   * product.price already represents what the
   * customer actually pays.
   *
   * promotionalSavings is the retailer-advertised
   * saving PER UNIT.
   * ------------------------------------------------
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
   * If loyalty pricing cannot be used,
   * standard price wins.
   */

  if (
    !canUseLoyaltyPricing(
      product,
      useLoyaltyPricing
    )
  ) {

    return {

      unitPrice:
        normalUnitPrice,

      total:
        normalTotal,

      standardPromotionSavings,

      loyaltySavings:
        0,

      totalPromotionSavings:
        standardPromotionSavings,

      loyaltyApplied:
        false,

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
   * Smart Shopper FIXED_PRICE
   * ------------------------------------------------
   *
   * Example:
   *
   * Normal = R39.99
   * Smart Shopper = R29.99
   *
   * Quantity 2:
   *
   * R29.99 × 2
   * ------------------------------------------------
   */

  if (
    product
      ?.promotionMechanic ===
      "FIXED_PRICE"
  ) {

    const loyaltyUnitPrice =
      Number(
        product.loyaltyPrice
      );


    if (
      Number.isFinite(
        loyaltyUnitPrice
      ) &&
      loyaltyUnitPrice >= 0 &&
      loyaltyUnitPrice <
        normalUnitPrice
    ) {

      const loyaltyTotal =
        Number(
          (
            loyaltyUnitPrice *
            quantity
          ).toFixed(2)
        );


      const loyaltySavings =
        Number(
          (
            normalTotal -
            loyaltyTotal
          ).toFixed(2)
        );


      return {

        unitPrice:
          loyaltyUnitPrice,

        total:
          loyaltyTotal,

        /*
         * Smart Shopper saving is kept
         * separate from standard promotion
         * saving.
         */

        standardPromotionSavings:
          0,

        loyaltySavings,

        totalPromotionSavings:
          loyaltySavings,

        loyaltyApplied:
          true,

        promotionMechanic:
          "FIXED_PRICE",

        promotionQuantity:
          1,

        promotionBundlePrice:
          product
            .promotionBundlePrice ??
          loyaltyUnitPrice,

        qualifyingBundles:
          quantity,

        remainingQuantity:
          0,

      };

    }

  }


  /*
   * ------------------------------------------------
   * Smart Shopper MULTIBUY
   * ------------------------------------------------
   *
   * Example:
   *
   * R21.99 each
   * 2 For R32
   *
   *
   * Quantity 1:
   *
   * 0 bundles
   * 1 normal unit
   * = R21.99
   *
   *
   * Quantity 2:
   *
   * 1 bundle
   * = R32
   *
   *
   * Quantity 3:
   *
   * 1 bundle
   * + 1 normal unit
   * = R53.99
   *
   *
   * Quantity 4:
   *
   * 2 bundles
   * = R64
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


    const bundlePrice =
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
        bundlePrice
      ) &&
      bundlePrice >= 0
    ) {

      const qualifyingBundles =
        Math.floor(
          quantity /
          promotionQuantity
        );


      const remainingQuantity =
        quantity %
        promotionQuantity;


      /*
       * If quantity doesn't qualify for
       * even one bundle, normal pricing
       * applies.
       */

      if (
        qualifyingBundles === 0
      ) {

        return {

          unitPrice:
            normalUnitPrice,

          total:
            normalTotal,

          standardPromotionSavings:
            0,

          loyaltySavings:
            0,

          totalPromotionSavings:
            0,

          loyaltyApplied:
            false,

          promotionMechanic:
            "MULTIBUY",

          promotionQuantity,

          promotionBundlePrice:
            bundlePrice,

          qualifyingBundles:
            0,

          remainingQuantity:
            quantity,

        };

      }


      const bundleTotal =
        qualifyingBundles *
        bundlePrice;


      const remainingTotal =
        remainingQuantity *
        normalUnitPrice;


      const customerTotal =
        Number(
          (
            bundleTotal +
            remainingTotal
          ).toFixed(2)
        );


      const loyaltySavings =
        Math.max(
          0,
          Number(
            (
              normalTotal -
              customerTotal
            ).toFixed(2)
          )
        );


      /*
       * Effective average unit price.
       *
       * This is for display/debugging.
       *
       * The actual calculation uses
       * bundlePrice + remaining normal
       * units above.
       */

      const effectiveUnitPrice =
        quantity > 0
          ? Number(
              (
                customerTotal /
                quantity
              ).toFixed(2)
            )
          : normalUnitPrice;


      return {

        unitPrice:
          effectiveUnitPrice,

        total:
          customerTotal,

        standardPromotionSavings:
          0,

        loyaltySavings,

        totalPromotionSavings:
          loyaltySavings,

        loyaltyApplied:
          true,

        promotionMechanic:
          "MULTIBUY",

        promotionQuantity,

        promotionBundlePrice:
          bundlePrice,

        qualifyingBundles,

        remainingQuantity,

      };

    }

  }


  /*
   * ------------------------------------------------
   * Unknown / unsupported loyalty mechanic
   * ------------------------------------------------
   *
   * Never guess.
   *
   * Fall back to the normal customer-pay price.
   * ------------------------------------------------
   */

  return {

    unitPrice:
      normalUnitPrice,

    total:
      normalTotal,

    standardPromotionSavings,

    loyaltySavings:
      0,

    totalPromotionSavings:
      standardPromotionSavings,

    loyaltyApplied:
      false,

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


/**
 * ------------------------------------------------
 * Calculate cheapest way to buy the entire
 * shopping list from a combination of stores.
 * ------------------------------------------------
 *
 * IMPORTANT:
 *
 * All stores passed to this function must belong
 * to the same mall.
 *
 * We compare TOTAL COST for the requested
 * quantity, not merely unit price.
 *
 * This matters for promotions such as:
 *
 * PnP:
 * R21.99 each
 * 2 For R32
 *
 * versus another store:
 * R18 each
 *
 * For quantity 2:
 *
 * PnP = R32
 * Other store = R36
 *
 * Therefore PnP is actually cheaper even though
 * its normal unit price is higher.
 * ------------------------------------------------
 */

function calculateStoreCombination(
  shoppingList,
  stores,
  {
    useLoyaltyPricing = true,
  } = {}
) {

  const allocations =
    new Map();


  let total =
    0;

  let promotionalSavings =
    0;

  let loyaltySavings =
    0;


  /*
   * Go through every item on the
   * shopping list.
   */

  for (
    const item
    of shoppingList
  ) {

    const quantity =
      getQuantity(
        item
      );


    let cheapestStore =
      null;

    let cheapestStoreProduct =
      null;

    let cheapestPricing =
      null;


    /*
     * Find the store with the cheapest
     * ACTUAL basket price for this quantity.
     */

    for (
      const store
      of stores
    ) {

      const storeProduct =
        store.products.find(
          product =>
            product.productId ===
            item.productId
        );


      if (
        !storeProduct
      ) {

        continue;

      }


      /*
       * Explicit out-of-stock products
       * cannot be selected.
       *
       * null stock remains usable because
       * null means unknown, not unavailable.
       */

      if (
        storeProduct.inStock ===
          false
      ) {

        continue;

      }


      const pricing =
        calculateProductPricing(
          storeProduct,
          quantity,
          {
            useLoyaltyPricing,
          }
        );


      if (
        !pricing
      ) {

        continue;

      }


      if (
        !cheapestPricing ||
        pricing.total <
          cheapestPricing.total
      ) {

        cheapestStore =
          store;

        cheapestStoreProduct =
          storeProduct;

        cheapestPricing =
          pricing;

      }

    }


    /*
     * If no store in this combination has
     * the product, this combination cannot
     * complete the shopping list.
     */

    if (
      !cheapestStore ||
      !cheapestStoreProduct ||
      !cheapestPricing
    ) {

      return null;

    }


    /*
     * Customer-pay total for this item.
     */

    const itemTotal =
      cheapestPricing.total;


    total +=
      itemTotal;


    /*
     * Keep standard promotional savings
     * separate from loyalty savings.
     */

    promotionalSavings +=
      cheapestPricing
        .standardPromotionSavings;


    loyaltySavings +=
      cheapestPricing
        .loyaltySavings;


    /*
     * Create allocation for the store
     * if this is the first item assigned
     * to that store.
     */

    if (
      !allocations.has(
        cheapestStore.storeId
      )
    ) {

      allocations.set(
        cheapestStore.storeId,
        {

          storeId:
            cheapestStore.storeId,

          retailer:
            cheapestStore.retailer,

          branchName:
            cheapestStore.branchName ||
            null,

          mallId:
            cheapestStore.mallId,

          mallName:
            cheapestStore.mallName ||
            null,

          items:
            [],

          total:
            0,

          promotionalSavings:
            0,

          loyaltySavings:
            0,

        }
      );

    }


    const allocation =
      allocations.get(
        cheapestStore.storeId
      );


    /*
     * Add item to store allocation.
     */

    allocation.items.push({

      productId:
        item.productId,

      productName:
        item.productName,

      quantity,


      /*
       * Actual effective price for display.
       *
       * For MULTIBUY this is the average
       * effective unit price for the quantity.
       */

      unitPrice:
        cheapestPricing
          .unitPrice,

      totalPrice:
        itemTotal,


      /*
       * Normal retailer price before
       * loyalty pricing.
       */

      normalUnitPrice:
        Number(
          cheapestStoreProduct
            .price
        ),


      regularPrice:
        cheapestStoreProduct
          .regularPrice != null
          ? Number(
              cheapestStoreProduct
                .regularPrice
            )
          : null,


      /*
       * Standard retailer promotion.
       */

      promotionalSavings:
        cheapestPricing
          .standardPromotionSavings,


      /*
       * Loyalty promotion.
       */

      loyaltySavings:
        cheapestPricing
          .loyaltySavings,

      loyaltyApplied:
        cheapestPricing
          .loyaltyApplied,

      loyaltyPrice:
        cheapestStoreProduct
          .loyaltyPrice != null
          ? Number(
              cheapestStoreProduct
                .loyaltyPrice
            )
          : null,

      requiresLoyaltyCard:
        Boolean(
          cheapestStoreProduct
            .requiresLoyaltyCard
        ),


      /*
       * Promotion mechanics.
       */

      promotionType:
        cheapestStoreProduct
          .promotionType ||
        null,

      promotionMechanic:
        cheapestPricing
          .promotionMechanic,

      promotionQuantity:
        cheapestPricing
          .promotionQuantity,

      promotionBundlePrice:
        cheapestPricing
          .promotionBundlePrice,

      qualifyingBundles:
        cheapestPricing
          .qualifyingBundles,

      remainingQuantity:
        cheapestPricing
          .remainingQuantity,

      promotionMessage:
        cheapestStoreProduct
          .promotionMessage ||
        null,

      promotionStartsAt:
        cheapestStoreProduct
          .promotionStartsAt ||
        null,

      promotionEndsAt:
        cheapestStoreProduct
          .promotionEndsAt ||
        null,

      isPromotion:
        Boolean(
          cheapestStoreProduct
            .isPromotion
        ),

    });


    /*
     * Update store totals.
     */

    allocation.total +=
      itemTotal;


    allocation.promotionalSavings +=
      cheapestPricing
        .standardPromotionSavings;


    allocation.loyaltySavings +=
      cheapestPricing
        .loyaltySavings;

  }


  /*
   * Round totals.
   */

  total =
    Number(
      total.toFixed(2)
    );


  promotionalSavings =
    Number(
      promotionalSavings
        .toFixed(2)
    );


  loyaltySavings =
    Number(
      loyaltySavings
        .toFixed(2)
    );


  for (
    const allocation
    of allocations.values()
  ) {

    allocation.total =
      Number(
        allocation.total
          .toFixed(2)
      );


    allocation.promotionalSavings =
      Number(
        allocation
          .promotionalSavings
          .toFixed(2)
      );


    allocation.loyaltySavings =
      Number(
        allocation
          .loyaltySavings
          .toFixed(2)
      );

  }


  /*
   * Return calculated combination.
   */

  return {

    mallId:
      stores[0].mallId,

    mallName:
      stores[0].mallName ||
      null,

    stores:
      stores.map(
        store => ({

          storeId:
            store.storeId,

          retailer:
            store.retailer,

          branchName:
            store.branchName ||
            null,

        })
      ),

    allocations:
      Array.from(
        allocations.values()
      ),

    total,

    /*
     * Standard retailer promotional
     * savings only.
     */

    promotionalSavings,

    /*
     * Loyalty-card savings only.
     */

    loyaltySavings,

    savings:
      0,

    numberOfStores:
      allocations.size,

  };
}


/**
 * ------------------------------------------------
 * Optimize shopping list inside ONE mall
 * ------------------------------------------------
 */

function optimizeMall(
  shoppingList,
  mallStores,
  maxStores = 3,
  options = {}
) {

  if (
    !mallStores ||
    mallStores.length === 0
  ) {

    return null;

  }


  const results =
    [];


  const maximumStores =
    Math.min(
      maxStores,
      mallStores.length
    );


  /*
   * Try every possible store count:
   *
   * 1 store
   * 2 stores
   * 3 stores
   */

  for (
    let storeCount = 1;
    storeCount <=
      maximumStores;
    storeCount++
  ) {

    const storeCombinations =
      combinations(
        mallStores,
        storeCount
      );


    for (
      const combination
      of storeCombinations
    ) {

      const option =
        calculateStoreCombination(
          shoppingList,
          combination,
          options
        );


      /*
       * Only keep combinations that can
       * fulfil the entire list.
       */

      if (
        option
      ) {

        results.push(
          option
        );

      }

    }

  }


  if (
    results.length === 0
  ) {

    return null;

  }


  /*
   * Find cheapest option in this mall.
   */

  return results.reduce(
    (
      best,
      current
    ) => {

      return (
        current.total <
        best.total
      )
        ? current
        : best;

    }
  );
}


/**
 * ------------------------------------------------
 * Main Grossary Plus optimizer
 * ------------------------------------------------
 *
 * Stores are grouped by mall and each mall
 * is optimized independently.
 *
 *
 * options.useLoyaltyPricing
 *
 * true:
 * Apply qualifying loyalty prices.
 *
 * false:
 * Ignore loyalty prices and use normal
 * customer-pay prices.
 *
 * Later this can become retailer/card-specific
 * instead of one global boolean.
 * ------------------------------------------------
 */

function optimizeShoppingList(
  shoppingList,
  stores,
  maxStores = 3,
  options = {}
) {

  if (
    !shoppingList ||
    shoppingList.length === 0 ||
    !stores ||
    stores.length === 0
  ) {

    return null;

  }


  /*
   * -----------------------------------------
   * 1. Group stores by mall
   * -----------------------------------------
   */

  const storesByMall =
    new Map();


  for (
    const store
    of stores
  ) {

    if (
      !store.mallId
    ) {

      continue;

    }


    if (
      !storesByMall.has(
        store.mallId
      )
    ) {

      storesByMall.set(
        store.mallId,
        []
      );

    }


    storesByMall
      .get(
        store.mallId
      )
      .push(
        store
      );

  }


  /*
   * -----------------------------------------
   * 2. Optimize every mall independently
   * -----------------------------------------
   */

  const mallOptions =
    [];


  for (
    const [
      mallId,
      mallStores,
    ]
    of storesByMall.entries()
  ) {

    const mallOption =
      optimizeMall(
        shoppingList,
        mallStores,
        maxStores,
        options
      );


    if (
      !mallOption
    ) {

      continue;

    }


    mallOptions.push(
      mallOption
    );

  }


  /*
   * No mall can complete the list.
   */

  if (
    mallOptions.length === 0
  ) {

    return null;

  }


  /*
   * -----------------------------------------
   * 3. Find cheapest overall option
   * -----------------------------------------
   */

  const bestOption =
    mallOptions.reduce(
      (
        best,
        current
      ) => {

        return (
          current.total <
          best.total
        )
          ? current
          : best;

      }
    );


  /*
   * -----------------------------------------
   * 4. Find cheapest single-store option
   * -----------------------------------------
   */

  const singleStoreOptions =
    mallOptions.filter(
      option =>
        option.numberOfStores ===
        1
    );


  let cheapestSingleStore =
    null;


  if (
    singleStoreOptions.length >
    0
  ) {

    cheapestSingleStore =
      singleStoreOptions.reduce(
        (
          cheapest,
          current
        ) => {

          return (
            current.total <
            cheapest.total
          )
            ? current
            : cheapest;

        }
      );

  }


  /*
   * -----------------------------------------
   * 5. Calculate Grossary optimization savings
   * -----------------------------------------
   *
   * This is ONLY:
   *
   * cheapest complete one-store option
   *
   * minus
   *
   * Grossary optimized multi-store option.
   *
   *
   * Standard retailer promotional savings
   * and loyalty savings remain separate.
   * -----------------------------------------
   */

  let shoppingOptimizationSavings =
    0;


  if (
    cheapestSingleStore
  ) {

    shoppingOptimizationSavings =
      cheapestSingleStore.total -
      bestOption.total;


    shoppingOptimizationSavings =
      Math.max(
        0,
        Number(
          shoppingOptimizationSavings
            .toFixed(2)
        )
      );

  }


  /*
   * -----------------------------------------
   * 6. Return final result
   * -----------------------------------------
   */

  return {

    /*
     * Best mall
     */

    mallId:
      bestOption.mallId,

    mallName:
      bestOption.mallName,


    /*
     * Actual amount customer pays.
     */

    total:
      Number(
        bestOption.total
          .toFixed(2)
      ),


    /*
     * Grossary multi-store optimization
     * savings.
     */

    savings:
      shoppingOptimizationSavings,


    /*
     * Standard retailer promotions.
     */

    promotionalSavings:
      Number(
        bestOption
          .promotionalSavings
          .toFixed(2)
      ),


    /*
     * Loyalty-card promotions.
     *
     * Kept separate so we don't
     * double-count savings.
     */

    loyaltySavings:
      Number(
        bestOption
          .loyaltySavings
          .toFixed(2)
      ),


    /*
     * Total stores actually used.
     */

    numberOfStores:
      bestOption
        .numberOfStores,


    /*
     * Store allocations.
     */

    allocations:
      bestOption
        .allocations,


    /*
     * Cheapest one-store alternative.
     */

    cheapestSingleStore:
      cheapestSingleStore
        ? {

            total:
              Number(
                cheapestSingleStore
                  .total
                  .toFixed(2)
              ),

            retailer:
              cheapestSingleStore
                .stores[0]
                .retailer,

            mallId:
              cheapestSingleStore
                .mallId,

            mallName:
              cheapestSingleStore
                .mallName,

            promotionalSavings:
              Number(
                cheapestSingleStore
                  .promotionalSavings
                  .toFixed(2)
              ),

            loyaltySavings:
              Number(
                cheapestSingleStore
                  .loyaltySavings
                  .toFixed(2)
              ),

          }
        : null,


    /*
     * All viable mall options.
     */

    mallOptions:
      mallOptions.map(
        option => ({

          mallId:
            option.mallId,

          mallName:
            option.mallName,

          total:
            Number(
              option.total
                .toFixed(2)
            ),

          promotionalSavings:
            Number(
              option
                .promotionalSavings
                .toFixed(2)
            ),

          loyaltySavings:
            Number(
              option
                .loyaltySavings
                .toFixed(2)
            ),

          numberOfStores:
            option.numberOfStores,

          allocations:
            option.allocations,

        })
      ),

  };
}


/*
 * ------------------------------------------------
 * Exports
 * ------------------------------------------------
 */

module.exports = {

  optimizeShoppingList,

  /*
   * Exported so we can test promotion maths
   * independently if needed.
   */

  calculateProductPricing,

};
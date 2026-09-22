/**
 * Generate all combinations of a given size.
 */
function combinations(items, size) {
  const result = [];

  function generate(start, current) {
    if (current.length === size) {
      result.push([...current]);
      return;
    }

    for (let i = start; i < items.length; i++) {
      current.push(items[i]);
      generate(i + 1, current);
      current.pop();
    }
  }

  generate(0, []);

  return result;
}


/**
 * Calculate the cheapest way to buy the entire
 * shopping list from a combination of stores.
 *
 * IMPORTANT:
 * All stores passed to this function must belong
 * to the same mall.
 */
function calculateStoreCombination(
  shoppingList,
  stores
) {
  const allocations = new Map();

  let total = 0;
  let promotionalSavings = 0;

  /*
   * Go through every item on the shopping list.
   */
  for (const item of shoppingList) {
    let cheapestStore = null;
    let cheapestStoreProduct = null;
    let cheapestPrice = Infinity;

    /*
     * Find the store with the cheapest actual
     * selling price for this product.
     */
    for (const store of stores) {
      const storeProduct =
        store.products.find(
          (product) =>
            product.productId ===
            item.productId
        );

      if (!storeProduct) {
        continue;
      }

      if (
        Number(storeProduct.price) <
        cheapestPrice
      ) {
        cheapestPrice =
          Number(storeProduct.price);

        cheapestStore = store;

        cheapestStoreProduct =
          storeProduct;
      }
    }

    /*
     * If no store in this combination has
     * the product, this combination cannot
     * complete the shopping list.
     */
    if (
      !cheapestStore ||
      !cheapestStoreProduct
    ) {
      return null;
    }

    /*
     * Make sure quantity is at least 1.
     */
    const quantity =
      Number(item.quantity) > 0
        ? Number(item.quantity)
        : 1;

    /*
     * Calculate what the customer actually pays.
     */
    const itemTotal =
      cheapestPrice * quantity;

    total += itemTotal;

    /*
     * Calculate promotion savings.
     *
     * promotionalSavings is assumed to be
     * the saving PER UNIT.
     *
     * Example:
     * Regular price = R130
     * Sale price    = R120
     * Saving        = R10
     *
     * Quantity 2 = R20 total saving.
     */
    const itemPromotionalSavings =
      Number(
        cheapestStoreProduct
          .promotionalSavings
      ) || 0;

    const totalItemPromotionSavings =
      itemPromotionalSavings *
      quantity;

    promotionalSavings +=
      totalItemPromotionSavings;

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

          items: [],

          total: 0,

          promotionalSavings: 0,
        }
      );
    }

    const allocation =
      allocations.get(
        cheapestStore.storeId
      );

    /*
     * Add the item to the store.
     */
    allocation.items.push({
      productId:
        item.productId,

      productName:
        item.productName,

      quantity,

      unitPrice:
        cheapestPrice,

      totalPrice:
        itemTotal,

      regularPrice:
        cheapestStoreProduct
          .regularPrice != null
          ? Number(
              cheapestStoreProduct
                .regularPrice
            )
          : null,

      promotionalSavings:
        totalItemPromotionSavings,

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
      totalItemPromotionSavings;
  }

  /*
   * Return the calculated combination.
   */
  return {
    mallId:
      stores[0].mallId,

    mallName:
      stores[0].mallName ||
      null,

    stores: stores.map(
      (store) => ({
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

    promotionalSavings,

    savings: 0,

    numberOfStores:
      allocations.size,
  };
}


/**
 * Optimize shopping list inside ONE mall.
 *
 * Maximum number of stores is controlled
 * by maxStores.
 */
function optimizeMall(
  shoppingList,
  mallStores,
  maxStores = 3
) {
  if (
    !mallStores ||
    mallStores.length === 0
  ) {
    return null;
  }

  const options = [];

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
    storeCount <= maximumStores;
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
          combination
        );

      /*
       * Only keep combinations that
       * can fulfil the entire list.
       */
      if (option) {
        options.push(option);
      }
    }
  }

  /*
   * No valid combination.
   */
  if (options.length === 0) {
    return null;
  }

  /*
   * Find the cheapest option in this mall.
   */
  const bestOption =
    options.reduce(
      (best, current) => {
        return current.total <
          best.total
          ? current
          : best;
      }
    );

  return bestOption;
}


/**
 * Main Grossary Plus optimizer.
 *
 * Stores are grouped by mall and each mall
 * is optimized independently.
 */
function optimizeShoppingList(
  shoppingList,
  stores,
  maxStores = 3
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

  for (const store of stores) {
    if (!store.mallId) {
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
      .get(store.mallId)
      .push(store);
  }

  /*
   * -----------------------------------------
   * 2. Optimize every mall independently
   * -----------------------------------------
   */

  const mallOptions = [];

  for (
    const [
      mallId,
      mallStores
    ]
    of storesByMall.entries()
  ) {
    const mallOption =
      optimizeMall(
        shoppingList,
        mallStores,
        maxStores
      );

    if (!mallOption) {
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
      (best, current) => {
        return current.total <
          best.total
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
      (option) =>
        option.numberOfStores ===
        1
    );

  let cheapestSingleStore =
    null;

  if (
    singleStoreOptions.length > 0
  ) {
    cheapestSingleStore =
      singleStoreOptions.reduce(
        (cheapest, current) => {
          return current.total <
            cheapest.total
            ? current
            : cheapest;
        }
      );
  }

  /*
   * -----------------------------------------
   * 5. Calculate Grossary Plus savings
   * -----------------------------------------
   *
   * This is the difference between:
   *
   * Cheapest one-store option
   *
   * and
   *
   * Grossary Plus optimized option.
   *
   * Promotional savings are kept separate.
   */

  let shoppingOptimizationSavings = 0;

  if (cheapestSingleStore) {
    shoppingOptimizationSavings =
      cheapestSingleStore.total -
      bestOption.total;

    /*
     * Protect against floating point
     * precision issues.
     */
    shoppingOptimizationSavings =
      Math.max(
        0,
        Number(
          shoppingOptimizationSavings.toFixed(
            2
          )
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
     * Best mall.
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
        bestOption.total.toFixed(2)
      ),

    /*
     * Savings achieved by using
     * Grossary's multi-store optimization.
     */
    savings:
      shoppingOptimizationSavings,

    /*
     * Savings from retailer promotions.
     */
    promotionalSavings:
      Number(
        bestOption.promotionalSavings.toFixed(
          2
        )
      ),

    /*
     * Total number of stores.
     */
    numberOfStores:
      bestOption.numberOfStores,

    /*
     * Store allocations.
     */
    allocations:
      bestOption.allocations,

    /*
     * Cheapest one-store alternative.
     */
    cheapestSingleStore:
      cheapestSingleStore
        ? {
            total:
              Number(
                cheapestSingleStore.total.toFixed(
                  2
                )
              ),

            retailer:
              cheapestSingleStore
                .stores[0]
                .retailer,

            mallId:
              cheapestSingleStore.mallId,

            mallName:
              cheapestSingleStore.mallName,
          }
        : null,

    /*
     * All viable mall options.
     */
    mallOptions:
      mallOptions.map(
        (option) => ({
          mallId:
            option.mallId,

          mallName:
            option.mallName,

          total:
            Number(
              option.total.toFixed(2)
            ),

          promotionalSavings:
            Number(
              option.promotionalSavings.toFixed(
                2
              )
            ),

          numberOfStores:
            option.numberOfStores,

          allocations:
            option.allocations,
        })
      ),
  };
}


module.exports = {
  optimizeShoppingList,
};
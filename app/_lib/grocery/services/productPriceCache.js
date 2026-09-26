const {
  createClient,
} = require(
  "@supabase/supabase-js"
);


const supabase =
  createClient(
    process.env
      .NEXT_PUBLIC_SUPABASE_URL,

    process.env
      .SUPABASE_SERVICE_ROLE_KEY
  );


/*
 * ------------------------------------------------
 * South African date range
 * ------------------------------------------------
 *
 * South Africa is UTC+2 and does not
 * currently use daylight saving time.
 *
 * This gives us the UTC boundaries for
 * today's South African calendar date.
 * ------------------------------------------------
 */

function getSouthAfricaTodayRange() {

  const now =
    new Date();


  const SOUTH_AFRICA_OFFSET_MS =
    2 * 60 * 60 * 1000;


  const zaNow =
    new Date(
      now.getTime() +
      SOUTH_AFRICA_OFFSET_MS
    );


  const year =
    zaNow.getUTCFullYear();

  const month =
    zaNow.getUTCMonth();

  const day =
    zaNow.getUTCDate();


  /*
   * Midnight South Africa = 22:00 UTC
   * on the previous UTC calendar day.
   */

  const start =
    new Date(
      Date.UTC(
        year,
        month,
        day,
        -2,
        0,
        0,
        0
      )
    );


  const end =
    new Date(
      start.getTime() +
      24 * 60 * 60 * 1000
    );


  return {

    start:
      start.toISOString(),

    end:
      end.toISOString(),

  };
}


/*
 * ------------------------------------------------
 * Stable cache key
 * ------------------------------------------------
 */

function createCacheKey(
  product
) {

  const raw =
    product.raw || {};


  const providerProductId =
    product.providerProductId ||
    raw.id ||
    raw.productId ||
    raw.articleNumber ||
    raw.sku ||
    null;


  if (
    providerProductId
  ) {

    return `id:${String(
      providerProductId
    )}`;

  }


  const barcode =
    product.barcode ||
    product.barcodes?.[0] ||
    raw.barcode ||
    raw.barcodes?.[0] ||
    null;


  if (
    barcode
  ) {

    return `barcode:${String(
      barcode
    )}`;

  }


  /*
   * Last-resort key.
   */

  return `name:${String(
    product.productName || ""
  )
    .trim()
    .toLowerCase()}`;
}


/*
 * ------------------------------------------------
 * Is promotion still active?
 * ------------------------------------------------
 *
 * If the retailer has explicitly told us
 * that a promotion remains valid until a
 * future date, we can continue using the
 * cached promotional pricing instead of
 * spending another Parse request merely
 * because the product was not refreshed
 * today.
 *
 * We also respect promotion_starts_at when
 * it is available.
 * ------------------------------------------------
 */

function hasActiveCachedPromotion(
  row,
  now = new Date()
) {

  if (
    row?.is_promotion !== true
  ) {

    return false;

  }


  if (
    !row?.promotion_ends_at
  ) {

    return false;

  }


  const promotionEnd =
    new Date(
      row.promotion_ends_at
    );


  if (
    Number.isNaN(
      promotionEnd.getTime()
    )
  ) {

    return false;

  }


  /*
   * Promotion has expired.
   */

  if (
    promotionEnd.getTime() <=
    now.getTime()
  ) {

    return false;

  }


  /*
   * If PnP gave us a start date,
   * make sure the promotion has
   * actually started.
   */

  if (
    row?.promotion_starts_at
  ) {

    const promotionStart =
      new Date(
        row.promotion_starts_at
      );


    if (
      !Number.isNaN(
        promotionStart.getTime()
      ) &&
      promotionStart.getTime() >
      now.getTime()
    ) {

      return false;

    }

  }


  return true;
}


/*
 * ------------------------------------------------
 * Convert database row back into normalized
 * product format expected by matchProduct()
 * ------------------------------------------------
 */

function cacheRowToProduct(
  row
) {

  return {

    /*
     * --------------------------------------------
     * IDs
     * --------------------------------------------
     */

    providerProductId:
      row.provider_product_id,

    providerStoreId:
      row.provider_store_id,


    /*
     * --------------------------------------------
     * Product
     * --------------------------------------------
     */

    productName:
      row.product_name,

    brand:
      row.brand,

    barcode:
      row.barcode,

    barcodes:
      Array.isArray(
        row.barcodes
      )
        ? row.barcodes
        : [],


    /*
     * --------------------------------------------
     * Standard pricing
     * --------------------------------------------
     */

    price:
      row.price === null
        ? null
        : Number(
            row.price
          ),

    regularPrice:
      row.regular_price === null
        ? null
        : Number(
            row.regular_price
          ),

    promotionalSavings:
      Number(
        row.promotional_savings ||
        0
      ),

    isPromotion:
      Boolean(
        row.is_promotion
      ),


    /*
     * --------------------------------------------
     * Loyalty pricing
     * --------------------------------------------
     */

    loyaltyPrice:
      row.loyalty_price === null
        ? null
        : Number(
            row.loyalty_price
          ),

    loyaltySavings:
      Number(
        row.loyalty_savings ||
        0
      ),

    requiresLoyaltyCard:
      Boolean(
        row.requires_loyalty_card
      ),


    /*
     * --------------------------------------------
     * Promotion pricing mechanic
     * --------------------------------------------
     *
     * Examples:
     *
     * FIXED_PRICE
     *
     * R39.99 normal
     * Smart Shopper R29.99
     *
     *
     * MULTIBUY
     *
     * R21.99 normal
     * 2 For R32
     *
     * promotionQuantity = 2
     * promotionBundlePrice = 32
     * loyaltyPrice = 16 effective/unit
     *
     * --------------------------------------------
     */

    promotionMechanic:
      row.promotion_mechanic,

    promotionQuantity:
      row.promotion_quantity === null
        ? null
        : Number(
            row.promotion_quantity
          ),

    promotionBundlePrice:
      row.promotion_bundle_price === null
        ? null
        : Number(
            row.promotion_bundle_price
          ),


    /*
     * --------------------------------------------
     * Promotion metadata
     * --------------------------------------------
     */

    promotionType:
      row.promotion_type,

    promotionCode:
      row.promotion_code,

    promotionMessage:
      row.promotion_message,

    promotionStartsAt:
      row.promotion_starts_at,

    promotionEndsAt:
      row.promotion_ends_at,

    promotions:
      Array.isArray(
        row.promotions
      )
        ? row.promotions
        : [],


    /*
     * --------------------------------------------
     * Stock
     * --------------------------------------------
     */

    inStock:
      row.in_stock,

    stockOnHand:
      row.stock_on_hand === null
        ? null
        : Number(
            row.stock_on_hand
          ),


    /*
     * --------------------------------------------
     * Other
     * --------------------------------------------
     */

    unitOfMeasure:
      row.unit_of_measure,

    imageUrl:
      row.image_url,

    source:
      row.source,

    raw:
      row.raw,


    /*
     * Useful for debugging.
     */

    fromCache:
      true,

    lastUpdated:
      row.last_updated,

  };
}


/*
 * ------------------------------------------------
 * Get usable cached products for one branch
 * ------------------------------------------------
 *
 * A cached product is usable when:
 *
 * 1. It was refreshed today
 *
 * OR
 *
 * 2. It has a known promotion that is still
 *    within its advertised promotion period.
 *
 *
 * Example:
 *
 * Spekko:
 *
 * Smart Shopper R29.99
 * Promotion ends 6 October
 *
 * If cached on 25 September, Grossary can
 * continue using that known promotional
 * price until the promotion expires instead
 * of calling Parse every day.
 *
 *
 * The same applies to MULTIBUY promotions:
 *
 * Coca-Cola:
 *
 * 2 For R32
 * Promotion ends 6 October
 *
 * Grossary preserves:
 *
 * promotionQuantity
 * promotionBundlePrice
 * promotionEndsAt
 *
 * ------------------------------------------------
 */

async function getFreshCachedProducts({
  retailer,
  storeId,
}) {

  if (
    !retailer
  ) {

    throw new Error(
      "Cache retailer is required."
    );

  }


  if (
    !storeId
  ) {

    throw new Error(
      "Cache storeId is required."
    );

  }


  const {
    start,
    end,
  } =
    getSouthAfricaTodayRange();


  /*
   * ------------------------------------------------
   * Get today's cache
   * ------------------------------------------------
   */

  const {
    data: todayData,
    error: todayError,
  } =
    await supabase
      .from(
        "grocery_product_cache"
      )
      .select("*")
      .eq(
        "retailer",
        retailer
      )
      .eq(
        "provider_store_id",
        String(storeId)
      )
      .gte(
        "last_updated",
        start
      )
      .lt(
        "last_updated",
        end
      );


  if (
    todayError
  ) {

    console.error(
      "Today's cache lookup error:",
      todayError
    );


    throw todayError;

  }


  /*
   * ------------------------------------------------
   * Get older promotions that have NOT expired
   * ------------------------------------------------
   *
   * These products may have been cached yesterday
   * or several days ago.
   *
   * However, if the retailer explicitly says the
   * promotion is still active, we can continue
   * using its promotional pricing.
   * ------------------------------------------------
   */

  const now =
    new Date();


  const {
    data: promotionData,
    error: promotionError,
  } =
    await supabase
      .from(
        "grocery_product_cache"
      )
      .select("*")
      .eq(
        "retailer",
        retailer
      )
      .eq(
        "provider_store_id",
        String(storeId)
      )
      .eq(
        "is_promotion",
        true
      )
      .lt(
        "last_updated",
        start
      )
      .gt(
        "promotion_ends_at",
        now.toISOString()
      );


  if (
    promotionError
  ) {

    console.error(
      "Active promotion cache lookup error:",
      promotionError
    );


    throw promotionError;

  }


  /*
   * ------------------------------------------------
   * Combine results
   * ------------------------------------------------
   */

  const combined =
    [
      ...(todayData || []),
      ...(promotionData || []),
    ];


  /*
   * ------------------------------------------------
   * Deduplicate
   * ------------------------------------------------
   *
   * The database unique constraint already
   * prevents duplicate cache keys for the same
   * retailer/store.
   *
   * This Map also protects us from overlapping
   * query results.
   * ------------------------------------------------
   */

  const uniqueRows =
    new Map();


  for (
    const row
    of combined
  ) {

    /*
     * Determine whether the product was
     * refreshed during today's South African
     * calendar date.
     */

    const lastUpdated =
      new Date(
        row.last_updated
      );


    const isFromToday =
      !Number.isNaN(
        lastUpdated.getTime()
      ) &&
      lastUpdated.getTime() >=
        new Date(start).getTime() &&
      lastUpdated.getTime() <
        new Date(end).getTime();


    /*
     * Old rows are only allowed through
     * when the retailer-supplied promotion
     * is still active.
     */

    if (
      !isFromToday &&
      !hasActiveCachedPromotion(
        row,
        now
      )
    ) {

      continue;

    }


    uniqueRows.set(
      row.cache_key,
      row
    );

  }


  return Array.from(
    uniqueRows.values()
  ).map(
    cacheRowToProduct
  );
}


/*
 * ------------------------------------------------
 * Save products returned from Parse
 * ------------------------------------------------
 */

async function saveProductsToCache({
  retailer,
  storeId,
  products,
}) {

  if (
    !Array.isArray(
      products
    ) ||
    products.length === 0
  ) {

    return [];

  }


  const now =
    new Date()
      .toISOString();


  const rows =
    products
      .filter(
        product =>
          product &&
          product.productName
      )
      .map(
        product => {

          const raw =
            product.raw ||
            {};


          const providerProductId =
            product.providerProductId ||
            raw.id ||
            raw.productId ||
            raw.articleNumber ||
            raw.sku ||
            null;


          const barcodes =
            Array.isArray(
              product.barcodes
            )
              ? product.barcodes
              : [];


          const barcode =
            product.barcode ||
            barcodes[0] ||
            null;


          return {

            /*
             * --------------------------------------
             * Provider / cache identity
             * --------------------------------------
             */

            retailer,

            provider_store_id:
              String(
                storeId
              ),

            cache_key:
              createCacheKey(
                product
              ),

            provider_product_id:
              providerProductId
                ? String(
                    providerProductId
                  )
                : null,


            /*
             * --------------------------------------
             * Product
             * --------------------------------------
             */

            product_name:
              product.productName,

            brand:
              product.brand ||
              null,

            barcode:
              barcode
                ? String(
                    barcode
                  )
                : null,

            barcodes,


            /*
             * --------------------------------------
             * Standard pricing
             * --------------------------------------
             */

            price:
              product.price ??
              null,

            regular_price:
              product.regularPrice ??
              null,

            promotional_savings:
              product
                .promotionalSavings ??
              0,

            is_promotion:
              product.isPromotion ??
              false,


            /*
             * --------------------------------------
             * Loyalty pricing
             * --------------------------------------
             */

            loyalty_price:
              product.loyaltyPrice ??
              null,

            loyalty_savings:
              product.loyaltySavings ??
              0,

            requires_loyalty_card:
              product
                .requiresLoyaltyCard ??
              false,


            /*
             * --------------------------------------
             * Promotion pricing mechanic
             * --------------------------------------
             *
             * FIXED_PRICE example:
             *
             * promotion_mechanic:
             * "FIXED_PRICE"
             *
             * promotion_quantity:
             * 1
             *
             * promotion_bundle_price:
             * 29.99
             *
             *
             * MULTIBUY example:
             *
             * promotion_mechanic:
             * "MULTIBUY"
             *
             * promotion_quantity:
             * 2
             *
             * promotion_bundle_price:
             * 32
             *
             * --------------------------------------
             */

            promotion_mechanic:
              product
                .promotionMechanic ||
              null,

            promotion_quantity:
              product
                .promotionQuantity ??
              null,

            promotion_bundle_price:
              product
                .promotionBundlePrice ??
              null,


            /*
             * --------------------------------------
             * Promotion metadata
             * --------------------------------------
             */

            promotion_type:
              product
                .promotionType ||
              null,

            promotion_code:
              product
                .promotionCode ||
              null,

            promotion_message:
              product
                .promotionMessage ||
              null,

            promotion_starts_at:
              product
                .promotionStartsAt ||
              null,

            promotion_ends_at:
              product
                .promotionEndsAt ||
              null,

            promotions:
              Array.isArray(
                product.promotions
              )
                ? product.promotions
                : [],


            /*
             * --------------------------------------
             * Stock
             * --------------------------------------
             */

            in_stock:
              product.inStock ??
              null,

            stock_on_hand:
              product.stockOnHand ??
              null,


            /*
             * --------------------------------------
             * Other
             * --------------------------------------
             */

            unit_of_measure:
              product
                .unitOfMeasure ||
              null,

            image_url:
              product.imageUrl ||
              null,

            source:
              product.source ||
              null,


            /*
             * Always preserve the complete
             * normalized provider payload.
             *
             * This will be useful when we
             * encounter additional promotion
             * mechanics later.
             */

            raw,

            last_updated:
              now,

          };

        }
      );


  /*
   * ------------------------------------------------
   * Upsert
   * ------------------------------------------------
   *
   * One cached product per:
   *
   * retailer
   * + branch
   * + product cache key
   *
   * ------------------------------------------------
   */

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "grocery_product_cache"
      )
      .upsert(
        rows,
        {
          onConflict:
            "retailer,provider_store_id,cache_key",
        }
      )
      .select();


  if (
    error
  ) {

    console.error(
      "Cache save error:",
      error
    );


    throw error;

  }


  return data || [];
}


/*
 * ------------------------------------------------
 * Exports
 * ------------------------------------------------
 */

module.exports = {

  getSouthAfricaTodayRange,

  getFreshCachedProducts,

  saveProductsToCache,

  createCacheKey,

  cacheRowToProduct,

  hasActiveCachedPromotion,

};
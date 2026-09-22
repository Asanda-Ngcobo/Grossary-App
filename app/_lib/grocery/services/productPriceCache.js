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
 * South Africa is UTC+2 and does not
 * currently use daylight saving time.
 *
 * This gives us the UTC boundaries for
 * today's South African calendar date.
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


  if (providerProductId) {

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


  if (barcode) {

    return `barcode:${String(
      barcode
    )}`;

  }


  /*
   * Last-resort key.
   *
   * Useful where the provider does not
   * expose a stable product ID.
   */
  return `name:${String(
    product.productName || ""
  )
    .trim()
    .toLowerCase()}`;
}


/*
 * ------------------------------------------------
 * Convert database row back into the normalized
 * format expected by matchProduct()
 * ------------------------------------------------
 */

function cacheRowToProduct(
  row
) {

  return {

    providerProductId:
      row.provider_product_id,

    providerStoreId:
      row.provider_store_id,

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

    inStock:
      row.in_stock,

    stockOnHand:
      row.stock_on_hand === null
        ? null
        : Number(
            row.stock_on_hand
          ),

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
 * Get only TODAY'S products for one branch
 * ------------------------------------------------
 */

async function getFreshCachedProducts({
  retailer,
  storeId,
}) {

  if (!retailer) {
    throw new Error(
      "Cache retailer is required."
    );
  }


  if (!storeId) {
    throw new Error(
      "Cache storeId is required."
    );
  }


  const {
    start,
    end,
  } =
    getSouthAfricaTodayRange();


  const {
    data,
    error,
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


  if (error) {

    console.error(
      "Cache lookup error:",
      error
    );


    throw error;

  }


  return (
    data || []
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
    !Array.isArray(products) ||
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

            retailer,

            provider_store_id:
              String(storeId),

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

            in_stock:
              product.inStock ??
              null,

            stock_on_hand:
              product.stockOnHand ??
              null,

            unit_of_measure:
              product.unitOfMeasure ||
              null,

            image_url:
              product.imageUrl ||
              null,

            source:
              product.source ||
              null,

            raw,

            last_updated:
              now,
          };

        }
      );


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


  if (error) {

    console.error(
      "Cache save error:",
      error
    );


    throw error;

  }


  return data || [];
}


module.exports = {
  getSouthAfricaTodayRange,
  getFreshCachedProducts,
  saveProductsToCache,
  createCacheKey,
};
const {
  createClient,
} = require(
  "@supabase/supabase-js"
);

const {
  calculateDistanceKm,
} = require(
  "../utils/distance"
);


/*
 * ------------------------------------------------
 * Supabase service client
 * ------------------------------------------------
 *
 * Server-side only.
 *
 * Never expose SUPABASE_SERVICE_ROLE_KEY
 * to the browser.
 */

const supabase =
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );


/*
 * ------------------------------------------------
 * Store cache duration
 * ------------------------------------------------
 *
 * Retail branches rarely move.
 *
 * Store information is considered fresh
 * for 365 days.
 */

const STORE_CACHE_DURATION_DAYS =
  365;


/*
 * ------------------------------------------------
 * Default nearby-store radius
 * ------------------------------------------------
 */

const DEFAULT_STORE_RADIUS_KM =
  15;


/*
 * ------------------------------------------------
 * Check whether cached store is fresh
 * ------------------------------------------------
 */

function isStoreCacheFresh(
  lastUpdated,
  maxAgeDays =
    STORE_CACHE_DURATION_DAYS
) {

  if (!lastUpdated) {
    return false;
  }


  const updated =
    new Date(
      lastUpdated
    );


  if (
    Number.isNaN(
      updated.getTime()
    )
  ) {

    return false;
  }


  const now =
    new Date();


  const maxAgeMs =
    maxAgeDays *
    24 *
    60 *
    60 *
    1000;


  const ageMs =
    now.getTime() -
    updated.getTime();


  return (
    ageMs >= 0 &&
    ageMs <= maxAgeMs
  );
}


/*
 * ------------------------------------------------
 * Convert Supabase row to Grossary store
 * ------------------------------------------------
 */

function cacheRowToStore(
  store
) {

  return {

    retailer:
      store.retailer,

    providerStoreId:
      store.provider_store_id,

    storeName:
      store.store_name,

    storeType:
      store.store_type,

    address: {

      street:
        store.street,

      suburb:
        store.suburb,

      city:
        store.city,

      postalCode:
        store.postal_code,
    },

    latitude:
      store.latitude !== null &&
      store.latitude !== undefined
        ? Number(
            store.latitude
          )
        : null,

    longitude:
      store.longitude !== null &&
      store.longitude !== undefined
        ? Number(
            store.longitude
          )
        : null,

    source:
      store.source,

    lastUpdated:
      store.last_updated,
  };
}


/*
 * ------------------------------------------------
 * Get all cached stores for retailer
 * ------------------------------------------------
 *
 * No freshness filtering.
 * No location filtering.
 */

async function getCachedStores({
  retailer,
} = {}) {

  if (!retailer) {

    throw new Error(
      "Retailer is required."
    );

  }


  const {
    data,
    error,
  } =
    await supabase
      .from("stores")
      .select("*")
      .eq(
        "retailer",
        retailer
      );


  if (error) {

    throw new Error(
      `Could not load cached stores: ${error.message}`
    );

  }


  return (
    data || []
  ).map(
    cacheRowToStore
  );
}


/*
 * ------------------------------------------------
 * Get fresh cached stores
 * ------------------------------------------------
 *
 * Freshness only.
 *
 * Default:
 * 365 days.
 */

async function getFreshCachedStores({
  retailer,
  maxAgeDays =
    STORE_CACHE_DURATION_DAYS,
} = {}) {

  const stores =
    await getCachedStores({
      retailer,
    });


  return stores.filter(
    store =>
      isStoreCacheFresh(
        store.lastUpdated,
        maxAgeDays
      )
  );
}


/*
 * ------------------------------------------------
 * Add distance from user
 * ------------------------------------------------
 */

function addStoreDistanceFromUser(
  store,
  latitude,
  longitude
) {

  const storeLatitude =
    Number(
      store.latitude
    );


  const storeLongitude =
    Number(
      store.longitude
    );


  if (
    !Number.isFinite(
      storeLatitude
    ) ||
    !Number.isFinite(
      storeLongitude
    )
  ) {

    return {
      ...store,

      distanceFromUser:
        Infinity,
    };

  }


  const distanceFromUser =
    calculateDistanceKm(
      latitude,
      longitude,
      storeLatitude,
      storeLongitude
    );


  return {
    ...store,

    distanceFromUser,
  };
}


/*
 * ------------------------------------------------
 * Get fresh nearby stores
 * ------------------------------------------------
 *
 * This is the main function Grossary Plus
 * should use for store cache lookup.
 *
 * Example:
 *
 * getFreshCachedStoresNearby({
 *   retailer: "Checkers",
 *   latitude: -29.85,
 *   longitude: 31.01,
 *   maxDistanceKm: 15
 * })
 */

async function getFreshCachedStoresNearby({
  retailer,
  latitude,
  longitude,
  maxDistanceKm =
    DEFAULT_STORE_RADIUS_KM,
  maxAgeDays =
    STORE_CACHE_DURATION_DAYS,
} = {}) {

  if (!retailer) {

    throw new Error(
      "Retailer is required."
    );

  }


  latitude =
    Number(
      latitude
    );


  longitude =
    Number(
      longitude
    );


  maxDistanceKm =
    Number(
      maxDistanceKm
    );


  if (
    !Number.isFinite(
      latitude
    ) ||
    !Number.isFinite(
      longitude
    )
  ) {

    throw new Error(
      "Valid latitude and longitude are required."
    );

  }


  if (
    !Number.isFinite(
      maxDistanceKm
    ) ||
    maxDistanceKm <= 0
  ) {

    throw new Error(
      "maxDistanceKm must be greater than 0."
    );

  }


  /*
   * First remove stale stores.
   */
  const freshStores =
    await getFreshCachedStores({
      retailer,
      maxAgeDays,
    });


  /*
   * Then calculate actual geographical
   * distance from the user.
   */
  return freshStores
    .map(
      store =>
        addStoreDistanceFromUser(
          store,
          latitude,
          longitude
        )
    )
    .filter(
      store =>
        Number.isFinite(
          store.distanceFromUser
        ) &&
        store.distanceFromUser <=
          maxDistanceKm
    )
    .sort(
      (a, b) =>
        a.distanceFromUser -
        b.distanceFromUser
    );
}


/*
 * ------------------------------------------------
 * Save / update stores
 * ------------------------------------------------
 */

async function saveStoresToCache({
  retailer,
  stores,
} = {}) {

  if (!retailer) {

    throw new Error(
      "Retailer is required."
    );

  }


  if (
    !Array.isArray(
      stores
    ) ||
    stores.length === 0
  ) {

    return [];
  }


  const now =
    new Date()
      .toISOString();


  const rows =
    stores
      .filter(
        store =>
          store.providerStoreId !==
            null &&
          store.providerStoreId !==
            undefined &&
          store.providerStoreId !==
            ""
      )
      .map(
        store => {

          const address =
            store.address ||
            {};


          const latitude =
            Number(
              store.latitude
            );


          const longitude =
            Number(
              store.longitude
            );


          return {

            retailer,

            provider_store_id:
              String(
                store.providerStoreId
              ),

            store_name:
              store.storeName ||
              null,

            store_type:
              store.storeType ||
              null,

            street:
              address.street ||
              store.street ||
              null,

            suburb:
              address.suburb ||
              store.suburb ||
              null,

            city:
              address.city ||
              store.city ||
              null,

            postal_code:
              address.postalCode ||
              store.postalCode ||
              null,

            latitude:
              Number.isFinite(
                latitude
              )
                ? latitude
                : null,

            longitude:
              Number.isFinite(
                longitude
              )
                ? longitude
                : null,

            source:
              store.source ||
              "parse",

            /*
             * Successful refresh resets
             * the 365-day lifetime.
             */
            last_updated:
              now,
          };
        }
      );


  if (
    rows.length === 0
  ) {

    return [];
  }


  const {
    data,
    error,
  } =
    await supabase
      .from("stores")
      .upsert(
        rows,
        {
          onConflict:
            "retailer,provider_store_id",
        }
      )
      .select();


  if (error) {

    throw new Error(
      `Could not save stores to cache: ${error.message}`
    );

  }


  return (
    data || []
  ).map(
    cacheRowToStore
  );
}


/*
 * ------------------------------------------------
 * Store cache statistics
 * ------------------------------------------------
 */

async function getStoreCacheStats({
  retailer,
  latitude = null,
  longitude = null,
  maxDistanceKm =
    DEFAULT_STORE_RADIUS_KM,
} = {}) {

  if (!retailer) {

    throw new Error(
      "Retailer is required."
    );

  }


  const stores =
    await getCachedStores({
      retailer,
    });


  const fresh =
    stores.filter(
      store =>
        isStoreCacheFresh(
          store.lastUpdated
        )
    );


  const stale =
    stores.filter(
      store =>
        !isStoreCacheFresh(
          store.lastUpdated
        )
    );


  let nearbyFresh =
    null;


  const parsedLatitude =
    Number(
      latitude
    );


  const parsedLongitude =
    Number(
      longitude
    );


  if (
    Number.isFinite(
      parsedLatitude
    ) &&
    Number.isFinite(
      parsedLongitude
    )
  ) {

    nearbyFresh =
      fresh
        .map(
          store =>
            addStoreDistanceFromUser(
              store,
              parsedLatitude,
              parsedLongitude
            )
        )
        .filter(
          store =>
            Number.isFinite(
              store.distanceFromUser
            ) &&
            store.distanceFromUser <=
              maxDistanceKm
        )
        .length;

  }


  return {

    retailer,

    total:
      stores.length,

    fresh:
      fresh.length,

    stale:
      stale.length,

    nearbyFresh,

    radiusKm:
      maxDistanceKm,

    cacheDurationDays:
      STORE_CACHE_DURATION_DAYS,
  };
}


/*
 * ------------------------------------------------
 * Exports
 * ------------------------------------------------
 */

module.exports = {

  STORE_CACHE_DURATION_DAYS,

  DEFAULT_STORE_RADIUS_KM,

  isStoreCacheFresh,

  cacheRowToStore,

  getCachedStores,

  getFreshCachedStores,

  getFreshCachedStoresNearby,

  addStoreDistanceFromUser,

  saveStoresToCache,

  getStoreCacheStats,
};
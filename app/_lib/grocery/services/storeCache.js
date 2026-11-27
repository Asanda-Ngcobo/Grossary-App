
const {
  createClient,
} = require("@supabase/supabase-js");

const {
  calculateDistanceKm,
} = require("../utils/distance");


/*
 * ------------------------------------------------
 * Supabase service client
 * ------------------------------------------------
 *
 * Server-side only.
 * Never expose SUPABASE_SERVICE_ROLE_KEY
 * to the browser.
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


/*
 * ------------------------------------------------
 * Store cache duration
 * ------------------------------------------------
 */

const STORE_CACHE_DURATION_DAYS = 365;


/*
 * ------------------------------------------------
 * Default nearby-store radius
 * ------------------------------------------------
 */

const DEFAULT_STORE_RADIUS_KM = 15;


/*
 * ------------------------------------------------
 * Check whether cached store is fresh
 * ------------------------------------------------
 */

function isStoreCacheFresh(
  lastUpdated,
  maxAgeDays = STORE_CACHE_DURATION_DAYS
) {
  if (!lastUpdated) {
    return false;
  }

  const updated = new Date(lastUpdated);

  if (Number.isNaN(updated.getTime())) {
    return false;
  }

  const now = new Date();

  const maxAgeMs =
    maxAgeDays *
    24 *
    60 *
    60 *
    1000;

  const ageMs =
    now.getTime() - updated.getTime();

  return (
    ageMs >= 0 &&
    ageMs <= maxAgeMs
  );
}


/*
 * ------------------------------------------------
 * Convert Supabase row to Grossary store
 * ------------------------------------------------
 *
 * store_id:
 * ReefAPI pos_site_code / Parse-compatible ID
 *
 * provider_store_id:
 * ReefAPI physical store ID
 */

function cacheRowToStore(store) {
  return {
    storeId: store.store_id,

    retailer: store.retailer,

    providerStoreId:
      store.provider_store_id,

    storeName:
      store.store_name,

    storeType:
      store.store_type,

    address: {
      street: store.street,
      suburb: store.suburb,
      city: store.city,
      postalCode: store.postal_code,
    },

    latitude:
      store.latitude !== null &&
      store.latitude !== undefined
        ? Number(store.latitude)
        : null,

    longitude:
      store.longitude !== null &&
      store.longitude !== undefined
        ? Number(store.longitude)
        : null,

    source:
      store.source,

    lastUpdated:
      store.last_updated,
  };
}


/*
 * ------------------------------------------------
 * Normalize ReefAPI store response
 * ------------------------------------------------
 *
 * Converts ReefAPI /stores response into
 * the format expected by saveStoresToCache().
 *
 * ReefAPI:
 * store.store_id     = physical Reef store ID
 * store.pos_site_code = Parse-compatible ID
 */

function normalizeReefStores(reefStores = []) {
  if (!Array.isArray(reefStores)) {
    return [];
  }

  return reefStores
    .filter(store =>
      store.store_id &&
      store.pos_site_code
    )
    .map(store => {
      const addressParts = (
        store.address || ""
      )
        .split(",")
        .map(part => part.trim());

      return {
        providerStoreId:
          String(store.store_id),

        storeId:
          String(store.pos_site_code),

        storeName:
          store.name || null,

        storeType:
          store.brand || null,

        address: {
          street:
            addressParts[0] || null,

          suburb:
            addressParts[1] || null,

          city:
            addressParts[2] || null,

          postalCode: null,
        },

        latitude:
          store.latitude,

        longitude:
          store.longitude,

        source: "reef_api",
      };
    });
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
  } = await supabase
    .from("stores")
    .select("*")
    .eq("retailer", retailer);

  if (error) {
    throw new Error(
      `Could not load cached stores: ${error.message}`
    );
  }

  return (data || []).map(
    cacheRowToStore
  );
}


/*
 * ------------------------------------------------
 * Get fresh cached stores
 * ------------------------------------------------
 */

async function getFreshCachedStores({
  retailer,
  maxAgeDays = STORE_CACHE_DURATION_DAYS,
} = {}) {
  const stores = await getCachedStores({
    retailer,
  });

  return stores.filter(store =>
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
    Number(store.latitude);

  const storeLongitude =
    Number(store.longitude);

  if (
    !Number.isFinite(storeLatitude) ||
    !Number.isFinite(storeLongitude)
  ) {
    return {
      ...store,
      distanceFromUser: Infinity,
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
 */

async function getFreshCachedStoresNearby({
  retailer,
  latitude,
  longitude,
  maxDistanceKm = DEFAULT_STORE_RADIUS_KM,
  maxAgeDays = STORE_CACHE_DURATION_DAYS,
} = {}) {
  if (!retailer) {
    throw new Error(
      "Retailer is required."
    );
  }

  latitude = Number(latitude);
  longitude = Number(longitude);
  maxDistanceKm = Number(maxDistanceKm);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    throw new Error(
      "Valid latitude and longitude are required."
    );
  }

  if (
    !Number.isFinite(maxDistanceKm) ||
    maxDistanceKm <= 0
  ) {
    throw new Error(
      "maxDistanceKm must be greater than 0."
    );
  }

  const freshStores =
    await getFreshCachedStores({
      retailer,
      maxAgeDays,
    });

  return freshStores
    .map(store =>
      addStoreDistanceFromUser(
        store,
        latitude,
        longitude
      )
    )
    .filter(store =>
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
 *
 * Upsert identity:
 * retailer + provider_store_id
 *
 * store_id stores ReefAPI pos_site_code.
 */


async function saveStoresToCache({
  retailer,
  stores,
} = {}) {
  if (!retailer) {
    throw new Error("Retailer is required.");
  }

  if (!Array.isArray(stores) || stores.length === 0) {
    console.warn("No stores supplied to saveStoresToCache.");
    return [];
  }

  const now = new Date().toISOString();

  const rows = stores
    .map(store => {
      /*
       * Support both:
       * 1. Raw ReefAPI response
       * 2. Normalized Grossary store object
       */

      const providerStoreId =
        store.providerStoreId ?? store.store_id;

      const storeId =
        store.storeId ?? store.pos_site_code;

      const storeName =
        store.storeName ?? store.name;

      const storeType =
        store.storeType ?? store.brand;

      // Handle either an address object or ReefAPI address string.
      let address = {};

      if (
        typeof store.address === "object" &&
        store.address !== null
      ) {
        address = store.address;
      } else if (typeof store.address === "string") {
        const parts = store.address
          .split(",")
          .map(part => part.trim());

        address = {
          street: parts[0] || null,
          suburb: parts.length > 2
            ? parts[parts.length - 2]
            : null,
          city: parts.length > 1
            ? parts[parts.length - 1]
            : null,
        };
      }

      const latitude = Number(store.latitude);
      const longitude = Number(store.longitude);

      return {
        retailer,

        provider_store_id:
          providerStoreId != null
            ? String(providerStoreId)
            : null,

        store_id:
          storeId != null && storeId !== ""
            ? String(storeId)
            : null,

        store_name: storeName || null,
        store_type: storeType || null,

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
          Number.isFinite(latitude)
            ? latitude
            : null,

        longitude:
          Number.isFinite(longitude)
            ? longitude
            : null,

        source: store.source || "reef_api",

        last_updated: now,
      };
    })
    .filter(row => row.provider_store_id);

  if (rows.length === 0) {
    throw new Error(
      "No valid stores found. Check that ReefAPI returns store_id."
    );
  }

  // Check required database fields before inserting.
  const invalidRows = rows.filter(row => !row.city);

  if (invalidRows.length > 0) {
    console.error(
      "Stores missing city:",
      invalidRows.map(row => ({
        store_name: row.store_name,
        provider_store_id: row.provider_store_id,
      }))
    );

    throw new Error(
      `${invalidRows.length} store(s) are missing a city.`
    );
  }

  console.log(
    `Attempting to save ${rows.length} ${retailer} stores.`
  );

  const {
    data,
    error,
  } = await supabase
    .from("stores")
    .upsert(rows, {
      onConflict: "retailer,provider_store_id",
    })
    .select();

  if (error) {
    console.error("Supabase store cache error:", error);

    throw new Error(
      `Could not save stores to cache: ${error.message}`
    );
  }

  console.log(
    `Successfully saved ${data?.length || 0} ${retailer} stores.`
  );

  return (data || []).map(cacheRowToStore);
}


const reefResponse = await findReefCheckersStores(
  latitude,
  longitude,
  {
    radiusKm: 10,
    limit: 12,
    site: "checkers",
  }
);

const savedStores = await saveStoresToCache({
  retailer: "Checkers",
  stores: reefResponse.data.stores,
});

console.log("Saved stores:", savedStores);
/*
 * ------------------------------------------------
 * Store cache statistics
 * ------------------------------------------------
 */

async function getStoreCacheStats({
  retailer,
  latitude = null,
  longitude = null,
  maxDistanceKm = DEFAULT_STORE_RADIUS_KM,
} = {}) {
  if (!retailer) {
    throw new Error(
      "Retailer is required."
    );
  }

  const stores = await getCachedStores({
    retailer,
  });

  const fresh = stores.filter(store =>
    isStoreCacheFresh(
      store.lastUpdated
    )
  );

  const stale = stores.filter(store =>
    !isStoreCacheFresh(
      store.lastUpdated
    )
  );

  let nearbyFresh = null;

  const parsedLatitude =
    Number(latitude);

  const parsedLongitude =
    Number(longitude);

  if (
    Number.isFinite(parsedLatitude) &&
    Number.isFinite(parsedLongitude)
  ) {
    nearbyFresh = fresh
      .map(store =>
        addStoreDistanceFromUser(
          store,
          parsedLatitude,
          parsedLongitude
        )
      )
      .filter(store =>
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
    total: stores.length,
    fresh: fresh.length,
    stale: stale.length,
    nearbyFresh,
    radiusKm: maxDistanceKm,
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
  normalizeReefStores,

  getCachedStores,
  getFreshCachedStores,
  getFreshCachedStoresNearby,

  addStoreDistanceFromUser,

  saveStoresToCache,
  getStoreCacheStats,
};

const {
  findCheckersStores,
} = require(
  "../providers/checkers"
);

const {
  getPnpStores,
} = require(
  "../providers/pnp"
);

const {
  normalizeCheckersStores,
} = require(
  "../normalizers/checkersStore"
);

const {
  normalizePnpStores,
} = require(
  "../normalizers/pnpStore"
);

const {
  filterPnpGroceryStores,
} = require(
  "../filters/isPnpGroceryStore"
);

const {
  calculateDistanceKm,
} = require(
  "../utils/distance"
);

const {
  reverseGeocode,
} = require(
  "../location/reverseGeocode"
);

const {
  matchSharedShoppingLocations,
} = require(
  "../matchSharedShoppingLocations"
);

const {
  getFreshCachedStoresNearby,
  saveStoresToCache,
} = require(
  "./storeCache"
);


const MAX_USER_DISTANCE_KM =
  15;


/*
 * ------------------------------------------------
 * Calculate distance from user to shared location
 * ------------------------------------------------
 */

function getSharedLocationDistanceFromUser(
  userLatitude,
  userLongitude,
  match
) {

  const checkersLatitude =
    Number(
      match.checkers?.latitude
    );

  const checkersLongitude =
    Number(
      match.checkers?.longitude
    );

  const pnpLatitude =
    Number(
      match.pnp?.latitude
    );

  const pnpLongitude =
    Number(
      match.pnp?.longitude
    );


  if (
    !Number.isFinite(
      checkersLatitude
    ) ||
    !Number.isFinite(
      checkersLongitude
    ) ||
    !Number.isFinite(
      pnpLatitude
    ) ||
    !Number.isFinite(
      pnpLongitude
    )
  ) {

    return Infinity;
  }


  /*
   * Midpoint between the two retailer
   * branches represents the shared
   * shopping location.
   */
  const midpointLatitude =
    (
      checkersLatitude +
      pnpLatitude
    ) / 2;


  const midpointLongitude =
    (
      checkersLongitude +
      pnpLongitude
    ) / 2;


  return calculateDistanceKm(
    userLatitude,
    userLongitude,
    midpointLatitude,
    midpointLongitude
  );
}


/*
 * ------------------------------------------------
 * Add distance from user
 * ------------------------------------------------
 *
 * Used for fresh provider results.
 *
 * Cached stores already receive
 * distanceFromUser from storeCache.js.
 * ------------------------------------------------
 */

function addDistanceFromUser(
  stores,
  latitude,
  longitude
) {

  return stores
    .map(
      store => {

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


        return {
          ...store,

          distanceFromUser:
            calculateDistanceKm(
              latitude,
              longitude,
              storeLatitude,
              storeLongitude
            ),
        };
      }
    )
    .filter(
      store =>
        Number.isFinite(
          store.distanceFromUser
        ) &&
        store.distanceFromUser <=
          MAX_USER_DISTANCE_KM
    )
    .sort(
      (a, b) =>
        a.distanceFromUser -
        b.distanceFromUser
    );
}


/*
 * ------------------------------------------------
 * Load Checkers stores
 * ------------------------------------------------
 *
 * Strategy:
 *
 * 1. Look for fresh cached Checkers stores
 *    within 15 km.
 *
 * 2. If found, use cache.
 *
 * 3. Otherwise call Parse.
 *
 * 4. Normalize and save provider stores.
 *
 * 5. Return nearby stores only.
 * ------------------------------------------------
 */

async function getCheckersStoresForUser({
  latitude,
  longitude,
}) {

  // =====================================
  // TRY CACHE FIRST
  // =====================================

  try {

    const cachedStores =
      await getFreshCachedStoresNearby({
        retailer:
          "Checkers",

        latitude,

        longitude,

        maxDistanceKm:
          MAX_USER_DISTANCE_KM,
      });


    if (
      cachedStores.length >
      0
    ) {

      console.log(
        `✓ Checkers store cache hit: ${cachedStores.length} nearby stores`
      );


      return {
        stores:
          cachedStores,

        source:
          "cache",
      };
    }

  } catch (error) {

    console.error(
      "Checkers store cache lookup failed:",
      error.message
    );
  }


  // =====================================
  // CACHE MISS → PROVIDER
  // =====================================

  console.log(
    "✗ No fresh Checkers stores found within cache radius"
  );


  console.log(
    "→ Fetching Checkers stores from Parse..."
  );


  const response =
    await findCheckersStores(
      latitude,
      longitude
    );


  const rawStores =
    response
      ?.data
      ?.stores ||
    response
      ?.stores ||
    response
      ?.data ||
    [];


  const normalizedStores =
    normalizeCheckersStores(
      rawStores
    );


  // =====================================
  // SAVE PROVIDER RESULTS
  // =====================================

  if (
    normalizedStores.length >
    0
  ) {

    try {

      await saveStoresToCache({
        retailer:
          "Checkers",

        stores:
          normalizedStores,
      });


      console.log(
        `✓ Cached ${normalizedStores.length} Checkers stores`
      );

    } catch (error) {

      console.error(
        "Checkers store cache save failed:",
        error.message
      );
    }
  }


  // =====================================
  // KEEP NEARBY STORES
  // =====================================

  const nearbyStores =
    addDistanceFromUser(
      normalizedStores,
      latitude,
      longitude
    );


  return {
    stores:
      nearbyStores,

    source:
      "api",
  };
}


/*
 * ------------------------------------------------
 * Load Pick n Pay stores
 * ------------------------------------------------
 *
 * IMPORTANT:
 *
 * Cached PnP stores are trusted because
 * only approved grocery stores should be
 * written to the cache.
 *
 * filterPnpGroceryStores is therefore only
 * applied to fresh provider results.
 * ------------------------------------------------
 */

async function getPnpStoresForUser({
  latitude,
  longitude,
  locationQuery,
}) {

  // =====================================
  // TRY CACHE FIRST
  // =====================================

  try {

    const cachedStores =
      await getFreshCachedStoresNearby({
        retailer:
          "Pick n Pay",

        latitude,

        longitude,

        maxDistanceKm:
          MAX_USER_DISTANCE_KM,
      });


    if (
      cachedStores.length >
      0
    ) {

      console.log(
        `✓ PnP store cache hit: ${cachedStores.length} nearby stores`
      );


      /*
       * DO NOT run filterPnpGroceryStores
       * here.
       *
       * These stores are already approved
       * Grossary cache records.
       */
      return {
        stores:
          cachedStores,

        source:
          "cache",
      };
    }

  } catch (error) {

    console.error(
      "PnP store cache lookup failed:",
      error.message
    );
  }


  // =====================================
  // CACHE MISS → PROVIDER
  // =====================================

  console.log(
    "✗ No fresh PnP stores found within cache radius"
  );


  console.log(
    "→ Fetching PnP stores from Parse..."
  );


  if (!locationQuery) {

    throw new Error(
      "PnP location query is required for provider fallback."
    );
  }


  const response =
    await getPnpStores(
      locationQuery
    );


  const rawStores =
    response
      ?.data
      ?.stores ||
    response
      ?.stores ||
    [];


  const normalizedStores =
    normalizePnpStores(
      rawStores
    );


  /*
   * Fresh provider results must be
   * filtered before entering the cache.
   */
  const groceryStores =
    filterPnpGroceryStores(
      normalizedStores
    );


  // =====================================
  // SAVE APPROVED PNP STORES
  // =====================================

  if (
    groceryStores.length >
    0
  ) {

    try {

      await saveStoresToCache({
        retailer:
          "Pick n Pay",

        stores:
          groceryStores,
      });


      console.log(
        `✓ Cached ${groceryStores.length} PnP stores`
      );

    } catch (error) {

      console.error(
        "PnP store cache save failed:",
        error.message
      );
    }
  }


  // =====================================
  // KEEP NEARBY STORES
  // =====================================

  const nearbyStores =
    addDistanceFromUser(
      groceryStores,
      latitude,
      longitude
    );


  return {
    stores:
      nearbyStores,

    source:
      "api",
  };
}


/*
 * ------------------------------------------------
 * Find shared Checkers + PnP locations
 * ------------------------------------------------
 */

async function findSharedShoppingLocations(
  latitude,
  longitude
) {

  // =====================================
  // VALIDATE COORDINATES
  // =====================================

  latitude =
    Number(
      latitude
    );

  longitude =
    Number(
      longitude
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
      "Invalid user coordinates."
    );
  }


  // =====================================
  // REVERSE GEOCODE USER
  // =====================================
  //
  // Coordinates are used for cache
  // selection.
  //
  // Reverse geocoding is kept mainly for:
  //
  // - API response / UI
  // - PnP provider fallback
  // =====================================

  let userLocation =
    {};


  try {

    userLocation =
      await reverseGeocode(
        latitude,
        longitude
      );

  } catch (error) {

    console.error(
      "Reverse geocoding failed:",
      error.message
    );
  }


  const locationQuery =
    userLocation?.city ||
    userLocation?.suburb ||
    userLocation?.town ||
    userLocation?.municipality ||
    null;


  console.log(
    "Grossary Plus coordinates:",
    {
      latitude,
      longitude,
      location:
        locationQuery,
    }
  );


  // =====================================
  // LOAD RETAILER STORES
  // =====================================

  const [
    checkersResult,
    pnpResult,
  ] =
    await Promise.all([

      getCheckersStoresForUser({
        latitude,
        longitude,
      }),

      getPnpStoresForUser({
        latitude,
        longitude,
        locationQuery,
      }),

    ]);


  const nearbyCheckersStores =
    checkersResult.stores ||
    [];


  /*
   * IMPORTANT:
   *
   * Do not filter cached PnP stores again.
   *
   * getPnpStoresForUser already handles
   * provider filtering when necessary.
   */
  const nearbyPnpStores =
    pnpResult.stores ||
    [];


  console.log(
    `Nearby Checkers stores: ${nearbyCheckersStores.length}`
  );


  console.log(
    `Nearby PnP stores: ${nearbyPnpStores.length}`
  );


  // =====================================
  // DEBUG STORE DETAILS
  // =====================================

  console.log(
    "Checkers stores used for matching:",
    nearbyCheckersStores.map(
      store => ({
        id:
          store.providerStoreId,

        name:
          store.storeName,

        latitude:
          store.latitude,

        longitude:
          store.longitude,

        distanceFromUser:
          store.distanceFromUser,
      })
    )
  );


  console.log(
    "PnP stores used for matching:",
    nearbyPnpStores.map(
      store => ({
        id:
          store.providerStoreId,

        name:
          store.storeName,

        type:
          store.storeType,

        latitude:
          store.latitude,

        longitude:
          store.longitude,

        distanceFromUser:
          store.distanceFromUser,
      })
    )
  );


  // =====================================
  // MATCH SHARED SHOPPING LOCATIONS
  // =====================================

  const matchedLocations =
    matchSharedShoppingLocations(
      nearbyCheckersStores,
      nearbyPnpStores
    );


  console.log(
    `Shared retailer matches: ${matchedLocations.length}`
  );


  // =====================================
  // CALCULATE USER DISTANCE
  // =====================================

  const sharedLocations =
    matchedLocations
      .map(
        match => ({

          ...match,

          distanceFromUserKm:
            getSharedLocationDistanceFromUser(
              latitude,
              longitude,
              match
            ),
        })
      )
      .filter(
        match =>
          Number.isFinite(
            match.distanceFromUserKm
          )
      )
      .sort(
        (a, b) =>
          a.distanceFromUserKm -
          b.distanceFromUserKm
      );


  // =====================================
  // DEBUG NEAREST LOCATION
  // =====================================

  if (
    sharedLocations.length >
    0
  ) {

    const nearest =
      sharedLocations[0];


    console.log(
      "Nearest Grossary Plus location:",
      {

        checkers:
          nearest.checkers
            ?.storeName,

        checkersId:
          nearest.checkers
            ?.providerStoreId,

        pnp:
          nearest.pnp
            ?.storeName,

        pnpId:
          nearest.pnp
            ?.providerStoreId,

        distanceFromUserKm:
          nearest
            .distanceFromUserKm,

        distanceBetweenStoresKm:
          nearest
            .distanceKm,
      }
    );

  } else {

    console.log(
      "No shared Checkers + PnP location found within range."
    );
  }


  // =====================================
  // RESPONSE
  // =====================================

  return {

    userLocation,

    checkersStores:
      nearbyCheckersStores,

    pnpStores:
      nearbyPnpStores,

    sharedLocations,

    storeSources: {

      checkers:
        checkersResult.source,

      pnp:
        pnpResult.source,
    },
  };
}


module.exports = {

  findSharedShoppingLocations,

  getSharedLocationDistanceFromUser,

  getCheckersStoresForUser,

  getPnpStoresForUser,

  addDistanceFromUser,
};
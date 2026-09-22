require("dotenv").config({
  path: ".env.local",
});


const {
  findCheckersStores,
} = require(
  "../app/_lib/grocery/providers/checkers"
);


const {
  getPnpStores,
} = require(
  "../app/_lib/grocery/providers/pnp"
);


const {
  normalizePnpStores,
} = require(
  "../app/_lib/grocery/normalizers/pnpStore"
);


const {
  filterPnpGroceryStores,
} = require(
  "../app/_lib/grocery/filters/isPnpGroceryStore"
);


const {
  matchSharedShoppingLocations,
} = require(
  "../app/_lib/grocery/matchSharedShoppingLocations"
);


const {
  calculateDistanceKm,
} = require(
  "../app/_lib/grocery/utils/distance"
);

const {
  reverseGeocode,
} = require(
  "../app/_lib/grocery/location/reverseGeocode"
);
// =====================================
// TEMPORARY TEST LOCATION
// =====================================
//
// In the real Grossary app these will
// come from navigator.geolocation.
//

const USER_LATITUDE = -29.85;
const USER_LONGITUDE = 31.00;

const MAX_USER_DISTANCE_KM = 15;


async function main() {

  console.log(
    "\nGetting stores near user..."
  );


  // =====================================
  // CHECKERS
  // =====================================

  const checkersResponse =
    await findCheckersStores(
      USER_LATITUDE,
      USER_LONGITUDE
    );


  const checkersStores =
    checkersResponse?.data?.stores ||
    checkersResponse?.stores ||
    checkersResponse?.data ||
    [];


  const normalizedCheckersStores =
    checkersStores
      .map(
        store => {

          const coordinates =
            store?.location
              ?.geolocation
              ?.geoJson
              ?.geometry
              ?.coordinates ||
            [];


          const latitude =
            Number(
              coordinates[0]
            );


          const longitude =
            Number(
              coordinates[1]
            );


          return {
            retailer:
              "Checkers",

            providerStoreId:
              store.identifier,

            storeName:
              store.name,

            location:
              store.location
                ?.address
                ?.line1 ||
              null,

            city:
              store.location
                ?.address
                ?.city ||
              null,

            latitude,

            longitude,
          };
        }
      )
      .filter(
        store =>
          Number.isFinite(
            store.latitude
          ) &&
          Number.isFinite(
            store.longitude
          )
      );


  console.log(
    "\n=============================="
  );

  console.log(
    "CHECKERS STORES"
  );

  console.log(
    "==============================\n"
  );


  console.table(
    normalizedCheckersStores.map(
      store => ({
        storeId:
          store.providerStoreId,

        storeName:
          store.storeName,

        location:
          store.location,

        city:
          store.city,

        latitude:
          store.latitude,

        longitude:
          store.longitude,
      })
    )
  );


  // =====================================
  // PNP LOCATION QUERY
  // =====================================

console.log(
  "\nDetermining user's city..."
);


const userLocation =
  await reverseGeocode(
    USER_LATITUDE,
    USER_LONGITUDE
  );


console.log(
  "Detected location:",
  userLocation
);


const locationQuery =
  userLocation.city;


console.log(
  "PnP location query:",
  locationQuery
);
  // =====================================
  // PNP
  // =====================================

  const pnpResponse =
    await getPnpStores(
      locationQuery
    );


  const rawPnpStores =
    pnpResponse?.data?.stores ||
    pnpResponse?.stores ||
    [];


  const normalizedPnpStores =
    normalizePnpStores(
      rawPnpStores
    );


  const pnpStores =
    filterPnpGroceryStores(
      normalizedPnpStores
    );


  // =====================================
  // FILTER PNP BY USER DISTANCE
  // =====================================

  const nearbyPnpStores =
    pnpStores
      .map(
        store => {

          const distanceFromUser =
            calculateDistanceKm(
              USER_LATITUDE,
              USER_LONGITUDE,
              store.latitude,
              store.longitude
            );


          return {
            ...store,
            distanceFromUser,
          };
        }
      )
      .filter(
        store =>
          store.distanceFromUser <=
          MAX_USER_DISTANCE_KM
      )
      .sort(
        (a, b) =>
          a.distanceFromUser -
          b.distanceFromUser
      );


  console.log(
    "\n=============================="
  );

  console.log(
    "NEARBY PNP STORES"
  );

  console.log(
    "==============================\n"
  );


  console.table(
    nearbyPnpStores.map(
      store => ({
        storeId:
          store.providerStoreId,

        storeName:
          store.storeName,

        storeType:
          store.storeType,

        street:
          store.address?.street,

        city:
          store.address?.city,

        latitude:
          store.latitude,

        longitude:
          store.longitude,

        distanceFromUser:
          `${store.distanceFromUser.toFixed(2)} km`,
      })
    )
  );


  // =====================================
  // SHARED SHOPPING LOCATIONS
  // =====================================

  const sharedLocations =
    matchSharedShoppingLocations(
      normalizedCheckersStores,
      nearbyPnpStores
    );


  console.log(
    "\n=============================="
  );

  console.log(
    "SHARED SHOPPING LOCATIONS"
  );

  console.log(
    "==============================\n"
  );


  if (
    sharedLocations.length === 0
  ) {

    console.log(
      "No shared Checkers + PnP locations found."
    );

    return;
  }


  console.table(
    sharedLocations.map(
      match => ({
        checkers:
          match.checkers.storeName,

        checkersLocation:
          match.checkers.location,

        pnp:
          match.pnp.storeName,

        pnpStreet:
          match.pnp.address?.street,

        distanceBetweenStores:
          `${
            (
              match.distanceKm *
              1000
            ).toFixed(0)
          } m`,
      })
    )
  );
}


main().catch(
  error => {

    console.error(
      "\nNearby store test failed:"
    );

    console.error(
      error
    );

  }
);
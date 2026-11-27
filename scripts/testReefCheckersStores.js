
require("dotenv").config({
  path: ".env.local",
});

const {
  findReefCheckersStores,
} = require(
  "../app/_lib/grocery/providers/reefCheckers"
);


async function main() {

  /*
   * Test coordinates.
   * Replace these with your preferred location.
   */
  const latitude = -29.8500;
  const longitude = 31.0034;


  console.log(
    `Finding ReefAPI Checkers stores near: ${latitude}, ${longitude}\n`
  );


  const response = await findReefCheckersStores(
    latitude,
    longitude,
    {
      radiusKm: 10,
      limit: 12,
      site: "checkers",
    }
  );


  // ==================================
  // RAW RESPONSE
  // ==================================

  console.log(
    "\n=============================="
  );

  console.log("RAW REEFAPI RESPONSE");

  console.log(
    "==============================\n"
  );


  console.dir(
    response,
    {
      depth: null,
      colors: true,
      maxArrayLength: null,
      maxStringLength: null,
    }
  );


  // ==================================
  // EXTRACT STORE ARRAY
  // ==================================

  const stores =
    response?.data?.stores ||
    response?.stores ||
    response?.data ||
    [];


  console.log(
    "\n=============================="
  );

  console.log("STORE SUMMARY");

  console.log(
    "==============================\n"
  );


  if (!Array.isArray(stores)) {

    console.log(
      "Could not identify store array."
    );

    console.log(
      "Inspect the raw response to identify its structure."
    );

    return;
  }


  console.log(
    `Received ${stores.length} stores\n`
  );


  // ==================================
  // STORE DETAILS
  // ==================================

  console.table(
    stores.map((store, index) => {

      const coordinates =
        store?.location?.geolocation?.geoJson?.geometry?.coordinates ||
        store?.location?.coordinates ||
        store?.coordinates ||
        [];

      return {

        index,

        storeId:
          store.store_id ||
          store.storeId ||
          store.id ||
          store.identifier ||
          null,

        name:
          store.name ||
          store.store_name ||
          store.title ||
          null,

        serviceOption:
          store.service_option ||
          store.serviceOption ||
          null,

        latitude:
          store.latitude ??
          coordinates[1] ??
          null,

        longitude:
          store.longitude ??
          coordinates[0] ??
          null,

        distance:
          store.distance_km ??
          store.distance ??
          null,

        site:
          store.site ||
          null,

        status:
          store.status ||
          store.availability_status ||
          null,

      };

    })
  );


  // ==================================
  // SAVE RESPONSE TO JSON
  // ==================================

  const fs = require("fs");
  const path = require("path");

  const outputPath = path.join(
    process.cwd(),
    "reef-stores-response.json"
  );

  fs.writeFileSync(
    outputPath,
    JSON.stringify(response, null, 2)
  );


  console.log(
    "\nFull response saved to:"
  );

  console.log(outputPath);

}


main().catch(error => {

  console.error(
    "\nReefAPI Checkers store test failed:"
  );

  console.error(error);

});

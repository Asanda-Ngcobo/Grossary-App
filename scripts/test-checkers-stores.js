require("dotenv").config({
  path: ".env.local",
});

const {
  findCheckersStores,
} = require(
  "../app/_lib/grocery/providers/checkers"
);


async function main() {

  /*
   * Replace these with your test coordinates.
   *
   * You can get them from the browser using:
   *
   * navigator.geolocation.getCurrentPosition(
   *   position => {
   *     console.log(
   *       position.coords.latitude,
   *       position.coords.longitude
   *     );
   *   }
   * );
   */
  const latitude = -29.8500;
  const longitude = 31.0034;


  console.log(
    `Finding Checkers stores near: ${latitude}, ${longitude}\n`
  );


  const response =
    await findCheckersStores(
      latitude,
      longitude
    );


  console.log(
    "=============================="
  );

  console.log(
    "RAW RESPONSE"
  );

  console.log(
    "==============================\n"
  );


  console.dir(
    response,
    {
      depth: null,
      colors: true,
    }
  );


  /*
   * Try to find the store array from
   * the most likely response shapes.
   */
  const stores =
  response?.data?.stores ||
  response?.stores ||
  response?.data ||
  [];


console.log(
  "\n=============================="
);

console.log(
  "STORE SUMMARY"
);

console.log(
  "==============================\n"
);


if (!Array.isArray(stores)) {
  console.log(
    "Could not identify store array."
  );

  return;
}


console.log(
  `Received ${stores.length} stores\n`
);


console.table(
  stores.map(
    (store, index) => {

      const coordinates =
        store
          ?.location
          ?.geolocation
          ?.geoJson
          ?.geometry
          ?.coordinates ||
        [];


      return {
        index,

        storeId:
          store.identifier ||
          null,

        name:
          store.name ||
          null,

        address:
          store
            ?.location
            ?.address
            ?.formattedAddress ||
          null,

        addressLine1:
          store
            ?.location
            ?.address
            ?.line1 ||
          null,

        city:
          store
            ?.location
            ?.address
            ?.city ||
          null,

        latitude:
          coordinates[0] ??
          null,

        longitude:
          coordinates[1] ??
          null,
      };

    }
  )
);
 
}


main().catch(
  error => {

    console.error(
      "\nCheckers store test failed:"
    );

    console.error(
      error
    );

  }
);
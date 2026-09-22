require("dotenv").config({
  path: ".env.local",
});


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


async function main() {

  const response =
    await getPnpStores(
      "durban"
    );


  const rawStores =
    response?.data?.stores ||
    response?.stores ||
    [];


  console.log(
    `Raw stores: ${rawStores.length}`
  );


  const normalizedStores =
    normalizePnpStores(
      rawStores
    );


  console.log(
    "\n=============================="
  );

  console.log(
    "STORE TYPES"
  );

  console.log(
    "==============================\n"
  );


  const storeTypes = [
    ...new Set(
      normalizedStores.map(
        store =>
          store.storeType
      )
    ),
  ];


  console.log(
    storeTypes
  );


  const ALLOWED_PNP_TYPES = [
    "FAMILY",
    "SUPER",
    "HYPER",
    "LOCAL",
    "MARKET",
  ];


  const groceryStores =
    normalizedStores.filter(
      store =>
        ALLOWED_PNP_TYPES.includes(
          store.storeType
        ) &&
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
    "PNP GROCERY STORES"
  );

  console.log(
    "==============================\n"
  );


  console.table(
    groceryStores.map(
      store => ({
        storeId:
          store.providerStoreId,

        storeName:
          store.storeName,

        storeType:
          store.storeType,

        street:
          store.address.street,

        suburb:
          store.address.suburb,

        city:
          store.address.city,

        latitude:
          store.latitude,

        longitude:
          store.longitude,
      })
    )
  );
}


main().catch(
  error => {

    console.error(
      "\nPnP test failed:"
    );

    console.error(
      error
    );
  }
);
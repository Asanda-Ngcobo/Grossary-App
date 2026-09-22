function normalizeCheckersStore(store) {
  if (!store) {
    return null;
  }


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
      store.identifier ||
      null,

    storeName:
      store.name ||
      null,

    location:
      store.location
        ?.address
        ?.line1 ||
      null,

    address: {
      line1:
        store.location
          ?.address
          ?.line1 ||
        null,

      line2:
        store.location
          ?.address
          ?.line2 ||
        null,

      city:
        store.location
          ?.address
          ?.city ||
        null,

      postalCode:
        store.location
          ?.address
          ?.postalCode ||
        null,

      formattedAddress:
        store.location
          ?.address
          ?.formattedAddress ||
        null,
    },

    latitude,
    longitude,

    raw:
      store,
  };
}


function normalizeCheckersStores(
  stores
) {
  if (!Array.isArray(stores)) {
    return [];
  }


  return stores
    .map(
      normalizeCheckersStore
    )
    .filter(
      store =>
        store &&
        Number.isFinite(
          store.latitude
        ) &&
        Number.isFinite(
          store.longitude
        )
    );
}


module.exports = {
  normalizeCheckersStore,
  normalizeCheckersStores,
};
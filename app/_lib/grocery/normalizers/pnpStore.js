function normalizePnpStore(store) {
  if (!store) {
    return null;
  }

  const latitude =
    store.geolocation?.latitude != null
      ? Number(store.geolocation.latitude)
      : null;

  const longitude =
    store.geolocation?.longitude != null
      ? Number(store.geolocation.longitude)
      : null;

  return {
    retailer: "Pick n Pay",

    providerStoreId:
      store.storeId || null,

    storeName:
      store.storeName || null,

    storeType:
      store.storeType || null,

    address: {
      street:
        store.storeAddress?.street || null,

      suburb:
        store.storeAddress?.suburb || null,

      city:
        store.storeAddress?.city || null,

      postalCode:
        store.storeAddress?.postalCode || null,
    },

    latitude,
    longitude,

    raw: store,
  };
}


function normalizePnpStores(stores) {
  if (!Array.isArray(stores)) {
    return [];
  }

  return stores
    .map(normalizePnpStore)
    .filter(Boolean);
}


module.exports = {
  normalizePnpStore,
  normalizePnpStores,
};
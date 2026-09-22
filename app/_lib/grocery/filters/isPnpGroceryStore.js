const ALLOWED_PNP_TYPES = [
  "FAMILY",
  "SUPER",
  "HYPER",
  "LOCAL",
  "MARKET",
];


function isPnpGroceryStore(store) {

  if (!store) {
    return false;
  }


  if (
    !ALLOWED_PNP_TYPES.includes(
      store.storeType
    )
  ) {
    return false;
  }


  if (
    !Number.isFinite(store.latitude) ||
    !Number.isFinite(store.longitude)
  ) {
    return false;
  }


  return true;
}


function filterPnpGroceryStores(stores) {

  if (!Array.isArray(stores)) {
    return [];
  }


  return stores.filter(
    isPnpGroceryStore
  );
}


module.exports = {
  isPnpGroceryStore,
  filterPnpGroceryStores,
};
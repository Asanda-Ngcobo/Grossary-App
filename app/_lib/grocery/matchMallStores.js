const MALL_KEYWORDS = [
  "mall",
  "centre",
  "center",
  "city",
  "park",
];


function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


function isMallStore(storeName) {
  const name =
    normalizeText(storeName);

  return MALL_KEYWORDS.some(
    keyword =>
      name.includes(keyword)
  );
}


function extractMallName(
  storeName,
  retailer
) {
  let name =
    normalizeText(storeName);

  const retailerNames = [
    "checkers",
    "checkers hyper",
    "checkers foods",
    "pick n pay",
    "pnp",
  ];

  for (const retailerName of retailerNames) {
    name = name.replace(
      retailerName,
      ""
    );
  }


  /*
   * Remove retailer-specific noise
   * that isn't part of the mall name.
   */
  const noiseWords = [
    "fx",
    "hyper",
    "foods",
  ];

  for (const word of noiseWords) {
    name = name.replace(
      new RegExp(
        `\\b${word}\\b`,
        "g"
      ),
      ""
    );
  }


  return name
    .replace(/\s+/g, " ")
    .trim();
}


function matchMallStores(
  checkersStores,
  pnpStores
) {

  const validCheckers =
    checkersStores
      .filter(store =>
        isMallStore(store.name)
      )
      .map(store => ({
        ...store,

        mallName:
          extractMallName(
            store.name,
            "Checkers"
          ),
      }));


  const validPnp =
    pnpStores
      .filter(store =>
        isMallStore(store.name)
      )
      .map(store => ({
        ...store,

        mallName:
          extractMallName(
            store.name,
            "Pick n Pay"
          ),
      }));


  const matchedMalls = [];


  for (
    const checkersStore
    of validCheckers
  ) {

    const matchingPnp =
      validPnp.find(
        pnpStore =>
          pnpStore.mallName ===
          checkersStore.mallName
      );


    if (!matchingPnp) {
      continue;
    }


    matchedMalls.push({
      mallName:
        checkersStore.mallName,

      checkers:
        checkersStore,

      pnp:
        matchingPnp,
    });
  }


  return matchedMalls;
}


module.exports = {
  matchMallStores,
  extractMallName,
  isMallStore,
};
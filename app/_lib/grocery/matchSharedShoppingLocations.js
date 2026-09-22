const {
  calculateDistanceKm,
} = require(
  "./utils/distance"
);


const GENERIC_WORDS =
  new Set([
    "checkers",
    "pick",
    "pay",
    "pnp",
    "hyper",
    "super",
    "family",
    "local",
    "foods",
    "fx",
    "the",
    "shopping",
    "centre",
    "center",
    "mall",
    "road",
    "rd",
    "shop",
  ]);


function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


function getMeaningfulWords(value) {
  return normalizeText(value)
    .split(" ")
    .filter(
      word =>
        word.length >= 3 &&
        !GENERIC_WORDS.has(word)
    );
}


function getCheckersSearchText(store) {
  return [
    store.storeName,
    store.location,
  ]
    .filter(Boolean)
    .join(" ");
}


function getPnpSearchText(store) {
  return [
    store.storeName,
    store.street,
  ]
    .filter(Boolean)
    .join(" ");
}


function hasSharedLocationWord(
  checkers,
  pnp
) {
  const checkersWords =
    new Set(
      getMeaningfulWords(
        getCheckersSearchText(
          checkers
        )
      )
    );


  const pnpWords =
    getMeaningfulWords(
      getPnpSearchText(
        pnp
      )
    );


  return pnpWords.some(
    word =>
      checkersWords.has(word)
  );
}


function matchSharedShoppingLocations(
  checkersStores,
  pnpStores,
  {
    maxPairDistanceKm = 0.8,
  } = {}
) {
  const matches = [];


  for (
    const checkers
    of checkersStores
  ) {

    let bestMatch = null;


    for (
      const pnp
      of pnpStores
    ) {

      const distanceKm =
        calculateDistanceKm(
          Number(
            checkers.latitude
          ),
          Number(
            checkers.longitude
          ),
          Number(
            pnp.latitude
          ),
          Number(
            pnp.longitude
          )
        );


      if (
        distanceKm >
        maxPairDistanceKm
      ) {
        continue;
      }


      if (
        !hasSharedLocationWord(
          checkers,
          pnp
        )
      ) {
        continue;
      }


      if (
        !bestMatch ||
        distanceKm <
        bestMatch.distanceKm
      ) {
        bestMatch = {
          checkers,
          pnp,
          distanceKm,
        };
      }
    }


    if (bestMatch) {
      matches.push(
        bestMatch
      );
    }
  }


  return matches.sort(
    (a, b) =>
      a.distanceKm -
      b.distanceKm
  );
}


module.exports = {
  matchSharedShoppingLocations,
};
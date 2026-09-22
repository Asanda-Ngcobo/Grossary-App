const {
  fetchPromotion,
} = require("../app/_lib/checkers/fetchPromotions");

const {
  findCatalogueImages,
} = require("../app/_lib/checkers/findCatalogueImages");


async function main() {
  const url =
    "https://specials.checkers.co.za/deals/gncheckerscheesepromotion20aug06sep/index.html";

  console.log(
    "Fetching Checkers promotion..."
  );

  const html =
    await fetchPromotion(url);

  console.log(
    "HTML received:",
    html.length,
    "characters"
  );

  const images =
    findCatalogueImages(html);

  console.log(
    "\nCatalogue images found:"
  );

  console.dir(
    images,
    {
      depth: null,
    }
  );
}


main().catch((error) => {
  console.error(error);
});
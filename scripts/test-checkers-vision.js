require("dotenv").config({
  path: ".env.local",
});

const {
  fetchPromotion,
} = require(
  "../app/_lib/checkers/fetchPromotions"
);

const {
  findCatalogueAssets,
} = require(
  "../app/_lib/checkers/findCatalogueImages"
);

const {
  findFlippingBookPages,
} = require(
  "../app/_lib/checkers/findFlippingBookPages"
);

const fs = require("fs");
const path = require("path");
async function main() {
  /*
   * -----------------------------------------
   * 1. Checkers catalogue URL
   * -----------------------------------------
   */

  const catalogueUrl =
    "https://specials.checkers.co.za/deals/gncheckerscheesepromotion20aug06sep/index.html";


  /*
   * -----------------------------------------
   * 2. Fetch catalogue HTML
   * -----------------------------------------
   */

  console.log(
    "Fetching Checkers catalogue..."
  );

  const html =
    await fetchPromotion(
      catalogueUrl
    );

 console.log(
  "\n=============================="
);

console.log("FLIPPINGBOOK INITIALIZATION");

console.log(
  "=============================="
);

const interestingLines = html
  .split("\n")
  .filter((line) => {
    const lower = line.toLowerCase();

    return (
      lower.includes("fbinit") ||
      lower.includes("page") ||
      lower.includes("assets") ||
      lower.includes("publication") ||
      lower.includes("config") ||
      lower.includes("json")
    );
  });

console.log(
  interestingLines.join("\n")
);

const fs = require("fs");
const path = require("path");

fs.writeFileSync(
  path.join(
    __dirname,
    "checkers-debug.html"
  ),
  html
);

console.log(
  "\nHTML saved to scripts/checkers-debug.html"
);


  /*
   * -----------------------------------------
   * 3. Find assets referenced by HTML
   * -----------------------------------------
   */

  const assets =
    findCatalogueAssets(
      html,
      catalogueUrl
    );


  console.log(
    "\n=============================="
  );

  console.log("IMAGES");

  console.log(
    "=============================="
  );

  console.dir(
    assets.images,
    {
      depth: null,
    }
  );


  console.log(
    "\n=============================="
  );

  console.log("SCRIPTS");

  console.log(
    "=============================="
  );

  console.dir(
    assets.scripts,
    {
      depth: null,
    }
  );


  console.log(
    "\n=============================="
  );

  console.log("CONFIGS");

  console.log(
    "=============================="
  );

  console.dir(
    assets.configs,
    {
      depth: null,
    }
  );


  /*
   * -----------------------------------------
   * 4. Inspect FlippingBook scripts
   * -----------------------------------------
   */
const flippingBook =
  await findFlippingBookPages(
    html,
    catalogueUrl
  );

console.log(
  "\n=============================="
);

console.log(
  "VALID CATALOGUE IMAGES"
);

console.log(
  "=============================="
);

console.dir(
  flippingBook.validImages,
  {
    depth: null,
  }
);
console.dir(
  flippingBook.workspace,
  {
    depth: 5,
  }
);


}


/*
 * -----------------------------------------
 * Run test
 * -----------------------------------------
 */

main().catch((error) => {
  console.error(
    "\nCheckers catalogue inspection failed:"
  );

  console.error(error);
});
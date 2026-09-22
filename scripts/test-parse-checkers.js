require("dotenv").config({
  path: ".env.local",
});

const {
  searchCheckersProducts,
} = require(
  "../app/_lib/grocery/providers/checkers"
);

const {
  normalizeCheckersProducts,
} = require(
  "../app/_lib/grocery/normalizers/checkers"
);

const {
  matchProduct,
} = require(
  "../app/_lib/grocery/matchProduct"
);


async function main() {

  /*
   * Simulate an actual Grossary
   * list_items record.
   */

  const listItem = {
    item_name: "Rice",
    item_brand: "Tastic",
    item_volume_mass: 2,
    item_unit: "kg",
    item_quantity: 2,
  };


  /*
   * Build the search query from
   * the Grossary item.
   */

  const query = [
    listItem.item_brand,
    listItem.item_name,
    listItem.item_volume_mass,
    listItem.item_unit,
  ]
    .filter(Boolean)
    .join(" ");


  console.log(
    `Searching Checkers for: ${query}`
  );


  const response =
    await searchCheckersProducts(
      query,
      {
        limit: 20,
      }
    );


  const products =
    response?.data?.products ||
    response?.products ||
    [];


  const normalized =
    normalizeCheckersProducts(
      products
    );


  console.log(
    `\nReceived ${normalized.length} products`
  );


  const result =
    matchProduct(
      listItem,
      normalized
    );


  console.log(
    "\n=============================="
  );

  console.log(
    "BEST MATCH"
  );

  console.log(
    "=============================="
  );


  if (!result.matched) {
    console.log(
      "No confident match found."
    );
  } else {
    console.log({
      requested:
        query,

      matched:
        result.match.productName,

      brand:
        result.match.brand,

      price:
        result.match.price,

      score:
        result.score,

      reasons:
        result.reasons,
    });


    /*
     * Grossary basket calculation
     */

    const quantity =
      listItem.item_quantity || 1;

    const total =
      result.match.price *
      quantity;


    console.log(
      `\n${quantity} × R${result.match.price.toFixed(2)} = R${total.toFixed(2)}`
    );
  }


  /*
   * Show the top candidates.
   *
   * This is extremely useful while
   * we're tuning the matcher.
   */

  console.log(
    "\n=============================="
  );

  console.log(
    "TOP CANDIDATES"
  );

  console.log(
    "=============================="
  );


  console.table(
    result.candidates.map(
      candidate => ({
        product:
          candidate.product
            .productName,

        brand:
          candidate.product.brand,

        price:
          candidate.product.price,

        score:
          candidate.score,

        size:
          candidate.actualSize
            ? `${candidate.actualSize.value}${candidate.actualSize.unit}`
            : "unknown",

        reasons:
          candidate.reasons.join(
            ", "
          ),
      })
    )
  );
}


main().catch(error => {
  console.error(
    "\nTest failed:"
  );

  console.error(error);
});
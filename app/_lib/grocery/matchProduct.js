/*
 * Grossary product matcher
 *
 * Takes a Grossary list item and a set of
 * normalized retailer products and determines
 * which retailer product is the best match.
 */


/*
 * ------------------------------------------------
 * Text helpers
 * ------------------------------------------------
 */

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


function normalizeUnit(unit) {
  const value = normalizeText(unit);

  const units = {
    kilograms: "kg",
    kilogram: "kg",
    kgs: "kg",
    kg: "kg",

    grams: "g",
    gram: "g",
    g: "g",

    litres: "l",
    litre: "l",
    liters: "l",
    liter: "l",
    l: "l",

    millilitres: "ml",
    millilitre: "ml",
    milliliters: "ml",
    milliliter: "ml",
    ml: "ml",
  };

  return units[value] || value;
}


/*
 * ------------------------------------------------
 * Convert sizes to a common base unit
 *
 * 2kg   -> 2000g
 * 500g  -> 500g
 *
 * 2L    -> 2000ml
 * 500ml -> 500ml
 * ------------------------------------------------
 */

function normalizeSize(value, unit) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {
    return null;
  }

  const normalizedUnit =
    normalizeUnit(unit);


  if (normalizedUnit === "kg") {
    return {
      value: number * 1000,
      unit: "g",
    };
  }


  if (normalizedUnit === "g") {
    return {
      value: number,
      unit: "g",
    };
  }


  if (normalizedUnit === "l") {
    return {
      value: number * 1000,
      unit: "ml",
    };
  }


  if (normalizedUnit === "ml") {
    return {
      value: number,
      unit: "ml",
    };
  }


  return {
    value: number,
    unit: normalizedUnit,
  };
}


/*
 * ------------------------------------------------
 * Extract size from retailer product name
 *
 * Examples:
 *
 * "Tastic Rice 2kg"
 *      -> { value: 2000, unit: "g" }
 *
 * "Clover Milk 2L"
 *      -> { value: 2000, unit: "ml" }
 *
 * "Coke 6 x 330ml"
 *      -> { value: 1980, unit: "ml" }
 * ------------------------------------------------
 */

function extractSizeFromName(name) {
  const text =
    normalizeText(name);


  /*
   * First check for multipacks.
   *
   * 6 x 330ml
   * 4x500g
   */
  const multipackMatch =
    text.match(
      /(\d+)\s*x\s*(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/
    );


  if (multipackMatch) {
    const quantity =
      Number(
        multipackMatch[1]
      );


    const size =
      Number(
        multipackMatch[2]
      );


    const unit =
      multipackMatch[3];


    const normalized =
      normalizeSize(
        size,
        unit
      );


    if (normalized) {
      return {
        value:
          normalized.value *
          quantity,

        unit:
          normalized.unit,

        packQuantity:
          quantity,

        individualSize:
          normalized.value,
      };
    }
  }


  /*
   * Standard size:
   *
   * 2kg
   * 500g
   * 2L
   * 750ml
   */
  const match =
    text.match(
      /(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/
    );


  if (!match) {
    return null;
  }


  return normalizeSize(
    Number(match[1]),
    match[2]
  );
}


/*
 * ------------------------------------------------
 * Word helpers
 * ------------------------------------------------
 */

function getWords(value) {
  return normalizeText(value)
    .split(" ")
    .filter(
      word =>
        word.length > 1
    );
}


/*
 * ------------------------------------------------
 * Specific word matching
 *
 * Checks how many words from the user's
 * item name appear in the retailer product.
 *
 * Example:
 *
 * User:
 * "Brown Rice"
 *
 * Product:
 * "Tastic Wholegrain Long Grain Brown Rice 2kg"
 *
 * matchedWords:
 * ["brown", "rice"]
 *
 * missingWords:
 * []
 *
 * similarity:
 * 1
 * ------------------------------------------------
 */

function calculateSpecificWordMatch(
  expected,
  actual
) {
  const ignoredWords =
    new Set([
      "the",
      "and",
      "with",
      "of",
    ]);


  const expectedWords =
    getWords(expected)
      .filter(
        word =>
          !ignoredWords.has(
            word
          )
      );


  const actualWords =
    new Set(
      getWords(actual)
    );


  if (
    !expectedWords.length
  ) {
    return {
      similarity: 0,
      matchedWords: [],
      missingWords: [],
    };
  }


  const matchedWords =
    expectedWords.filter(
      word =>
        actualWords.has(
          word
        )
    );


  const missingWords =
    expectedWords.filter(
      word =>
        !actualWords.has(
          word
        )
    );


  return {
    similarity:
      matchedWords.length /
      expectedWords.length,

    matchedWords,

    missingWords,
  };
}


/*
 * ------------------------------------------------
 * Product variant words
 *
 * These are important product differences
 * that can materially affect the price.
 *
 * Examples:
 *
 * Bottle vs refill
 * Aerosol vs trigger
 * Bar vs liquid
 * Powder vs gel
 * ------------------------------------------------
 */

const PRODUCT_VARIANTS = [
  "bottle",
  "refill",
  "sachet",
  "pouch",
  "packet",
  "pack",
  "box",
  "can",
  "tin",
  "tub",
  "jar",

  "aerosol",
  "spray",
  "trigger",

  "roll on",
  "stick",

  "bar",
  "liquid",
  "gel",
  "powder",

  "concentrate",
];


/*
 * ------------------------------------------------
 * Extract variants from product text
 * ------------------------------------------------
 */

function extractProductVariants(
  value
) {
  const text =
    normalizeText(value);


  return PRODUCT_VARIANTS.filter(
    variant => {
      const normalizedVariant =
        normalizeText(
          variant
        );


      return text.includes(
        normalizedVariant
      );
    }
  );
}


/*
 * ------------------------------------------------
 * Score one retailer product
 * ------------------------------------------------
 */

function scoreProductMatch(
  listItem,
  product
) {
  let score = 0;

  const reasons = [];


  /*
   * ----------------------------------------------
   * Product name
   *
   * Maximum: 40 points
   * ----------------------------------------------
   */

  const nameMatch =
    calculateSpecificWordMatch(
      listItem.item_name,
      product.productName
    );


  const nameScore =
    Math.round(
      nameMatch.similarity *
      40
    );


  score += nameScore;


  reasons.push(
    `name: +${nameScore}`
  );


  /*
   * Penalise retailer products that
   * are missing words the user
   * specifically entered.
   */
  if (
    nameMatch
      .missingWords
      .length > 0
  ) {
    const penalty =
      nameMatch
        .missingWords
        .length *
      15;


    score -= penalty;


    reasons.push(
      `missing ${nameMatch.missingWords.join(", ")}: -${penalty}`
    );
  }


  /*
   * ----------------------------------------------
   * Product variant
   *
   * Important because:
   *
   * Bottle != refill
   * Aerosol != trigger
   * Bar != liquid
   *
   * Rules:
   *
   * Confirmed match:
   * +20
   *
   * Confirmed conflict:
   * -40
   *
   * Retailer does not specify variant:
   * -10
   * ----------------------------------------------
   */

  const expectedVariants =
    extractProductVariants(
      listItem.item_name
    );


  const actualVariants =
    extractProductVariants(
      product.productName
    );


  if (
    expectedVariants.length > 0
  ) {
    const matchedVariants =
      expectedVariants.filter(
        variant =>
          actualVariants.includes(
            variant
          )
      );


    /*
     * Retailer explicitly confirms
     * the requested variant.
     */
    if (
      matchedVariants.length ===
      expectedVariants.length
    ) {
      score += 20;


      reasons.push(
        "variant exact: +20"
      );
    }


    /*
     * Retailer explicitly specifies
     * another variant.
     *
     * Example:
     *
     * User: bottle
     * Retailer: refill
     */
    else if (
      actualVariants.length > 0
    ) {
      score -= 40;


      reasons.push(
        "variant mismatch: -40"
      );
    }


    /*
     * Retailer product does not
     * mention the variant.
     *
     * We cannot confirm whether it
     * is correct, so apply only a
     * small penalty.
     */
    else {
      score -= 10;


      reasons.push(
        "variant unavailable: -10"
      );
    }
  }


  /*
   * ----------------------------------------------
   * Brand
   *
   * Maximum: 30 points
   * ----------------------------------------------
   */
const expectedBrand =
  normalizeText(
    listItem.item_brand
  );


const actualBrand =
  normalizeText(
    product.brand
  );


const productName =
  normalizeText(
    product.productName
  );


if (expectedBrand) {

  // Retailer gives us an explicit
  // brand field.
  if (actualBrand) {

    if (
      actualBrand ===
      expectedBrand
    ) {
      score += 30;


      reasons.push(
        "brand exact: +30"
      );
    } else {
      score -= 20;


      reasons.push(
        "brand mismatch: -20"
      );
    }

  }

  // Retailer does not provide a
  // usable brand field, but the
  // product name explicitly contains
  // the requested brand.
  else if (
    productName
      .split(" ")
      .includes(
        expectedBrand
      )
  ) {

    score += 30;


    reasons.push(
      "brand confirmed by product name: +30"
    );

  }

  // We cannot confirm the brand.
  else {

    score -= 10;


    reasons.push(
      "brand unavailable: -10"
    );

  }
}
  /*
   * ----------------------------------------------
   * Size
   *
   * Maximum: 30 points
   *
   * Example:
   *
   * 2kg == 2000g
   * 2L  == 2000ml
   * ----------------------------------------------
   */

  const expectedSize =
    normalizeSize(
      listItem
        .item_volume_mass,

      listItem
        .item_unit
    );


  const actualSize =
    extractSizeFromName(
      product.productName
    );


  if (
    expectedSize &&
    actualSize
  ) {
    if (
      expectedSize.unit ===
      actualSize.unit
    ) {
      const difference =
        Math.abs(
          expectedSize.value -
          actualSize.value
        );


      /*
       * Allow 2% tolerance.
       */
      const tolerance =
        expectedSize.value *
        0.02;


      if (
        difference <=
        tolerance
      ) {
        score += 30;


        reasons.push(
          "size exact: +30"
        );
      } else {
        score -= 25;


        reasons.push(
          "size mismatch: -25"
        );
      }
    } else {
      score -= 25;


      reasons.push(
        "unit mismatch: -25"
      );
    }
  }


  /*
   * ----------------------------------------------
   * Missing retailer size
   *
   * If the user specifies a size,
   * but the retailer product name
   * does not include one, apply
   * a small penalty.
   * ----------------------------------------------
   */

  if (
    expectedSize &&
    !actualSize
  ) {
    score -= 10;


    reasons.push(
      "size unavailable: -10"
    );
  }


  /*
   * ----------------------------------------------
   * Stock
   *
   * Out-of-stock products should
   * almost never become the match.
   * ----------------------------------------------
   */

  if (
    product.inStock ===
    false
  ) {
    score -= 50;


    reasons.push(
      "out of stock: -50"
    );
  }


  /*
   * ----------------------------------------------
   * Return scoring information
   * ----------------------------------------------
   */

  return {
    product,

    score,

    reasons,

    nameSimilarity:
      nameMatch.similarity,

    matchedWords:
      nameMatch.matchedWords,

    missingWords:
      nameMatch.missingWords,

    expectedVariants,

    actualVariants,

    expectedSize,

    actualSize,
  };
}


/*
 * ------------------------------------------------
 * Find best retailer product
 * ------------------------------------------------
 */

function matchProduct(
  listItem,
  products,
  {
    minimumScore = 60,
  } = {}
) {

  /*
   * Invalid or empty
   * product results.
   */
  if (
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return {
      matched: false,

      match: null,

      score: 0,

      candidates: [],
    };
  }


  /*
   * Score every product.
   */
  const candidates =
    products
      .map(
        product =>
          scoreProductMatch(
            listItem,
            product
          )
      )
      .sort(
        (a, b) =>
          b.score -
          a.score
      );


  const bestMatch =
    candidates[0] ||
    null;


  /*
   * Best product did not
   * meet confidence threshold.
   */
  if (
    !bestMatch ||
    bestMatch.score <
      minimumScore
  ) {
    return {
      matched: false,

      match: null,

      score:
        bestMatch?.score ||
        0,

      reasons:
        bestMatch?.reasons ||
        [],

      candidates:
        candidates.slice(
          0,
          5
        ),
    };
  }


  /*
   * Confident product match.
   */
  return {
    matched: true,

    match:
      bestMatch.product,

    score:
      bestMatch.score,

    reasons:
      bestMatch.reasons,

    matchedWords:
      bestMatch.matchedWords,

    missingWords:
      bestMatch.missingWords,

    expectedVariants:
      bestMatch
        .expectedVariants,

    actualVariants:
      bestMatch
        .actualVariants,

    expectedSize:
      bestMatch.expectedSize,

    actualSize:
      bestMatch.actualSize,

    candidates:
      candidates.slice(
        0,
        5
      ),
  };
}


/*
 * ------------------------------------------------
 * Exports
 * ------------------------------------------------
 */

module.exports = {
  matchProduct,

  scoreProductMatch,

  calculateSpecificWordMatch,

  extractProductVariants,

  extractSizeFromName,

  normalizeSize,

  normalizeText,
};
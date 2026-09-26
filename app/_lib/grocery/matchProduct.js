/*
 * Grossary product matcher
 *
 * Matches a Grossary list item against normalized
 * retailer products.
 *
 * Important distinction:
 *
 * item_quantity = how many products / packs to buy
 *
 * item_volume_mass = the configuration of ONE
 * product being purchased.
 *
 * Examples:
 *
 * item_volume_mass = "200"
 * item_unit = "ml"
 *
 * means:
 * 1 x 200ml
 *
 *
 * item_volume_mass = "6 x 200"
 * item_unit = "ml"
 *
 * means:
 * 6 x 200ml pack
 *
 * These MUST NOT be treated as the same product.
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

  const value =
    normalizeText(unit);


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


  return (
    units[value] ||
    value
  );

}


/*
 * ------------------------------------------------
 * Normalize one individual size
 *
 * Examples:
 *
 * 2kg   -> 2000g
 * 500g  -> 500g
 *
 * 1.5L  -> 1500ml
 * 200ml -> 200ml
 * ------------------------------------------------
 */

function normalizeSize(
  value,
  unit
) {

  const number =
    Number(value);


  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {

    return null;

  }


  const normalizedUnit =
    normalizeUnit(unit);


  if (
    normalizedUnit === "kg"
  ) {

    return {

      value:
        number * 1000,

      unit:
        "g",

    };

  }


  if (
    normalizedUnit === "g"
  ) {

    return {

      value:
        number,

      unit:
        "g",

    };

  }


  if (
    normalizedUnit === "l"
  ) {

    return {

      value:
        number * 1000,

      unit:
        "ml",

    };

  }


  if (
    normalizedUnit === "ml"
  ) {

    return {

      value:
        number,

      unit:
        "ml",

    };

  }


  return {

    value:
      number,

    unit:
      normalizedUnit,

  };

}


/*
 * ------------------------------------------------
 * Parse Grossary item_volume_mass
 * ------------------------------------------------
 *
 * IMPORTANT:
 *
 * We preserve BOTH:
 *
 * - individual size
 * - pack quantity
 *
 *
 * "200" + "ml"
 *
 * becomes:
 *
 * {
 *   value: 200,
 *   individualSize: 200,
 *   packQuantity: 1,
 *   totalSize: 200,
 *   unit: "ml",
 *   isMultipack: false
 * }
 *
 *
 * "6 x 200" + "ml"
 *
 * becomes:
 *
 * {
 *   value: 1200,
 *   individualSize: 200,
 *   packQuantity: 6,
 *   totalSize: 1200,
 *   unit: "ml",
 *   isMultipack: true
 * }
 * ------------------------------------------------
 */

function parseListItemSize(
  value,
  unit
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return null;

  }


  const text =
    String(value)
      .toLowerCase()
      .replace(/×/g, "x")
      .replace(/\s+/g, " ")
      .trim();


  /*
   * ----------------------------------------------
   * Pack format:
   *
   * 6 x 200
   * 6x200
   * 6 X 200
   * ----------------------------------------------
   */

  const packMatch =
    text.match(
      /^(\d+)\s*x\s*(\d+(?:\.\d+)?)$/
    );


  if (
    packMatch
  ) {

    const packQuantity =
      Number(
        packMatch[1]
      );


    const rawIndividualSize =
      Number(
        packMatch[2]
      );


    const normalized =
      normalizeSize(
        rawIndividualSize,
        unit
      );


    if (
      !normalized
    ) {

      return null;

    }


    return {

      value:
        normalized.value *
        packQuantity,

      totalSize:
        normalized.value *
        packQuantity,

      individualSize:
        normalized.value,

      packQuantity,

      unit:
        normalized.unit,

      isMultipack:
        packQuantity > 1,

    };

  }


  /*
   * ----------------------------------------------
   * Single product
   * ----------------------------------------------
   */

  const normalized =
    normalizeSize(
      value,
      unit
    );


  if (
    !normalized
  ) {

    return null;

  }


  return {

    value:
      normalized.value,

    totalSize:
      normalized.value,

    individualSize:
      normalized.value,

    packQuantity:
      1,

    unit:
      normalized.unit,

    isMultipack:
      false,

  };

}


/*
 * ------------------------------------------------
 * Extract retailer size / pack configuration
 * ------------------------------------------------
 *
 * Supports:
 *
 * 6 x 200ml
 * 6x200ml
 *
 * 200ml x 6
 * 200ml x12
 *
 * 12 x 1.5L
 * 1.5L x 12
 *
 * Standard:
 *
 * 200ml
 * 1.5L
 * 2kg
 *
 * IMPORTANT:
 *
 * We DO NOT collapse:
 *
 * 6 x 200ml
 *
 * into only:
 *
 * 1200ml
 *
 * because Grossary must distinguish a six-pack
 * from one 1.2L product.
 * ------------------------------------------------
 */

function extractSizeFromName(
  name
) {

  const text =
    String(name || "")
      .toLowerCase()
      .replace(/×/g, "x")
      .replace(/\s+/g, " ")
      .trim();


  /*
   * ----------------------------------------------
   * Quantity first
   *
   * 6 x 200ml
   * 12 x 1.5L
   * ----------------------------------------------
   */

  const quantityFirstMatch =
    text.match(
      /(\d+)\s*x\s*(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/i
    );


  if (
    quantityFirstMatch
  ) {

    const packQuantity =
      Number(
        quantityFirstMatch[1]
      );


    const rawIndividualSize =
      Number(
        quantityFirstMatch[2]
      );


    const normalized =
      normalizeSize(
        rawIndividualSize,
        quantityFirstMatch[3]
      );


    if (
      normalized
    ) {

      return {

        value:
          normalized.value *
          packQuantity,

        totalSize:
          normalized.value *
          packQuantity,

        individualSize:
          normalized.value,

        packQuantity,

        unit:
          normalized.unit,

        isMultipack:
          packQuantity > 1,

      };

    }

  }


  /*
   * ----------------------------------------------
   * Size first
   *
   * 200ml x 6
   * 1.5L x 12
   * ----------------------------------------------
   */

  const sizeFirstMatch =
    text.match(
      /(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\s*x\s*(\d+)\b/i
    );


  if (
    sizeFirstMatch
  ) {

    const rawIndividualSize =
      Number(
        sizeFirstMatch[1]
      );


    const packQuantity =
      Number(
        sizeFirstMatch[3]
      );


    const normalized =
      normalizeSize(
        rawIndividualSize,
        sizeFirstMatch[2]
      );


    if (
      normalized
    ) {

      return {

        value:
          normalized.value *
          packQuantity,

        totalSize:
          normalized.value *
          packQuantity,

        individualSize:
          normalized.value,

        packQuantity,

        unit:
          normalized.unit,

        isMultipack:
          packQuantity > 1,

      };

    }

  }


  /*
   * ----------------------------------------------
   * Standard single size
   *
   * 200ml
   * 1.5L
   * 2kg
   * ----------------------------------------------
   */

  const standardMatch =
    text.match(
      /(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/i
    );


  if (
    !standardMatch
  ) {

    return null;

  }


  const normalized =
    normalizeSize(
      Number(
        standardMatch[1]
      ),
      standardMatch[2]
    );


  if (
    !normalized
  ) {

    return null;

  }


  return {

    value:
      normalized.value,

    totalSize:
      normalized.value,

    individualSize:
      normalized.value,

    packQuantity:
      1,

    unit:
      normalized.unit,

    isMultipack:
      false,

  };

}


/*
 * ------------------------------------------------
 * Compare sizes with tolerance
 * ------------------------------------------------
 */

function sizesMatch(
  expected,
  actual
) {

  expected =
    Number(expected);


  actual =
    Number(actual);


  if (
    !Number.isFinite(expected) ||
    !Number.isFinite(actual)
  ) {

    return false;

  }


  const difference =
    Math.abs(
      expected -
      actual
    );


  const tolerance =
    expected *
    0.02;


  return (
    difference <=
    tolerance
  );

}


/*
 * ------------------------------------------------
 * Word helpers
 * ------------------------------------------------
 */

function getWords(
  value
) {

  return normalizeText(
    value
  )
    .split(" ")
    .filter(
      word =>
        word.length > 1
    );

}


/*
 * ------------------------------------------------
 * Specific word matching
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
    getWords(
      expected
    )
      .filter(
        word =>
          !ignoredWords.has(
            word
          )
      );


  const actualWords =
    new Set(
      getWords(
        actual
      )
    );


  if (
    !expectedWords.length
  ) {

    return {

      similarity:
        0,

      matchedWords:
        [],

      missingWords:
        [],

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
 * Extract product variants
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
 * Brand phrase matching
 * ------------------------------------------------
 */

function productNameContainsBrand(
  productName,
  expectedBrand
) {

  const name =
    normalizeText(
      productName
    );


  const brand =
    normalizeText(
      expectedBrand
    );


  if (
    !name ||
    !brand
  ) {

    return false;

  }


  return (
    ` ${name} `
      .includes(
        ` ${brand} `
      )
  );

}


/*
 * ------------------------------------------------
 * Build expected product name
 * ------------------------------------------------
 *
 * Brand + item name.
 *
 * Example:
 *
 * Coca-Cola
 * +
 * Original Taste Less Sugar Soft Drink
 *
 * becomes:
 *
 * Coca-Cola Original Taste Less Sugar Soft Drink
 * ------------------------------------------------
 */

function buildExpectedProductName(
  listItem
) {

  return [

    listItem
      ?.item_brand,

    listItem
      ?.item_name,

  ]
    .filter(
      value =>
        value !== null &&
        value !== undefined &&
        String(
          value
        ).trim() !== ""
    )
    .join(" ");

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

  let score =
    0;


  const reasons =
    [];


  /*
   * ==============================================
   * PRODUCT NAME
   *
   * Maximum:
   * +40
   * ==============================================
   */

  const expectedProductName =
    buildExpectedProductName(
      listItem
    );


  const nameMatch =
    calculateSpecificWordMatch(
      expectedProductName,
      product.productName
    );


  const nameScore =
    Math.round(
      nameMatch.similarity *
      40
    );


  score +=
    nameScore;


  reasons.push(
    `name: +${nameScore}`
  );


  /*
   * ----------------------------------------------
   * Missing name words
   *
   * 5 points each.
   * Maximum penalty = 20.
   * ----------------------------------------------
   */

  if (
    nameMatch
      .missingWords
      .length > 0
  ) {

    const penalty =
      Math.min(

        nameMatch
          .missingWords
          .length *
          5,

        20

      );


    score -=
      penalty;


    reasons.push(
      `missing ${nameMatch.missingWords.join(", ")}: -${penalty}`
    );

  }


  /*
   * ==============================================
   * PRODUCT VARIANT
   * ==============================================
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
    expectedVariants.length >
    0
  ) {

    const matchedVariants =
      expectedVariants.filter(
        variant =>
          actualVariants.includes(
            variant
          )
      );


    if (
      matchedVariants.length ===
      expectedVariants.length
    ) {

      score +=
        20;


      reasons.push(
        "variant exact: +20"
      );

    }


    else if (
      actualVariants.length >
      0
    ) {

      score -=
        40;


      reasons.push(
        "variant mismatch: -40"
      );

    }


    else {

      score -=
        10;


      reasons.push(
        "variant unavailable: -10"
      );

    }

  }


  /*
   * ==============================================
   * BRAND
   *
   * Maximum:
   * +30
   * ==============================================
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


  if (
    expectedBrand
  ) {

    /*
     * Retailer explicitly provides brand.
     */

    if (
      actualBrand
    ) {

      if (
        actualBrand ===
        expectedBrand
      ) {

        score +=
          30;


        reasons.push(
          "brand exact: +30"
        );

      }

      else {

        score -=
          20;


        reasons.push(
          "brand mismatch: -20"
        );

      }

    }


    /*
     * No explicit brand field.
     *
     * Try product title.
     */

    else if (
      productNameContainsBrand(
        productName,
        expectedBrand
      )
    ) {

      score +=
        30;


      reasons.push(
        "brand confirmed by product name: +30"
      );

    }


    else {

      score -=
        10;


      reasons.push(
        "brand unavailable: -10"
      );

    }

  }


  /*
   * ==============================================
   * SIZE + PACK CONFIGURATION
   * ==============================================
   *
   * This is deliberately strict.
   *
   * Grossary:
   *
   * item_volume_mass = "200"
   * item_unit = "ml"
   *
   * means:
   *
   * 1 x 200ml
   *
   *
   * Grossary:
   *
   * item_volume_mass = "6 x 200"
   * item_unit = "ml"
   *
   * means:
   *
   * 6 x 200ml
   *
   *
   * Therefore:
   *
   * 200ml
   *
   * MUST NOT match:
   *
   * 6 x 200ml
   *
   *
   * And:
   *
   * 1.5L
   *
   * MUST NOT match:
   *
   * 1.5L x 12
   * ==============================================
   */

  const expectedSize =
    parseListItemSize(

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

    /*
     * --------------------------------------------
     * Units must represent the same measurement.
     * --------------------------------------------
     */

    if (
      expectedSize.unit !==
      actualSize.unit
    ) {

      score -=
        40;


      reasons.push(
        `unit mismatch: expected ${expectedSize.unit}, found ${actualSize.unit}: -40`
      );

    }


    else {

      /*
       * ------------------------------------------
       * Compare individual unit size FIRST.
       *
       * Example:
       *
       * expected:
       * 6 x 200ml
       *
       * actual:
       * 6 x 250ml
       *
       * Pack quantity is the same but individual
       * size is wrong.
       * ------------------------------------------
       */

      const individualSizeMatches =
        sizesMatch(

          expectedSize
            .individualSize,

          actualSize
            .individualSize

        );


      /*
       * ------------------------------------------
       * Compare pack quantity separately.
       * ------------------------------------------
       */

      const packQuantityMatches =
        expectedSize
          .packQuantity ===
        actualSize
          .packQuantity;


      /*
       * ------------------------------------------
       * PERFECT CONFIGURATION
       *
       * Examples:
       *
       * 200ml == 200ml
       *
       * 6 x 200ml == 6 x 200ml
       *
       * 1.5L == 1.5L
       *
       * 1.5L x 12 == 1.5L x 12
       * ------------------------------------------
       */

      if (
        individualSizeMatches &&
        packQuantityMatches
      ) {

        score +=
          30;


        if (
          expectedSize
            .packQuantity >
          1
        ) {

          reasons.push(
            `size and pack exact: ${expectedSize.packQuantity} x ${expectedSize.individualSize}${expectedSize.unit}: +30`
          );

        }

        else {

          reasons.push(
            "size and pack exact: +30"
          );

        }

      }


      /*
       * ------------------------------------------
       * PACK MISMATCH
       *
       * This is a STRONG mismatch.
       *
       * Examples:
       *
       * expected:
       * 1 x 1.5L
       *
       * actual:
       * 12 x 1.5L
       *
       *
       * expected:
       * 6 x 200ml
       *
       * actual:
       * 1 x 200ml
       *
       *
       * Even though the individual bottle/carton
       * size matches, these are different products.
       * ------------------------------------------
       */

      else if (
        individualSizeMatches &&
        !packQuantityMatches
      ) {

        score -=
          60;


        reasons.push(
          `pack mismatch: expected ${expectedSize.packQuantity}, found ${actualSize.packQuantity}: -60`
        );

      }


      /*
       * ------------------------------------------
       * INDIVIDUAL SIZE MISMATCH
       *
       * Examples:
       *
       * 6 x 200ml
       * vs
       * 6 x 250ml
       *
       * or
       *
       * 1.5L
       * vs
       * 2L
       * ------------------------------------------
       */

      else if (
        !individualSizeMatches
      ) {

        score -=
          40;


        reasons.push(
          `size mismatch: expected ${expectedSize.individualSize}${expectedSize.unit}, found ${actualSize.individualSize}${actualSize.unit}: -40`
        );

      }

    }

  }


  /*
   * ----------------------------------------------
   * Requested size exists but retailer size
   * cannot be determined.
   * ----------------------------------------------
   */

  if (
    expectedSize &&
    !actualSize
  ) {

    score -=
      10;


    reasons.push(
      "size unavailable: -10"
    );

  }


  /*
   * ==============================================
   * STOCK
   * ==============================================
   */

  if (
    product.inStock ===
    false
  ) {

    score -=
      50;


    reasons.push(
      "out of stock: -50"
    );

  }


  /*
   * ==============================================
   * RESULT
   * ==============================================
   */

  return {

    product,

    score,

    reasons,


    /*
     * Debugging information.
     */

    expectedProductName,

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

  if (
    !Array.isArray(
      products
    ) ||
    products.length ===
      0
  ) {

    return {

      matched:
        false,

      match:
        null,

      score:
        0,

      reasons:
        [],

      candidates:
        [],

    };

  }


  /*
   * Score every retailer candidate.
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
   * Best candidate does not meet
   * minimum confidence.
   */

  if (
    !bestMatch ||
    bestMatch.score <
      minimumScore
  ) {

    return {

      matched:
        false,

      match:
        null,

      score:
        bestMatch?.score ||
        0,

      reasons:
        bestMatch?.reasons ||
        [],

      expectedProductName:
        bestMatch
          ?.expectedProductName ||
        buildExpectedProductName(
          listItem
        ),

      expectedSize:
        bestMatch
          ?.expectedSize ||
        parseListItemSize(
          listItem
            .item_volume_mass,
          listItem
            .item_unit
        ),

      actualSize:
        bestMatch
          ?.actualSize ||
        null,

      matchedWords:
        bestMatch
          ?.matchedWords ||
        [],

      missingWords:
        bestMatch
          ?.missingWords ||
        [],

      candidates:
        candidates.slice(
          0,
          5
        ),

    };

  }


  /*
   * Confident match.
   */

  return {

    matched:
      true,

    match:
      bestMatch.product,

    score:
      bestMatch.score,

    reasons:
      bestMatch.reasons,

    expectedProductName:
      bestMatch
        .expectedProductName,

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
      bestMatch
        .expectedSize,

    actualSize:
      bestMatch
        .actualSize,

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

  parseListItemSize,

  normalizeSize,

  normalizeText,

  productNameContainsBrand,

  buildExpectedProductName,

  sizesMatch,

};
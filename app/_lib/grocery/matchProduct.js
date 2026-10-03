/*
 * Grossary product matcher
 *
 * Matches a Grossary list item against normalized
 * retailer products.
 *
 * IMPORTANT:
 *
 * item_quantity = how many products / packs to buy
 *
 * item_volume_mass = configuration of ONE
 * product being purchased.
 *
 * Examples:
 *
 * 200 + ml
 * = 1 x 200ml
 *
 * 6 x 200 + ml
 * = 6 x 200ml
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

    /*
     * Normalize SPF formatting.
     *
     * SPF50
     * SPF 50
     * SPF-50
     * SPF 50+
     *
     * all become:
     *
     * spf50
     */
    .replace(
      /\bspf[\s-]*(\d+)\+?\b/gi,
      "spf$1"
    )

    .replace(
      /[^a-z0-9\s.]/g,
      " "
    )

    .replace(
      /\s+/g,
      " "
    )

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
 * ------------------------------------------------
 *
 * 2kg   -> 2000g
 * 500g  -> 500g
 * 1.5L  -> 1500ml
 * 200ml -> 200ml
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
 * Preserve:
 *
 * - individualSize
 * - packQuantity
 * - totalSize
 *
 * "200" + "ml"
 *
 * =>
 *
 * {
 *   value: 200,
 *   totalSize: 200,
 *   individualSize: 200,
 *   packQuantity: 1,
 *   unit: "ml",
 *   isMultipack: false
 * }
 *
 * "6 x 200" + "ml"
 *
 * =>
 *
 * {
 *   value: 1200,
 *   totalSize: 1200,
 *   individualSize: 200,
 *   packQuantity: 6,
 *   unit: "ml",
 *   isMultipack: true
 * }
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
   * Multipack:
   *
   * 6 x 200
   * 6x200
   */

  const packMatch =
    text.match(
      /^(\d+)\s*x\s*(\d+(?:\.\d+)?)$/
    );

  if (packMatch) {
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

    if (!normalized) {
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
   * Single product
   */

  const normalized =
    normalizeSize(
      value,
      unit
    );

  if (!normalized) {
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
 * 6 x 200ml
 *
 * must remain different from:
 *
 * 1200ml
 */

function extractSizeFromName(name) {
  const text =
    String(name || "")
      .toLowerCase()
      .replace(/×/g, "x")
      .replace(/\s+/g, " ")
      .trim();

  /*
   * Quantity first:
   *
   * 6 x 200ml
   * 12 x 1.5L
   */

  const quantityFirstMatch =
    text.match(
      /(\d+)\s*x\s*(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/i
    );

  if (quantityFirstMatch) {
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

    if (normalized) {
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
   * Size first:
   *
   * 200ml x 6
   * 1.5L x 12
   */

  const sizeFirstMatch =
    text.match(
      /(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\s*x\s*(\d+)\b/i
    );

  if (sizeFirstMatch) {
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

    if (normalized) {
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
   * Standard single size:
   *
   * 200ml
   * 1.5L
   * 2kg
   */

  const standardMatch =
    text.match(
      /(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/i
    );

  if (!standardMatch) {
    return null;
  }

  const normalized =
    normalizeSize(
      Number(
        standardMatch[1]
      ),
      standardMatch[2]
    );

  if (!normalized) {
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
 * Compare sizes with 2% tolerance
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
    expected * 0.02;

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

function getWords(value) {
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
 * Words that do not strongly identify a product
 * ------------------------------------------------
 */

const GENERIC_PRODUCT_WORDS =
  new Set([
    "the",
    "and",
    "with",
    "of",

    "soft",
    "drink",
    "beverage",
    "beverages",

    "product",
    "products",

    "pack",
    "packs",

    "bottle",
    "bottles",

    "can",
    "cans",

    "packet",
    "packets",
  ]);


/*
 * ------------------------------------------------
 * Product form / packaging words
 * ------------------------------------------------
 *
 * These can describe the format of a product,
 * but must NOT establish product identity by
 * themselves.
 *
 * Example:
 *
 * Everysun SPF50 Sun Spray 300ml
 *
 * and
 *
 * TRESemmé Heat Defence Hair Spray 300ml
 *
 * are both:
 *
 * spray + 300ml
 *
 * but are completely different products.
 */

const PRODUCT_FORM_WORDS =
  new Set([
    "bottle",
    "bottles",

    "refill",
    "refills",

    "sachet",
    "sachets",

    "pouch",
    "pouches",

    "packet",
    "packets",

    "pack",
    "packs",

    "box",
    "boxes",

    "can",
    "cans",

    "tin",
    "tins",

    "tub",
    "tubs",

    "jar",
    "jars",

    "aerosol",
    "spray",
    "trigger",

    "roll",
    "stick",
    "bar",

    "liquid",
    "gel",
    "powder",

    "concentrate",
    "lotion",
    " moisture",
    "spf50",
    "spf30"
  ]);


/*
 * ------------------------------------------------
 * Specific word matching
 * ------------------------------------------------
 */

function calculateSpecificWordMatch(
  expected,
  actual
) {
  const expectedWords =
    getWords(
      expected
    ).filter(
      word =>
        !GENERIC_PRODUCT_WORDS.has(
          word
        )
    );

  const actualWords =
    new Set(
      getWords(
        actual
      ).filter(
        word =>
          !GENERIC_PRODUCT_WORDS.has(
            word
          )
      )
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
    ` ${name} `.includes(
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
 * Coca-Cola
 * +
 * Original Taste Soft Drink
 *
 * =
 *
 * Coca-Cola Original Taste Soft Drink
 */

function buildExpectedProductName(
  listItem
) {
  return [
    listItem?.item_brand,
    listItem?.item_name,
  ]
    .filter(
      value =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    )
    .join(" ");
}


/*
 * ------------------------------------------------
 * Explicit product identity terms
 * ------------------------------------------------
 *
 * These help protect against products that share
 * the same brand but are explicitly different.
 *
 * Example:
 *
 * Coca-Cola Original
 * must not be rescued by
 * Coca-Cola Zero Sugar
 * merely because brand and pack match.
 */

const PRODUCT_IDENTITY_TERMS = [
  "original",
  "zero sugar",
  "no sugar",
  "sugar free",
  "less sugar",
  "zero",
  "diet",
  "light",
  "blend",
];


function extractProductIdentityTerms(
  value
) {
  const text =
    ` ${normalizeText(value)} `;

  return PRODUCT_IDENTITY_TERMS.filter(
    term =>
      text.includes(
        ` ${normalizeText(term)} `
      )
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
   * ==============================================
   * PRODUCT NAME
   * ==============================================
   *
   * Maximum:
   * +40
   */

  const expectedProductName =
    buildExpectedProductName(
      listItem
    );

  const nameMatch =
    calculateSpecificWordMatch(
      expectedProductName,
      product?.productName
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
   * Missing expected words.
   *
   * 2.5 points each.
   * Maximum penalty = 10.
   */

  if (
    nameMatch.missingWords.length >
    0
  ) {
    const penalty =
      Math.min(
        nameMatch
          .missingWords
          .length *
          2.5,

        10
      );

    score -=
      penalty;

    reasons.push(
      `missing ${nameMatch.missingWords.join(
        ", "
      )}: -${penalty}`
    );
  }


  /*
   * ==============================================
   * EXPLICIT PRODUCT IDENTITY
   * ==============================================
   */

  const expectedIdentityTerms =
    extractProductIdentityTerms(
      listItem?.item_name
    );

  const actualIdentityTerms =
    extractProductIdentityTerms(
      product?.productName
    );

  if (
    expectedIdentityTerms.length > 0 &&
    actualIdentityTerms.length > 0
  ) {
    const hasIdentityMatch =
      expectedIdentityTerms.some(
        term =>
          actualIdentityTerms.includes(
            term
          )
      );

    if (!hasIdentityMatch) {
      score -= 40;

      reasons.push(
        `product identity mismatch: expected ${expectedIdentityTerms.join(
          ", "
        )}, found ${actualIdentityTerms.join(
          ", "
        )}: -40`
      );
    }
  }


  /*
   * ==============================================
   * PRODUCT VARIANT / FORM
   * ==============================================
   */

  const expectedVariants =
    extractProductVariants(
      listItem?.item_name
    );

  const actualVariants =
    extractProductVariants(
      product?.productName
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
      score += 20;

      reasons.push(
        "variant exact: +20"
      );
    }

    else if (
      actualVariants.length >
      0
    ) {
      score -= 10;

      reasons.push(
        "variant mismatch: -10"
      );
    }

    else {
      score -= 5;

      reasons.push(
        "variant unavailable: -5"
      );
    }
  }


  /*
   * ==============================================
   * BRAND
   * ==============================================
   */

  const expectedBrand =
    normalizeText(
      listItem?.item_brand
    );

  const actualBrand =
    normalizeText(
      product?.brand
    );

  const productName =
    normalizeText(
      product?.productName
    );

  let brandConfirmed =
    false;

  if (expectedBrand) {
    /*
     * Retailer explicitly provides brand.
     */

    if (actualBrand) {
      if (
        actualBrand ===
        expectedBrand
      ) {
        brandConfirmed =
          true;

        score += 30;

        reasons.push(
          "brand exact: +30"
        );
      }

      else {
        score -= 10;

        reasons.push(
          "brand mismatch: -10"
        );
      }
    }

    /*
     * No explicit brand field.
     *
     * Try retailer product title.
     */

    else if (
      productNameContainsBrand(
        productName,
        expectedBrand
      )
    ) {
      brandConfirmed =
        true;

      score += 30;

      reasons.push(
        "brand confirmed by product name: +30"
      );
    }

    else {
      score -= 5;

      reasons.push(
        "brand unavailable: -5"
      );
    }
  }


  /*
   * ==============================================
   * MEANINGFUL PRODUCT IDENTITY GATE
   * ==============================================
   *
   * This prevents size + packaging/form from
   * establishing product identity.
   *
   * Example:
   *
   * Expected:
   * Everysun SPF50 Sun Spray 300ml
   *
   * Candidate:
   * TRESemmé Heat Defence Hair Spray 300ml
   *
   * Shared:
   * spray
   * 300ml
   *
   * Those are not enough to establish identity.
   */

  const expectedBrandWords =
    new Set(
      getWords(
        listItem?.item_brand
      )
    );

  /*
   * Remove:
   *
   * - brand words
   * - generic category words
   * - packaging/form words
   *
   * from the words that are allowed to establish
   * product identity.
   */

  const meaningfulMatchedWords =
    nameMatch
      .matchedWords
      .filter(
        word =>
          !expectedBrandWords.has(
            word
          ) &&
          !GENERIC_PRODUCT_WORDS.has(
            word
          ) &&
          !PRODUCT_FORM_WORDS.has(
            word
          )
      );

  /*
   * Product identity is established when:
   *
   * 1. expected brand is confirmed
   *
   * OR
   *
   * 2. there is meaningful name overlap.
   *
   * Size and packaging alone can NEVER make this
   * true.
   */

  const identityEligible =
    brandConfirmed ||
    meaningfulMatchedWords.length >
      0;

  if (!identityEligible) {
    reasons.push(
      "product identity not established"
    );
  }


  /*
   * ==============================================
   * SIZE + PACK CONFIGURATION
   * ==============================================
   *
   * Deliberately strict.
   *
   * 200ml
   * !=
   * 6 x 200ml
   *
   * 1.5L
   * !=
   * 12 x 1.5L
   */

  const expectedSize =
    parseListItemSize(
      listItem
        ?.item_volume_mass,

      listItem
        ?.item_unit
    );

  const actualSize =
    extractSizeFromName(
      product?.productName
    );

  if (
    expectedSize &&
    actualSize
  ) {
    /*
     * Units must represent the same
     * measurement type.
     */

    if (
      expectedSize.unit !==
      actualSize.unit
    ) {
      score -= 40;

      reasons.push(
        `unit mismatch: expected ${expectedSize.unit}, found ${actualSize.unit}: -40`
      );
    }

    else {
      /*
       * Compare individual unit size.
       */

      const individualSizeMatches =
        sizesMatch(
          expectedSize
            .individualSize,

          actualSize
            .individualSize
        );

      /*
       * Compare pack quantity independently.
       */

      const packQuantityMatches =
        expectedSize
          .packQuantity ===
        actualSize
          .packQuantity;


      /*
       * ------------------------------------------
       * PERFECT SIZE + PACK
       * ------------------------------------------
       */

      if (
        individualSizeMatches &&
        packQuantityMatches
      ) {
        score += 30;

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
       * ------------------------------------------
       *
       * Strong mismatch.
       *
       * 200ml
       * !=
       * 6 x 200ml
       */

      else if (
        individualSizeMatches &&
        !packQuantityMatches
      ) {
        score -= 60;

        reasons.push(
          `pack mismatch: expected ${expectedSize.packQuantity}, found ${actualSize.packQuantity}: -60`
        );
      }


      /*
       * ------------------------------------------
       * INDIVIDUAL SIZE MISMATCH
       * ------------------------------------------
       */

      else if (
        !individualSizeMatches
      ) {
        score -= 40;

        reasons.push(
          `size mismatch: expected ${expectedSize.individualSize}${expectedSize.unit}, found ${actualSize.individualSize}${actualSize.unit}: -40`
        );
      }
    }
  }


  /*
   * Requested size exists but retailer size
   * cannot be determined.
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
   * ==============================================
   * STOCK
   * ==============================================
   */

  if (
    product?.inStock ===
    false
  ) {
    score -= 50;

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
     * Candidate eligibility is intentionally
     * separate from numerical score.
     *
     * A product may have a high numerical score
     * because size/form matches while still being
     * the wrong actual product.
     */

    identityEligible,

    brandConfirmed,

    meaningfulMatchedWords,

    /*
     * Debugging
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
    minimumScore = 50,
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
   *
   * IMPORTANT:
   *
   * Identity-eligible products ALWAYS rank ahead
   * of products whose identity could not be
   * established.
   *
   * Score is used only after that distinction.
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
        (a, b) => {
          if (
            a.identityEligible !==
            b.identityEligible
          ) {
            return a.identityEligible
              ? -1
              : 1;
          }

          return (
            b.score -
            a.score
          );
        }
      );


  const bestMatch =
    candidates[0] ||
    null;


  /*
   * Candidate must satisfy BOTH:
   *
   * 1. Product identity is established.
   *
   * 2. Numerical score reaches minimumScore.
   */

  if (
    !bestMatch ||
    !bestMatch.identityEligible ||
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
            ?.item_volume_mass,

          listItem
            ?.item_unit
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

      identityEligible:
        bestMatch
          ?.identityEligible ??
        false,

      brandConfirmed:
        bestMatch
          ?.brandConfirmed ??
        false,

      meaningfulMatchedWords:
        bestMatch
          ?.meaningfulMatchedWords ||
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
      bestMatch
        .matchedWords,

    missingWords:
      bestMatch
        .missingWords,

    identityEligible:
      bestMatch
        .identityEligible,

    brandConfirmed:
      bestMatch
        .brandConfirmed,

    meaningfulMatchedWords:
      bestMatch
        .meaningfulMatchedWords,

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
        10
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

  extractProductIdentityTerms,
};
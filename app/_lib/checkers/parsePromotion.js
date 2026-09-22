// lib/checkers/parsePromotion.js

function cleanText(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}


/**
 * Parse simple Checkers promotions.
 *
 * Currently supports:
 *
 * SAVE R10
 * SAVE R15
 * etc.
 *
 * Example:
 *
 * SAVE R10 4999200g each Kiri Medium Fat Cream Cheese
 *
 * becomes:
 *
 * {
 *   productName: "Kiri Medium Fat Cream Cheese",
 *   price: 49.99,
 *   sizeValue: 200,
 *   sizeUnit: "g",
 *   promotionalSavings: 10
 * }
 */
function parsePromotionText(text) {
  const cleanedText =
    cleanText(text);

  const products = [];

  /*
    Split the page around each SAVE Rxx.

    This gives us individual promotion
    sections instead of trying to parse
    the entire page at once.
  */

  const sections =
    cleanedText.split(
      /(?=SAVE\s+R\s?\d+(?:\.\d{1,2})?)/gi
    );

  for (const section of sections) {
    const match =
      section.match(
        /^SAVE\s+R\s?(\d+(?:\.\d{1,2})?)\s+(.+)$/i
      );

    if (!match) {
      continue;
    }

    const promotionalSavings =
      Number(match[1]);

    const productText =
      match[2].trim();

    /*
      Try to identify the price + size.

      Checkers sometimes removes spaces
      between these values.

      Example:

      4999200g

      means:

      49.99
      200g
    */

    const priceSizeMatch =
      productText.match(
        /^(\d{2,3})(\d{2})(\d+(?:\.\d+)?)(g|kg|ml|l)\b\s*(.*)$/i
      );

    if (!priceSizeMatch) {
      continue;
    }

    const priceWhole =
      priceSizeMatch[1];

    const priceDecimal =
      priceSizeMatch[2];

    const sizeValue =
      Number(priceSizeMatch[3]);

    const sizeUnit =
      priceSizeMatch[4];

    let productName =
      priceSizeMatch[5];

    /*
      Remove common packaging words
      from the beginning/end.
    */

    productName =
      productName
        .replace(
          /^(each|per pack)\s+/i,
          ""
        )
        .trim();

    if (!productName) {
      continue;
    }

    const price =
      Number(
        `${priceWhole}.${priceDecimal}`
      );

    products.push({
      productName,
      price,
      sizeValue,
      sizeUnit: sizeUnit.toLowerCase(),
      promotionalSavings,
      isPromotion: true,
    });
  }

  return products;
}


module.exports = {
  parsePromotionText,
};
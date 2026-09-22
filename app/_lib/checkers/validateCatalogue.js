const VALID_PROMOTION_TYPES = [
  "SAVE_AMOUNT",
  "PERCENTAGE_OFF",
  "MULTI_BUY",
  "BUY_X_GET_Y",
  "OTHER",
];


function validateCatalogueProducts(
  products
) {
  const valid = [];
  const rejected = [];

  for (const product of products) {
    const reasons = [];

    if (
      !product.productName ||
      typeof product.productName !==
        "string"
    ) {
      reasons.push(
        "Missing product name"
      );
    }

    if (
      typeof product.price !==
        "number" ||
      product.price <= 0
    ) {
      reasons.push(
        "Invalid price"
      );
    }

    if (
      !VALID_PROMOTION_TYPES.includes(
        product.promotionType
      )
    ) {
      reasons.push(
        "Invalid promotion type"
      );
    }

    if (
      !product.promotionText ||
      typeof product.promotionText !==
        "string"
    ) {
      reasons.push(
        "Missing promotion text"
      );
    }

    if (
      product.promotionalSavings !=
        null &&
      (
        typeof product.promotionalSavings !==
          "number" ||
        product.promotionalSavings < 0
      )
    ) {
      reasons.push(
        "Invalid promotional savings"
      );
    }

    if (
      product.sizeValue != null &&
      (
        typeof product.sizeValue !==
          "number" ||
        product.sizeValue <= 0
      )
    ) {
      reasons.push(
        "Invalid size"
      );
    }

    if (
      product.packQuantity != null &&
      (
        typeof product.packQuantity !==
          "number" ||
        product.packQuantity <= 0
      )
    ) {
      reasons.push(
        "Invalid pack quantity"
      );
    }

    /*
      For now, don't automatically
      accept low-confidence records.
    */

    if (
      product.confidence === "low"
    ) {
      reasons.push(
        "Low extraction confidence"
      );
    }

    if (reasons.length > 0) {
      rejected.push({
        product,
        reasons,
      });

      continue;
    }

    valid.push(product);
  }

  return {
    valid,
    rejected,
  };
}


module.exports = {
  validateCatalogueProducts,
};
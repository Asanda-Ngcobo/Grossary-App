function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getActivePromotion(product) {
  const promotions = Array.isArray(product?.promotions)
    ? product.promotions
    : [];

  const now = Date.now();

  return promotions.find((promotion) => {
    const startsAt = promotion?.starts_at
      ? new Date(promotion.starts_at).getTime()
      : toNumber(promotion?.starts);

    const endsAt = promotion?.ends_at
      ? new Date(promotion.ends_at).getTime()
      : toNumber(promotion?.ends);

    if (Number.isFinite(startsAt) && now < startsAt) return false;
    if (Number.isFinite(endsAt) && now > endsAt) return false;

    return true;
  }) || null;
}

function normalizeMechanic(promotion, product) {
  const type = String(
    promotion?.discount_type ||
    promotion?.kind ||
    ""
  ).toLowerCase();

  const text = String(
    promotion?.text ||
    product?.member_price_text ||
    ""
  ).toLowerCase();

  if (
    type.includes("multi") ||
    product?.multi_buy
  ) {
    return "MULTIBUY";
  }

  if (
    type.includes("percentage") ||
    /\bsave\s*\d+(?:[.,]\d+)?\s*%/.test(text)
  ) {
    return "PERCENTAGE_DISCOUNT";
  }

  if (
    type === "fixed_discount" ||
    type === "fixed_price" ||
    type === "price" ||
    product?.member_price != null
  ) {
    return "FIXED_PRICE";
  }

  return promotion ? "UNKNOWN" : null;
}

function normalizeReefCheckersProduct(product) {
  if (!product) return null;

  const price = toNumber(product.price);
  const memberPrice = toNumber(product.member_price);
  const originalPrice = toNumber(product.original_price);
  const promotions = Array.isArray(product.promotions)
    ? product.promotions
    : [];

  const activePromotion = getActivePromotion(product);
  const promotion = activePromotion || promotions[0] || null;
  const promotionMechanic = normalizeMechanic(promotion, product);

  const loyaltyPrice =
    memberPrice !== null && price !== null && memberPrice < price
      ? memberPrice
      : null;

  const requiresLoyaltyCard = Boolean(
    promotions.some((entry) => entry?.card_required === true) ||
    promotion?.card_required === true
  );

  const promotionEndsAt =
    product.member_price_ends_at ||
    promotion?.ends_at ||
    (promotion?.ends
      ? new Date(Number(promotion.ends)).toISOString()
      : null);

  const promotionStartsAt =
    promotion?.starts_at ||
    (promotion?.starts
      ? new Date(Number(promotion.starts)).toISOString()
      : null);

  const multiBuy = product.multi_buy || null;

  let promotionQuantity = null;
  let promotionBundlePrice = null;

  if (multiBuy && typeof multiBuy === "object") {
    promotionQuantity = toNumber(
      multiBuy.quantity || multiBuy.required_quantity
    );
    promotionBundlePrice = toNumber(
      multiBuy.deal_price || multiBuy.bundle_price || multiBuy.price
    );
  }

  if (promotion?.quantity != null) {
    promotionQuantity = toNumber(promotion.quantity);
  }

  if (promotion?.deal_price != null) {
    promotionBundlePrice = toNumber(promotion.deal_price);
  }

  const promotionalSavings =
    originalPrice !== null && price !== null && originalPrice > price
      ? Number((originalPrice - price).toFixed(2))
      : 0;

  return {
    source: "reef_checkers",
    retailer: "Checkers",

    providerProductId: product.product_id || null,
    providerStoreId: product.store_id || null,
    articleNumber: product.article_number || null,

    productName: product.title || null,
    brand: product.brand || null,

    barcode: Array.isArray(product.barcodes)
      ? product.barcodes[0] || null
      : null,
    barcodes: Array.isArray(product.barcodes)
      ? product.barcodes
      : [],

    price,
    regularPrice: price,
    originalPrice,
    loyaltyPrice,
    memberPrice,
    memberPriceProgram: product.member_price_program || null,
    memberPriceText: product.member_price_text || null,
    promotionalSavings,
    isPromotion: Boolean(
      promotions.length > 0 ||
      (loyaltyPrice !== null) ||
      promotionalSavings > 0
    ),

    loyaltySavings: 0,
    requiresLoyaltyCard,
    promotionType: promotion?.kind || null,
    promotionCode: promotion?.promotion_code || null,
    promotionMessage:
      promotion?.text ||
      product.member_price_text ||
      null,
    promotionMechanic,
    promotionQuantity,
    promotionBundlePrice,
    promotionUnitPrice: loyaltyPrice,
    promotionDiscountPercentage:
      toNumber(promotion?.discount_percentage) ||
      toNumber(promotion?.percentage) ||
      null,
    promotionStartsAt,
    promotionEndsAt,

    inStock:
      typeof product.in_stock === "boolean"
        ? product.in_stock
        : null,
    stockOnHand: toNumber(product.stock_on_hand),
    maxPerOrder: toNumber(product.max_per_order),

    unitOfMeasure: product.unit_of_measure || null,
    priceUnit: product.price_unit || null,
    packQuantity: toNumber(product.pack_quantity),
    weightRangeG: product.weight_range_g || null,

    imageUrl:
      product.image ||
      (Array.isArray(product.images) ? product.images[0] : null),
    images: Array.isArray(product.images) ? product.images : [],
    productUrl: product.url || null,

    categories: Array.isArray(product.categories)
      ? product.categories
      : [],
    serviceOption: product.service_option || null,
    memberPriceEndsAt: product.member_price_ends_at || null,

    promotions,
    raw: product,
  };
}

function normalizeReefCheckersProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.map(normalizeReefCheckersProduct).filter(Boolean);
}

function extractReefCheckersProducts(response) {
  const products = response?.data?.products;
  return Array.isArray(products) ? products : [];
}

module.exports = {
  toNumber,
  getActivePromotion,
  normalizeMechanic,
  normalizeReefCheckersProduct,
  normalizeReefCheckersProducts,
  extractReefCheckersProducts,
};

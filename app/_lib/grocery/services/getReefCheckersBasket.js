const {
  searchReefCheckersProducts,
} = require("../providers/reefCheckers");

const {
  normalizeReefCheckersProducts,
  extractReefCheckersProducts,
} = require("../normalizers/reefCheckers");

const { matchProduct } = require("../matchProduct");

const {
  getFreshCachedProducts,
  saveProductsToCache,
} = require("./productPriceCache");

function buildReefCheckersSearchQuery(item) {
  return [
    item?.item_brand,
    item?.item_name,
    item?.item_volume_mass,
    item?.item_unit,
  ]
    .filter((value) =>
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    )
    .join(" ");
}

function getQuantity(item) {
  const quantity = Number(item?.item_quantity);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function isPromotionActive(product) {
  if (!product) return false;

  const now = Date.now();
  const start = product.promotionStartsAt
    ? new Date(product.promotionStartsAt).getTime()
    : null;
  const end = product.promotionEndsAt
    ? new Date(product.promotionEndsAt).getTime()
    : null;

  if (Number.isFinite(start) && now < start) return false;
  if (Number.isFinite(end) && now > end) return false;

  return true;
}

function canUseLoyaltyPricing(product, { useLoyaltyPricing = true } = {}) {
  if (!useLoyaltyPricing) return false;
  if (!product?.loyaltyPrice || product.loyaltyPrice <= 0) return false;
  if (!isPromotionActive(product)) return false;
  return true;
}

function calculateReefCheckersProductPricing(
  product,
  quantity,
  { useLoyaltyPricing = true } = {}
) {
  const normalUnitPrice = Number(product?.price);
  if (!Number.isFinite(normalUnitPrice) || normalUnitPrice < 0) return null;

  const safeQuantity =
    Number.isFinite(Number(quantity)) && Number(quantity) > 0
      ? Number(quantity)
      : 1;

  const normalTotal = normalUnitPrice * safeQuantity;
  const loyaltyAllowed = canUseLoyaltyPricing(product, {
    useLoyaltyPricing,
  });

  const mechanic = product?.promotionMechanic;
  const promotionQuantity = Math.max(
    1,
    Number(product?.promotionQuantity) || 1
  );
  const bundlePrice = Number(product?.promotionBundlePrice);

  // Apply bundle pricing only when ReefAPI provides a structured bundle.
  if (
    loyaltyAllowed &&
    mechanic === "MULTIBUY" &&
    promotionQuantity > 1 &&
    Number.isFinite(bundlePrice) &&
    bundlePrice > 0
  ) {
    const bundles = Math.floor(safeQuantity / promotionQuantity);
    const remaining = safeQuantity % promotionQuantity;

    if (bundles > 0) {
      const lineTotal =
        bundles * bundlePrice + remaining * normalUnitPrice;
      const loyaltySavings = Math.max(0, normalTotal - lineTotal);

      return {
        normalUnitPrice,
        normalTotal: Number(normalTotal.toFixed(2)),
        unitPrice: normalUnitPrice,
        lineTotal: Number(lineTotal.toFixed(2)),
        promotionalSavings: Number(
          (Number(product.promotionalSavings) * safeQuantity).toFixed(2)
        ),
        loyaltySavings: Number(loyaltySavings.toFixed(2)),
        loyaltyApplied: loyaltySavings > 0,
        promotionMechanic: mechanic,
        promotionQuantity,
        promotionBundlePrice: bundlePrice,
        promotionDiscountPercentage: null,
        qualifyingBundles: bundles,
        remainingQuantity: remaining,
      };
    }
  }

  if (loyaltyAllowed) {
    const loyaltyUnitPrice = Number(product.loyaltyPrice);
    const lineTotal = loyaltyUnitPrice * safeQuantity;
    const loyaltySavings = Math.max(0, normalTotal - lineTotal);

    return {
      normalUnitPrice,
      normalTotal: Number(normalTotal.toFixed(2)),
      unitPrice: loyaltyUnitPrice,
      lineTotal: Number(lineTotal.toFixed(2)),
      promotionalSavings: Number(
        (Number(product.promotionalSavings) * safeQuantity).toFixed(2)
      ),
      loyaltySavings: Number(loyaltySavings.toFixed(2)),
      loyaltyApplied: loyaltySavings > 0,
      promotionMechanic: mechanic || "FIXED_PRICE",
      promotionQuantity: 1,
      promotionBundlePrice: null,
      promotionDiscountPercentage:
        product.promotionDiscountPercentage ?? null,
      qualifyingBundles: safeQuantity,
      remainingQuantity: 0,
    };
  }

  return {
    normalUnitPrice,
    normalTotal: Number(normalTotal.toFixed(2)),
    unitPrice: normalUnitPrice,
    lineTotal: Number(normalTotal.toFixed(2)),
    promotionalSavings: Number(
      (Number(product.promotionalSavings) * safeQuantity).toFixed(2)
    ),
    loyaltySavings: 0,
    loyaltyApplied: false,
    promotionMechanic: mechanic || null,
    promotionQuantity: product.promotionQuantity ?? null,
    promotionBundlePrice: product.promotionBundlePrice ?? null,
    promotionDiscountPercentage:
      product.promotionDiscountPercentage ?? null,
    qualifyingBundles: 0,
    remainingQuantity: safeQuantity,
  };
}

function buildUnmatchedResult({
  item,
  storeId,
  searchQuery,
  matchResult,
  priceSource,
  reasons,
}) {
  return {
    retailer: "Checkers",
    storeId: storeId || null,
    matched: false,
    requestedItem: item,
    searchQuery,
    product: null,
    score: matchResult?.score || 0,
    reasons: reasons || matchResult?.reasons || [],
    quantity: getQuantity(item),
    unitPrice: null,
    normalUnitPrice: null,
    normalTotal: null,
    lineTotal: null,
    promotionalSavings: 0,
    loyaltySavings: 0,
    loyaltyApplied: false,
    promotionMechanic: null,
    promotionQuantity: null,
    promotionBundlePrice: null,
    promotionDiscountPercentage: null,
    qualifyingBundles: 0,
    remainingQuantity: getQuantity(item),
    priceSource,
    candidates: matchResult?.candidates || [],
  };
}

function buildMatchedResult({
  item,
  storeId,
  searchQuery,
  matchResult,
  priceSource,
  useLoyaltyPricing = true,
}) {
  const product = matchResult.match;
  const quantity = getQuantity(item);
  const pricing = calculateReefCheckersProductPricing(
    product,
    quantity,
    { useLoyaltyPricing }
  );

  if (!pricing) {
    return buildUnmatchedResult({
      item,
      storeId,
      searchQuery,
      matchResult,
      priceSource,
      reasons: [...(matchResult.reasons || []), "invalid price"],
    });
  }

  return {
    retailer: "Checkers",
    storeId: storeId || product.providerStoreId || null,
    matched: true,
    requestedItem: item,
    searchQuery,
    product,
    score: matchResult.score,
    reasons: matchResult.reasons || [],
    quantity,
    unitPrice: pricing.unitPrice,
    lineTotal: pricing.lineTotal,
    normalUnitPrice: pricing.normalUnitPrice,
    normalTotal: pricing.normalTotal,
    promotionalSavings: pricing.promotionalSavings,
    loyaltySavings: pricing.loyaltySavings,
    loyaltyApplied: pricing.loyaltyApplied,
    promotionMechanic: pricing.promotionMechanic,
    promotionQuantity: pricing.promotionQuantity,
    promotionBundlePrice: pricing.promotionBundlePrice,
    promotionDiscountPercentage: pricing.promotionDiscountPercentage,
    qualifyingBundles: pricing.qualifyingBundles,
    remainingQuantity: pricing.remainingQuantity,
    priceSource,
    candidates: matchResult.candidates || [],
  };
}

async function getReefCheckersBasketItem(
  item,
  {
    latitude,
    longitude,
    cachedProducts = [],
    useLoyaltyPricing = true,
    pageSize = 20,
  } = {}
) {
  if (latitude == null || longitude == null) {
    throw new Error("Latitude and longitude are required for ReefAPI Checkers.");
  }

  const searchQuery = buildReefCheckersSearchQuery(item);

  // Reuse the same matcher and normalised cache records as the Parse provider.
  const cacheMatch = matchProduct(item, cachedProducts);

  if (cacheMatch.matched && cacheMatch.match) {
    return buildMatchedResult({
      item,
      storeId: cacheMatch.match.providerStoreId,
      searchQuery,
      matchResult: cacheMatch,
      priceSource: "cache",
      useLoyaltyPricing,
    });
  }

  const response = await searchReefCheckersProducts(searchQuery, {
    latitude,
    longitude,
    page: 1,
    pageSize,
  });

  const rawProducts = extractReefCheckersProducts(response);
  const normalizedProducts = normalizeReefCheckersProducts(rawProducts);

  // Attach location/store context returned by ReefAPI without inventing a branch.
  const matched = matchProduct(item, normalizedProducts);

  if (!matched.matched || !matched.match) {
    return buildUnmatchedResult({
      item,
      storeId: null,
      searchQuery,
      matchResult: matched,
      priceSource: "api",
    });
  }

  const product = matched.match;

  // Save the matched product under the actual store ID returned for that product.
  if (product.providerStoreId) {
    try {
      await saveProductsToCache({
        retailer: "Checkers",
        storeId: product.providerStoreId,
        products: [product],
      });
    } catch (error) {
      console.error(
        "ReefAPI Checkers cache save failed:",
        error.message
      );
    }
  }

  // Add the newly fetched match to the in-memory basket cache to avoid
  // another search for a duplicate item during this basket run.
  const existingIndex = cachedProducts.findIndex(
    (entry) =>
      String(entry?.providerProductId || "") ===
        String(product.providerProductId || "") &&
      String(entry?.providerStoreId || "") ===
        String(product.providerStoreId || "")
  );

  if (existingIndex >= 0) {
    cachedProducts[existingIndex] = product;
  } else {
    cachedProducts.push(product);
  }

  return buildMatchedResult({
    item,
    storeId: product.providerStoreId,
    searchQuery,
    matchResult: matched,
    priceSource: "api",
    useLoyaltyPricing,
  });
}

async function getReefCheckersBasket(
  items,
  {
    latitude,
    longitude,
    useLoyaltyPricing = true,
    pageSize = 20,
    storeId = null,
     useSupabaseCache = false,
  } = {}
) {
  if (!Array.isArray(items)) {
    throw new Error("Checkers basket items must be an array.");
  }

  if (latitude == null || longitude == null) {
    throw new Error("Latitude and longitude are required for ReefAPI Checkers.");
  }

let cachedProducts = [];

if (useSupabaseCache && storeId) {
  try {
    cachedProducts = await getFreshCachedProducts({
      retailer: "Checkers",
      storeId,
    });
  } catch (error) {
    console.error(
      "ReefAPI Checkers cache lookup failed:",
      error.message
    );
  }
}

  // A ReefAPI store ID is optional at the start because search is coordinate-based.
  // When supplied, use the existing store-scoped freshness policy.
  if (storeId) {
    try {
      cachedProducts = await getFreshCachedProducts({
        retailer: "Checkers",
        storeId,
      });
    } catch (error) {
      console.error("ReefAPI Checkers cache lookup failed:", error.message);
    }
  }

  const results = [];

  // Keep sequential processing so a product fetched earlier in the basket
  // can be reused for a later duplicate. This also avoids request bursts.
  for (const item of items) {
    try {
      const result = await getReefCheckersBasketItem(item, {
        latitude,
        longitude,
        cachedProducts,
        useLoyaltyPricing,
        pageSize,
      });

      results.push(result);
    } catch (error) {
      console.error(
        `ReefAPI Checkers search failed for "${buildReefCheckersSearchQuery(item)}":`,
        error.message
      );

      results.push(
        buildUnmatchedResult({
          item,
          storeId,
          searchQuery: buildReefCheckersSearchQuery(item),
          priceSource: "error",
          reasons: [`search failed: ${error.message}`],
        })
      );
    }
  }

  const matched = results.filter((result) => result.matched);
  const unmatched = results.filter((result) => !result.matched);

  const sum = (key) =>
    matched.reduce((total, result) => total + (result[key] || 0), 0);

  const total = sum("lineTotal");
  const normalTotal = sum("normalTotal");
  const promotionalSavings = sum("promotionalSavings");
  const loyaltySavings = sum("loyaltySavings");

  const cacheHits = results.filter(
    (result) => result.priceSource === "cache"
  ).length;
  const apiResults = results.filter(
    (result) => result.priceSource === "api"
  ).length;
  const failedResults = results.filter(
    (result) => result.priceSource === "error"
  ).length;

  return {
    retailer: "Checkers",
    storeId: storeId || null,
    location: { latitude, longitude },
    items: results,
    matched,
    unmatched,
    total: Number(total.toFixed(2)),
    normalTotal: Number(normalTotal.toFixed(2)),
    promotionalSavings: Number(promotionalSavings.toFixed(2)),
    loyaltySavings: Number(loyaltySavings.toFixed(2)),
    itemCount: results.length,
    matchedCount: matched.length,
    unmatchedCount: unmatched.length,
    complete: unmatched.length === 0,
    cacheStats: {
      freshProductsLoaded: cachedProducts.length,
      cacheHits,
      apiResults,
      failedResults,
      bonusBuysResolved: 0,
      bonusBuyRequests: 0,
    },
  };
}

module.exports = {
  buildReefCheckersSearchQuery,
  getQuantity,
  isPromotionActive,
  canUseLoyaltyPricing,
  calculateReefCheckersProductPricing,
  getReefCheckersBasketItem,
  getReefCheckersBasket,
};

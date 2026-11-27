const BASE_URL = "https://api.reefapi.com/checkers/v1";

async function reefRequest(endpoint, body) {
  const apiKey = process.env.REEF_API_KEY;

  if (!apiKey) {
    throw new Error("REEF_API_KEY is missing.");
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.ok) {
    const message =
      result?.error?.message ||
      result?.error ||
      result?.message ||
      `ReefAPI Checkers ${endpoint} failed (${response.status}).`;

    throw new Error(
      typeof message === "string" ? message : JSON.stringify(message)
    );
  }

  return result;
}

/*
 * Search Checkers products near a delivery location.
 * ReefAPI uses coordinates rather than Parse.bot store IDs.
 */
async function searchReefCheckersProducts(
  query,
  {
    latitude,
    longitude,
    page = 1,
    pageSize = 20,
  } = {}
) {
  if (!query || !String(query).trim()) {
    throw new Error("Checkers product query is required.");
  }

  if (
    latitude === undefined ||
    latitude === null ||
    longitude === undefined ||
    longitude === null
  ) {
    throw new Error(
      "Latitude and longitude are required for ReefAPI Checkers search."
    );
  }

  return reefRequest("search", {
    query: String(query).trim(),
    page,
    page_size: pageSize,
    latitude: Number(latitude),
    longitude: Number(longitude),
  });
}

/*
 * Retrieve full details for one ReefAPI product ID.
 * Product IDs must come from ReefAPI search results.
 */
async function getReefCheckersProductDetails(
  productId,
  {
    latitude,
    longitude,
    site = "checkers",
  } = {}
) {
  if (!productId) {
    throw new Error("ReefAPI Checkers productId is required.");
  }

  return reefRequest("product", {
    product_id: productId,
    ...(latitude != null && longitude != null
      ? {
          latitude: Number(latitude),
          longitude: Number(longitude),
        }
      : {}),
    site,
  });
}

/*
 * Retrieve Checkers promotions for a delivery location.
 */
async function getReefCheckersPromotions({
  latitude,
  longitude,
} = {}) {
  if (latitude == null || longitude == null) {
    throw new Error(
      "Latitude and longitude are required for Checkers promotions."
    );
  }

  return reefRequest("promotions", {
    latitude: Number(latitude),
    longitude: Number(longitude),
  });
}

/*
 * Find nearby Checkers / Shoprite delivery stores.
 */
async function findReefCheckersStores(
  latitude,
  longitude,
  {
    radiusKm = 10,
    limit = 12,
    site = "checkers",
  } = {}
) {
  if (latitude == null || longitude == null) {
    throw new Error(
      "Latitude and longitude are required to find Checkers stores."
    );
  }

  return reefRequest("stores", {
    latitude: Number(latitude),
    longitude: Number(longitude),
    radius_km: radiusKm,
    limit,
    site,
  });
}

module.exports = {
  searchReefCheckersProducts,
  getReefCheckersProductDetails,
  getReefCheckersPromotions,
  findReefCheckersStores,
};

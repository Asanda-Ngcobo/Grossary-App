const BASE_URL =
  "https://api.parse.bot/scraper/91f2a48d-be1d-4ad8-bf5b-eb538c37d4db";


async function parseRequest(
  endpoint,
  {
    method = "GET",
    body = null,
    params = {},
  } = {}
) {
  const apiKey =
    process.env.PARSE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "PARSE_API_KEY is missing."
    );
  }


  const url =
    new URL(
      `${BASE_URL}/${endpoint}`
    );


  for (
    const [key, value]
    of Object.entries(params)
  ) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      url.searchParams.set(
        key,
        String(value)
      );
    }
  }


  const options = {
    method,

    headers: {
      "X-API-Key": apiKey,
      Accept: "application/json",
    },

    cache: "no-store",
  };


  if (body) {
    options.headers[
      "Content-Type"
    ] = "application/json";

    options.body =
      JSON.stringify(body);
  }


  const response =
    await fetch(
      url.toString(),
      options
    );


  if (!response.ok) {
    const errorBody =
      await response.text();

    throw new Error(
      `Parse Checkers API ${response.status}: ${errorBody}`
    );
  }


  return response.json();
}


/*
 * Generic product search
 */
async function searchCheckersProducts(
  query,
  {
    page = 0,
    limit = 10,
  } = {}
) {
  return parseRequest(
    "search_products",
    {
      method: "POST",

      body: {
        query,
        page,
        limit,
      },
    }
  );
}


/*
 * Store-specific product search
 */
async function searchCheckersStoreProducts(
  query,
  storeId,
  {
    page = 0,
    limit = 20,
  } = {}
) {
  if (!query) {
    throw new Error(
      "Checkers product query is required."
    );
  }


  if (!storeId) {
    throw new Error(
      "Checkers storeId is required."
    );
  }


  return parseRequest(
    "search_store_products",
    {
      method: "GET",

      params: {
        query,
        store_id: storeId,
        page,
        limit,
      },
    }
  );
}


/*
 * Find nearby Checkers stores
 */
async function findCheckersStores(
  latitude,
  longitude
) {
  return parseRequest(
    "find_stores",
    {
      method: "POST",

      body: {
        lat: latitude,
        lng: longitude,
      },
    }
  );
}


module.exports = {
  searchCheckersProducts,
  searchCheckersStoreProducts,
  findCheckersStores,
};
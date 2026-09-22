const BASE_URL =
  "https://api.parse.bot/scraper/b87810bc-903f-41b8-b38d-c5c911cab324";


function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}


async function parseRequest(
  endpoint,
  {
    params = {},
    retries = 2,
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


  for (
    let attempt = 0;
    attempt <= retries;
    attempt++
  ) {

    try {

      const response =
        await fetch(
          url.toString(),
          {
            method: "GET",

            headers: {
              "X-API-Key":
                apiKey,

              Accept:
                "application/json",
            },

            cache:
              "no-store",

            signal:
              AbortSignal.timeout(
                30000
              ),
          }
        );


      if (!response.ok) {

        const errorBody =
          await response.text();

        throw new Error(
          `Parse PnP API ${response.status}: ${errorBody}`
        );

      }


      return response.json();

    } catch (error) {

      if (
        attempt === retries
      ) {
        throw error;
      }


      console.warn(
        `Parse PnP request failed. Retrying ${attempt + 1}/${retries}...`
      );


      await sleep(
        2000 *
        (attempt + 1)
      );

    }

  }

}


/*
 * Existing generic product search
 */
async function searchPnpProducts(
  query,
  {
    page = 0,
    pageSize = 20,
    sort = "relevance",
    filters = null,
  } = {}
) {

  return parseRequest(
    "search_products",
    {
      params: {
        query,
        page,
        page_size:
          pageSize,
        sort,
        filters,
      },
    }
  );

}


/*
 * NEW:
 * Store-specific product search
 */
async function searchPnpStoreProducts(
  query,
  storeId,
  {
    page = 0,
    pageSize = 20,
  } = {}
) {

  if (!query) {
    throw new Error(
      "PnP product query is required."
    );
  }


  if (!storeId) {
    throw new Error(
      "PnP storeId is required."
    );
  }


  return parseRequest(
    "search_store_products",
    {
      params: {
        query,
        store_id:
          storeId,
        page,
        page_size:
          pageSize,
      },
    }
  );

}


/*
 * Existing store search
 */
async function getPnpStores(
  query = null
) {

  return parseRequest(
    "get_stores",
    {
      params: {
        query,
      },
    }
  );

}


module.exports = {
  searchPnpProducts,
  searchPnpStoreProducts,
  getPnpStores,
};

async function searchReefProducts(
  query,
  {
    latitude,
    longitude,
    page = 1,
    pageSize = 20,
  } = {}
) {
  if (!query) {
    throw new Error(
      "Checkers product search query is required."
    );
  }

  const apiKey =
    process.env.REEF_API_KEY;

  if (!apiKey) {
    throw new Error(
      "REEF_API_KEY is missing."
    );
  }

  const response = await fetch(
    "https://api.reefapi.com/checkers/v1/search",
    {
      method: "POST",

      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify({
        query,

        page,

        page_size: pageSize,

        ...(latitude != null && longitude != null
          ? {
              latitude,
              longitude,
            }
          : {}),
      }),
    }
  );

  const result =
    await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      result.error?.message ||
      result.error ||
      `ReefAPI search failed: ${response.status}`
    );
  }

  return result;
}

module.exports = {
  searchReefProducts,
};

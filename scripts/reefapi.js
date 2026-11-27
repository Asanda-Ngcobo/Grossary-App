
async function getProduct({
  productId,
  latitude,
  longitude,
  site = "checkers",
}) {
  if (!productId) {
    throw new Error(
      "A Checkers product ID is required."
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
    "https://api.reefapi.com/checkers/v1/product",
    {
      method: "POST",

      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify({
        product_id: productId,

        ...(latitude != null && longitude != null
          ? {
              latitude,
              longitude,
            }
          : {}),

        site,
      }),
    }
  );

  const result =
    await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      result.error?.message ||
      result.error ||
      `ReefAPI error: ${response.status}`
    );
  }

  return result;
}

module.exports = {
  getProduct,
};


async function fetchPromotion(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Checkers promotion: ${response.status}`
    );
  }

  const html = await response.text();

  return html;
}

module.exports = {
  fetchPromotion,
};
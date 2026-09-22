// app/_lib/checkers/findFlippingBookPages.js

function getPublicationRoot(catalogueUrl) {
  const url = new URL(catalogueUrl);

  url.pathname = url.pathname.replace(
    /index\.html?$/i,
    ""
  );

  url.search = "";
  url.hash = "";

  return url.href;
}


function extractDynamicFolder(html) {
  const match = html.match(
    /FBInit\.DYNAMIC_FOLDER\s*=\s*["']([^"']+)["']/
  );

  return match ? match[1] : null;
}


async function isValidImage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 Chrome/139 Safari/537.36",
      },
    });

    if (!response.ok) {
      return false;
    }

    const contentType =
      response.headers.get("content-type") || "";

    return (
      contentType.includes("image/jpeg") ||
      contentType.includes("image/png") ||
      contentType.includes("image/webp")
    );
  } catch {
    return false;
  }
}


async function findFlippingBookPages(
  html,
  catalogueUrl
) {
  const publicationRoot =
    getPublicationRoot(catalogueUrl);

  const dynamicFolder =
    extractDynamicFolder(html);

  if (!dynamicFolder) {
    throw new Error(
      "Could not find FBInit.DYNAMIC_FOLDER."
    );
  }

  const dynamicRoot = new URL(
    dynamicFolder,
    publicationRoot
  ).href;

  console.log(
    "Dynamic root:",
    dynamicRoot
  );

  /*
   * FlippingBook versions have used
   * several page naming conventions.
   *
   * Probe them, but only accept responses
   * whose Content-Type is actually an image.
   */

  const candidates = [
    "pages/substrates/page1.jpg",
    "pages/substrates/page001.jpg",
    "pages/substrates/page0001.jpg",

    "pages/substrates/1.jpg",
    "pages/substrates/001.jpg",
    "pages/substrates/0001.jpg",

    "pages/1.jpg",
    "pages/page1.jpg",

    "pages/thumbnails/1.jpg",
    "pages/thumbnails/page1.jpg",

    "pages/content/1.jpg",
    "pages/content/page1.jpg",
  ];

  const validImages = [];

  for (const path of candidates) {
    const url = new URL(
      path,
      dynamicRoot
    ).href;

    console.log(
      "Testing:",
      url
    );

    const valid =
      await isValidImage(url);

    if (valid) {
      console.log(
        "✓ IMAGE FOUND:",
        url
      );

      validImages.push(url);
    }
  }

  return {
    publicationRoot,
    dynamicRoot,
    validImages,
  };
}


module.exports = {
  findFlippingBookPages,
};
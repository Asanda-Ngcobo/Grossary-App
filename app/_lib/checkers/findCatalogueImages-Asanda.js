// app/_lib/checkers/findCatalogueImages.js

function makeAbsoluteUrl(url, catalogueUrl) {
  if (!url) return null;

  // Already absolute
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  try {
    return new URL(url, catalogueUrl).href;
  } catch {
    return null;
  }
}


function findCatalogueAssets(html, catalogueUrl) {
  const assets = {
    images: [],
    scripts: [],
    configs: [],
  };

  /*
   * ------------------------------------------------
   * 1. Normal image sources
   * ------------------------------------------------
   */

  const imagePatterns = [
    /<img[^>]+src=["']([^"']+)["']/gi,
    /<img[^>]+data-src=["']([^"']+)["']/gi,
    /<img[^>]+data-original=["']([^"']+)["']/gi,

    /*
     * Images referenced directly inside JS/JSON.
     */
    /["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi,
  ];

  for (const pattern of imagePatterns) {
    let match;

    while ((match = pattern.exec(html)) !== null) {
      const absoluteUrl =
        makeAbsoluteUrl(
          match[1],
          catalogueUrl
        );

      if (absoluteUrl) {
        assets.images.push(
          absoluteUrl
        );
      }
    }
  }


  /*
   * ------------------------------------------------
   * 2. JavaScript files
   * ------------------------------------------------
   */

  const scriptRegex =
    /<script[^>]+src=["']([^"']+)["']/gi;

  let scriptMatch;

  while (
    (scriptMatch =
      scriptRegex.exec(html)) !== null
  ) {
    const absoluteUrl =
      makeAbsoluteUrl(
        scriptMatch[1],
        catalogueUrl
      );

    if (absoluteUrl) {
      assets.scripts.push(
        absoluteUrl
      );
    }
  }


  /*
   * ------------------------------------------------
   * 3. Possible FlippingBook config files
   * ------------------------------------------------
   */

  const configPatterns = [
    /["']([^"']*config[^"']*\.js)["']/gi,
    /["']([^"']*config[^"']*\.json)["']/gi,
    /["']([^"']*settings[^"']*\.js)["']/gi,
    /["']([^"']*settings[^"']*\.json)["']/gi,
  ];

  for (const pattern of configPatterns) {
    let match;

    while ((match = pattern.exec(html)) !== null) {
      const absoluteUrl =
        makeAbsoluteUrl(
          match[1],
          catalogueUrl
        );

      if (absoluteUrl) {
        assets.configs.push(
          absoluteUrl
        );
      }
    }
  }


  /*
   * Remove duplicates.
   */

  assets.images = [
    ...new Set(assets.images),
  ];

  assets.scripts = [
    ...new Set(assets.scripts),
  ];

  assets.configs = [
    ...new Set(assets.configs),
  ];

  return assets;
}


module.exports = {
  findCatalogueAssets,
};
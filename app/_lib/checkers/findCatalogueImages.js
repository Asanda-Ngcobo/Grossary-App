function findCatalogueImages(html) {
  const images = [];

  // Find normal img src attributes
  const imgRegex =
    /<img[^>]+src=["']([^"']+)["']/gi;

  let match;

  while (
    (match = imgRegex.exec(html)) !== null
  ) {
    images.push(match[1]);
  }

  // Find lazy-loaded images
  const dataSrcRegex =
    /<img[^>]+(?:data-src|data-original)=["']([^"']+)["']/gi;

  while (
    (match = dataSrcRegex.exec(html)) !== null
  ) {
    images.push(match[1]);
  }

  // Find image URLs inside CSS/backgrounds
  const urlRegex =
    /url\(["']?([^"')]+)["']?\)/gi;

  while (
    (match = urlRegex.exec(html)) !== null
  ) {
    const url = match[1];

    if (
      /\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(
        url
      )
    ) {
      images.push(url);
    }
  }

  return [
    ...new Set(images),
  ];
}


module.exports = {
  findCatalogueImages,
};
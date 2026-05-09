export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/account/", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/account/", "/api/"],
      },
    ],

    sitemap: "https://grossary.shop/sitemap.xml",

    host: "https://grossary.shop",
  };
}
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/account/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
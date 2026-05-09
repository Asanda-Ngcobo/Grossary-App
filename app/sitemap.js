export default function sitemap() {
  const baseURL = 'grossary.shop'
  return [
    {
      url: baseURL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseURL}/company/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseURL}/company/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
   {
      url: `${baseURL}/features/planning-ahead`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
       {
      url: `${baseURL}/features/staying-under-budget`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
       {
      url: `${baseURL}/features/digital-slips`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
       {
      url: `${baseURL}/features/loyalty-cards`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
 {
      url: `${baseURL}/for-grossary-stores`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },

  ]
}
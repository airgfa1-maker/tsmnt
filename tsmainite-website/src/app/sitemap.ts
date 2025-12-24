import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tsmainite.com';

  // 静态页面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cases`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/technology`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // 产品页面
  const products = [
    { slug: 'aluminum-stirrer', priority: 0.85 },
    { slug: 'casting-stirrer', priority: 0.85 },
    { slug: 'lifting-magnet', priority: 0.85 },
    { slug: 'electromagnetic-separator', priority: 0.85 },
    { slug: 'liquid-metal-pump', priority: 0.85 },
    { slug: 'cable-drum', priority: 0.85 },
    { slug: 'rectifier-control', priority: 0.85 },
  ];

  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: product.priority,
  }));

  // 案例详情页
  const casePages = Array.from({ length: 6 }, (_, i) => ({
    url: `${baseUrl}/cases/${i + 1}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 新闻详情页
  const newsPages = Array.from({ length: 12 }, (_, i) => ({
    url: `${baseUrl}/news/${i + 1}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  return [...staticPages, ...productPages, ...casePages, ...newsPages];
}

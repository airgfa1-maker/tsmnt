import type { Metadata } from 'next';

const baseUrl = 'https://tsmainite.com';
const defaultImage = `${baseUrl}/og-image.jpg`;

export const homeMetadata: Metadata = {
  title: '唐山迈尼特 | 工业电磁设备领先制造商',
  description: '25年专业经验，为全球500+企业提供电磁除铁器、电磁搅拌器、电缆卷筒等高品质工业电磁设备。精准控制、节能高效、质量可靠。',
  keywords: ['电磁除铁器', '电磁搅拌器', '工业电磁设备', '电缆卷筒', '液态金属泵', '工业磁电技术'],
  openGraph: {
    type: 'website',
    url: baseUrl,
    title: '唐山迈尼特 | 工业电磁设备领先制造商',
    description: '25年专业经验，为全球500+企业提供高品质工业电磁设备',
    images: [{ url: defaultImage, width: 1200, height: 630, alt: '唐山迈尼特' }],
    siteName: '唐山迈尼特',
  },
};

export const aboutMetadata: Metadata = {
  title: '关于我们 - 唐山迈尼特',
  description: '唐山迈尼特成立于1999年，专注于工业电磁设备的研发与制造。拥有高素质的技术团队和完善的质量管理体系，产品畅销国内外。',
  keywords: ['企业介绍', '技术实力', '荣誉资质', '发展历程'],
  openGraph: {
    type: 'website',
    url: `${baseUrl}/about`,
    title: '关于我们 - 唐山迈尼特',
    description: '专业的工业电磁设备制造商，25年行业经验',
    images: [{ url: defaultImage, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${baseUrl}/about`,
  },
};

export const productsMetadata: Metadata = {
  title: '产品中心 - 唐山迈尼特',
  description: '提供电磁除铁器、电磁搅拌器、电缆卷筒、液态金属泵等多种工业电磁设备产品和解决方案。',
  keywords: ['产品', '电磁设备', '工业设备', '解决方案'],
  openGraph: {
    type: 'website',
    url: `${baseUrl}/products`,
    title: '产品中心 - 唐山迈尼特',
    description: '多款高品质工业电磁设备产品',
    images: [{ url: defaultImage, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${baseUrl}/products`,
  },
};

export const casesMetadata: Metadata = {
  title: '成功案例 - 唐山迈尼特',
  description: '为全球500+企业提供工业电磁设备解决方案，包括冶金、铸造、电池、能源等多个领域的成功案例。',
  keywords: ['案例', '项目', '合作企业', '应用场景'],
  openGraph: {
    type: 'website',
    url: `${baseUrl}/cases`,
    title: '成功案例 - 唐山迈尼特',
    description: '500+企业信赖的工业电磁设备应用案例',
    images: [{ url: defaultImage, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${baseUrl}/cases`,
  },
};

export const newsMetadata: Metadata = {
  title: '新闻资讯 - 唐山迈尼特',
  description: '了解唐山迈尼特最新的产品创新、技术进展、行业动态和企业新闻。',
  keywords: ['新闻', '资讯', '行业动态', '技术进展', '产品创新'],
  openGraph: {
    type: 'website',
    url: `${baseUrl}/news`,
    title: '新闻资讯 - 唐山迈尼特',
    description: '最新的产品与技术资讯',
    images: [{ url: defaultImage, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${baseUrl}/news`,
  },
};

export const technologyMetadata: Metadata = {
  title: '技术支持 - 唐山迈尼特',
  description: '提供专业的技术支持、常见问题解答、技术文档和故障排查指南。',
  keywords: ['技术支持', '常见问题', '技术文档', '故障排查'],
  openGraph: {
    type: 'website',
    url: `${baseUrl}/technology`,
    title: '技术支持 - 唐山迈尼特',
    description: '专业的技术支持与解决方案',
    images: [{ url: defaultImage, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${baseUrl}/technology`,
  },
};

export const contactMetadata: Metadata = {
  title: '联系我们 - 唐山迈尼特',
  description: '联系唐山迈尼特，我们的销售团队和技术支持团队随时准备为您服务。',
  keywords: ['联系方式', '咨询', '售后服务', '技术支持'],
  openGraph: {
    type: 'website',
    url: `${baseUrl}/contact`,
    title: '联系我们 - 唐山迈尼特',
    description: '专业的销售和技术支持团队',
    images: [{ url: defaultImage, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
};

// 产品详情页元数据生成函数
export const productMetadataGenerator = (productName: string, description: string, slug: string): Metadata => ({
  title: `${productName} - 唐山迈尼特`,
  description: description,
  keywords: [productName, '工业电磁设备', '产品', '解决方案'],
  openGraph: {
    type: 'website',
    url: `${baseUrl}/products/${slug}`,
    title: `${productName} - 唐山迈尼特`,
    description: description,
    images: [{ url: defaultImage, width: 1200, height: 630, alt: productName }],
  },
  alternates: {
    canonical: `${baseUrl}/products/${slug}`,
  },
});

// 案例详情页元数据生成函数
export const caseMetadataGenerator = (caseTitle: string, company: string, caseId: number): Metadata => ({
  title: `${caseTitle} - ${company} - 唐山迈尼特`,
  description: `${company}成功采用唐山迈尼特的电磁设备解决方案，实现显著的生产效率提升和成本节省。`,
  keywords: [company, caseTitle, '成功案例', '应用案例'],
  openGraph: {
    type: 'website',
    url: `${baseUrl}/cases/${caseId}`,
    title: `${caseTitle} - ${company}`,
    description: `${company}的成功应用案例`,
    images: [{ url: defaultImage, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${baseUrl}/cases/${caseId}`,
  },
});

// 新闻详情页元数据生成函数
export const newsMetadataGenerator = (newsTitle: string, newsExcerpt: string, newsId: number, newsDate: string): Metadata => ({
  title: `${newsTitle} - 唐山迈尼特`,
  description: newsExcerpt,
  keywords: ['新闻', '资讯', '行业动态', newsTitle],
  openGraph: {
    type: 'article',
    url: `${baseUrl}/news/${newsId}`,
    title: newsTitle,
    description: newsExcerpt,
    images: [{ url: defaultImage, width: 1200, height: 630 }],
    publishedTime: newsDate,
  },
  alternates: {
    canonical: `${baseUrl}/news/${newsId}`,
  },
});

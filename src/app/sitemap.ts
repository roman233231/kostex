import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog';
import { products } from '@/data/products';
import { seedPortfolio } from '@/data/seedData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kostex.vercel.app';
  const now = new Date();

  const staticRoutes = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/catalog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/builder', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/portfolio', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/reviews', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/inspiration', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const categoryRoutes = ['websites', 'web-apps', 'software', 'bots'].map((category) => ({
    url: `${baseUrl}/catalog/${category}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productRoutes = products.filter((product) => product.published).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const portfolioRoutes = seedPortfolio.filter((item) => item.published).map((item) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...categoryRoutes,
    ...productRoutes,
    ...portfolioRoutes,
    ...blogRoutes,
  ];
}

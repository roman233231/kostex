import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/admin', '/builder'], // закриваємо особисті сторінки
    },
    sitemap: 'https://kostex.example.com/sitemap.xml',
  };
}
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/admin', '/builder'],
    },
    sitemap: 'https://kostex.vercel.app/sitemap.xml',
  };
}
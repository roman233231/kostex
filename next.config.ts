import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Дозволяємо запити з локальної мережі (для тестування на телефоні)
  allowedDevOrigins: ['192.168.0.109', '192.168.0.*', 'localhost', '127.0.0.1'],

  // Оптимізація зображень
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
    ],
  },

  // Стиснення
  compress: true,

  // Прибираємо X-Powered-By header
  poweredByHeader: false,

  // React strict mode (подвійний рендер для перевірки)
  reactStrictMode: true,
};

export default nextConfig;
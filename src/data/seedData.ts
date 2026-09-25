import { Product } from '@/types/product';
import { PortfolioItem } from '@/types/portfolio';
import { Feature } from '@/types/feature';
import { Category } from '@/types/category';

export const seedCategories: Omit<Category, 'id'>[] = [
  { name: 'Websites', slug: 'websites' },
  { name: 'Web Apps', slug: 'web-apps' },
  { name: 'Software', slug: 'software' },
  { name: 'Bots', slug: 'bots' },
];

export const seedProducts: Omit<Product, 'id'>[] = [
  {
    title: 'Auto Service Pro',
    slug: 'auto-service-pro',
    category: 'websites',
    shortDescription: 'Modern website for automotive businesses.',
    description:
      'A complete website for auto service stations with online booking, services catalog, and pricing. Built with modern design and optimized for local SEO.',
    startingPrice: 4900,
    estimatedTime: '7–14 days',
    tags: ['automotive', 'booking', 'responsive'],
    features: ['Online Booking', 'Services Catalog', 'Contact Form', 'Google Maps'],
    pages: ['Home', 'Services', 'About', 'Contact', 'Booking'],
    demoUrl: '#',
    published: true,
  },
  {
    title: 'Restaurant Pro',
    slug: 'restaurant-pro',
    category: 'websites',
    shortDescription: 'Elegant website for restaurants and cafes.',
    description:
      'Menu presentation, gallery, table reservation, and contact information. Perfect for restaurants, cafes, and bars.',
    startingPrice: 5200,
    estimatedTime: '7–12 days',
    tags: ['restaurant', 'menu', 'reservation'],
    features: ['Menu', 'Gallery', 'Reservation Form', 'Reviews'],
    pages: ['Home', 'Menu', 'Gallery', 'Contact', 'Reservation'],
    demoUrl: '#',
    published: true,
  },
  {
    title: 'Fitness Pro',
    slug: 'fitness-pro',
    category: 'websites',
    shortDescription: 'Website for gym or fitness coach.',
    description:
      'Showcase fitness programs, trainers, schedules, and membership plans. Great for gyms, yoga studios, and personal trainers.',
    startingPrice: 4800,
    estimatedTime: '7–14 days',
    tags: ['fitness', 'gym', 'coaching'],
    features: ['Programs', 'Trainers', 'Schedule', 'Membership'],
    pages: ['Home', 'Programs', 'Trainers', 'Schedule', 'Contact'],
    demoUrl: '#',
    published: true,
  },
  {
    title: 'CRM System',
    slug: 'crm-system',
    category: 'web-apps',
    shortDescription: 'Customer relationship management dashboard.',
    description:
      'Manage clients, deals, tasks, and communication in one place. Custom CRM tailored to your workflow.',
    startingPrice: 15000,
    estimatedTime: '3–5 weeks',
    tags: ['crm', 'dashboard', 'management'],
    features: ['Client Management', 'Deals Pipeline', 'Tasks', 'Reports'],
    pages: ['Dashboard', 'Clients', 'Deals', 'Tasks', 'Reports'],
    demoUrl: '#',
    published: true,
  },
  {
    title: 'Booking System',
    slug: 'booking-system',
    category: 'web-apps',
    shortDescription: 'Online booking platform for appointments.',
    description:
      'Allow customers to book appointments, manage schedules, and receive notifications. Perfect for salons, clinics, and services.',
    startingPrice: 12000,
    estimatedTime: '2–4 weeks',
    tags: ['booking', 'appointments', 'scheduling'],
    features: ['Calendar', 'Notifications', 'User Accounts', 'Admin Panel'],
    pages: ['Booking', 'Calendar', 'Dashboard', 'Settings'],
    demoUrl: '#',
    published: true,
  },
  {
    title: 'Telegram Support Bot',
    slug: 'telegram-support-bot',
    category: 'bots',
    shortDescription: 'Automated support bot for Telegram.',
    description:
      'Answer common questions, collect requests, and notify admins. Works 24/7 for your business.',
    startingPrice: 6500,
    estimatedTime: '1–2 weeks',
    tags: ['telegram', 'support', 'automation'],
    features: ['FAQ', 'Request Collection', 'Admin Notifications'],
    pages: [],
    demoUrl: '#',
    published: true,
  },
];

export const seedPortfolio: Omit<PortfolioItem, 'id' | 'createdAt'>[] = [
  {
    title: 'Auto Service Modern',
    slug: 'auto-service-modern',
    description:
      'Complete rebranding and website for a modern auto service station. Online booking, service catalog, and integrated reviews.',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200&q=80',
    demoUrl: '#',
    technologies: ['Next.js', 'React', 'Firebase', 'Tailwind CSS'],
    features: ['Online Booking', 'Services Catalog', 'Google Maps', 'Customer Reviews'],
    published: true,
  },
  {
    title: 'Restaurant La Terrazza',
    slug: 'restaurant-la-terrazza',
    description:
      'Elegant website for a fine dining Italian restaurant. Full menu, gallery, and table reservation system.',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
    demoUrl: '#',
    technologies: ['Next.js', 'Firebase', 'Tailwind CSS'],
    features: ['Interactive Menu', 'Table Reservation', 'Photo Gallery', 'Reviews'],
    published: true,
  },
  {
    title: 'FitLife Studio',
    slug: 'fitlife-studio',
    description:
      'Modern fitness studio website with class schedule, trainer profiles, and membership plans.',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
    demoUrl: '#',
    technologies: ['Next.js', 'React', 'Firebase'],
    features: ['Class Schedule', 'Trainer Profiles', 'Membership Plans', 'Online Signup'],
    published: true,
  },
  {
    title: 'SalesFlow CRM',
    slug: 'salesflow-crm',
    description:
      'Custom CRM system for a B2B sales team. Deal pipeline, task management, and detailed analytics.',
    category: 'web-apps',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    demoUrl: '#',
    technologies: ['Next.js', 'Firebase', 'TypeScript', 'Recharts'],
    features: ['Client Management', 'Deal Pipeline', 'Tasks & Reminders', 'Reports'],
    published: true,
  },
  {
    title: 'BeautyBook Platform',
    slug: 'beautybook-platform',
    description:
      'Online booking platform for beauty salons. Calendar, notifications, and client management.',
    category: 'web-apps',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80',
    demoUrl: '#',
    technologies: ['Next.js', 'Firebase', 'Stripe'],
    features: ['Smart Calendar', 'SMS Notifications', 'Client Accounts', 'Admin Panel'],
    published: true,
  },
  {
    title: 'ShopSmart Bot',
    slug: 'shopsmart-bot',
    description:
      'Telegram bot for an e-commerce business. Order tracking, product search, and customer support automation.',
    category: 'bots',
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&q=80',
    demoUrl: '#',
    technologies: ['Node.js', 'Telegram API', 'Firebase'],
    features: ['Order Tracking', 'Product Search', 'Support Automation', 'Admin Notifications'],
    published: true,
  },
];

export const seedFeatures: Omit<Feature, 'id'>[] = [
  {
    name: 'Online Booking',
    description: 'Allow customers to book appointments online.',
    price: 1500,
    estimatedTime: '2–3 days',
    active: true,
  },
  {
    name: 'Telegram Bot',
    description: 'Automated Telegram bot for support and notifications.',
    price: 2500,
    estimatedTime: '3–5 days',
    active: true,
  },
  {
    name: 'Admin Panel',
    description: 'Full admin dashboard to manage content and clients.',
    price: 3000,
    estimatedTime: '5–7 days',
    active: true,
  },
  {
    name: 'User Accounts',
    description: 'Registration, login, and user profile system.',
    price: 2000,
    estimatedTime: '3–4 days',
    active: true,
  },
  {
    name: 'Online Payments',
    description: 'Stripe / LiqPay / Monobank payment integration.',
    price: 3500,
    estimatedTime: '4–6 days',
    active: true,
  },
  {
    name: 'Multilingual',
    description: 'Full support for multiple languages (UA / EN).',
    price: 1800,
    estimatedTime: '2–3 days',
    active: true,
  },
  {
    name: 'SEO Optimization',
    description: 'Complete SEO setup, sitemap, structured data.',
    price: 2000,
    estimatedTime: '2–3 days',
    active: true,
  },
  {
    name: 'Analytics',
    description: 'Google Analytics / Firebase Analytics integration.',
    price: 1200,
    estimatedTime: '1–2 days',
    active: true,
  },
  {
    name: 'Email Notifications',
    description: 'Automated email notifications to clients.',
    price: 1500,
    estimatedTime: '2–3 days',
    active: true,
  },
  {
    name: 'API Integration',
    description: 'Custom API integrations with your services.',
    price: 4000,
    estimatedTime: '5–7 days',
    active: true,
  },
];
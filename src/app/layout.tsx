import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'KOSTEX — Digital Products Studio',
    template: '%s | KOSTEX',
  },
  description:
    'Build your digital product with KOSTEX. Websites, web apps, software, bots and custom digital solutions.',
  keywords: [
    'KOSTEX',
    'digital products',
    'websites',
    'web apps',
    'software',
    'bots',
    'CRM',
    'e-commerce',
    'automation',
  ],
  openGraph: {
    title: 'KOSTEX — Digital Products Studio',
    description: 'Build your digital product with KOSTEX.',
    url: 'https://kostex.vercel.app',
    siteName: 'KOSTEX',
    type: 'website',
    locale: 'uk_UA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KOSTEX — Digital Products Studio',
    description: 'Build your digital product with KOSTEX.',
  },
  verification: {
    google: 'bKPtZ7tHSb2R3wG0TWH096JiJNjHzsiSJe8cFjqJmoE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
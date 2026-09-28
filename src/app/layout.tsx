import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import FloatingChat from '@/components/chat/FloatingChat';
import CursorGlow from '@/components/ui/CursorGlow';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kostex.vercel.app'),
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
    'Ukraine',
  ],
  authors: [{ name: 'KOSTEX' }],
  creator: 'KOSTEX',
  publisher: 'KOSTEX',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    alternateLocale: ['en_US'],
    url: 'https://kostex.vercel.app',
    siteName: 'KOSTEX',
    title: 'KOSTEX — Digital Products Studio',
    description:
      'We build websites, web apps, software, bots and custom digital solutions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KOSTEX — Digital Products Studio',
    description:
      'We build websites, web apps, software, bots and custom digital solutions.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'bKPtZ7tHSb2R3wG0TWH096JiJNjHzsiSJe8cFjqJmoE',
  },
  icons: {
    icon: '/logo-icon.png',
    apple: '/logo-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${inter.variable} dark`} data-scroll-behavior="smooth">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <CursorGlow />
              {children}
              <FloatingChat />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
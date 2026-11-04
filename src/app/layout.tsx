import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import FloatingChat from '@/components/chat/FloatingChat';
import CursorGlow from '@/components/ui/CursorGlow';
import Preloader from '@/components/layout/Preloader';
import CookieBanner from '@/components/CookieBanner';
import { Analytics } from "@vercel/analytics/next";

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
              <Preloader />
              <CursorGlow />
              {children}
              <FloatingChat />
              <CookieBanner />
              <Analytics />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

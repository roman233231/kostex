import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: {
    default: 'KOSTEX — Digital Products Studio',
    template: '%s | KOSTEX',
  },
  description: 'Build your digital product with KOSTEX. Websites, web apps, software, bots and custom digital solutions.',
  keywords: ['KOSTEX', 'digital products', 'websites', 'web apps', 'software', 'bots', 'CRM', 'e-commerce', 'automation'],
  openGraph: {
    title: 'KOSTEX — Digital Products Studio',
    description: 'Build your digital product with KOSTEX.',
    url: 'https://kostex.example.com', // зміни на свій домен, коли буде
    siteName: 'KOSTEX',
    type: 'website',
    locale: 'uk_UA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KOSTEX — Digital Products Studio',
    description: 'Build your digital product with KOSTEX.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
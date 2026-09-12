'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const navItems = [
  { href: '/account', label: 'Dashboard', icon: '📊' },
  { href: '/account/orders', label: 'Orders', icon: '📦' },
  { href: '/account/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/account/messages', label: 'Messages', icon: '💬' },
  { href: '/account/files', label: 'Files', icon: '📁' },
  { href: '/account/profile', label: 'Profile', icon: '👤' },
  { href: '/account/settings', label: 'Settings', icon: '⚙️' },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return <div className="container py-16 text-center">Loading...</div>;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container py-8 flex gap-8">
        <aside className="w-64 shrink-0 hidden md:block">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-purple/10 text-purple-bright border border-purple/30'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </>
  );
}
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
    return (
      <div className="container py-16">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <>
      <Navbar />
      <div className="container py-10 flex gap-10">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 hidden md:block">
          <div className="sticky top-24">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-[var(--purple)]/10 text-[var(--purple-bright)] border border-[var(--purple)]/30 font-medium'
                        : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] border border-transparent'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </>
  );
}
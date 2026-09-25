'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const navItems = [
  { href: '/account', labelKey: 'account.dashboard' as const, icon: '📊' },
  { href: '/account/orders', labelKey: 'account.orders' as const, icon: '📦' },
  { href: '/account/notifications', labelKey: 'account.notifications' as const, icon: '🔔' },
  { href: '/account/messages', labelKey: 'account.messages' as const, icon: '💬' },
  { href: '/account/files', labelKey: 'account.files' as const, icon: '📁' },
  { href: '/account/profile', labelKey: 'account.profile' as const, icon: '👤' },
  { href: '/account/settings', labelKey: 'account.settings' as const, icon: '⚙️' },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !currentUser) router.push('/login');
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <>
      <Navbar />

      {/* Mobile horizontal nav */}
      <div className="md:hidden border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl sticky top-16 z-30">
        <div className="-mx-5 px-5 overflow-x-auto scrollbar-hide">
          <nav className="flex gap-1 py-3 min-w-max">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[var(--purple-soft)] text-[var(--purple-bright)] border border-[var(--border-purple)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] border border-transparent'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="container py-6 md:py-10 flex gap-10">
        {/* Desktop sidebar */}
        <aside className="w-60 shrink-0 hidden md:block">
          <div className="sticky top-24">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'bg-[var(--purple-soft)] text-[var(--purple-bright)] border border-[var(--border-purple)] font-medium'
                        : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] border border-transparent'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {t(item.labelKey)}
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
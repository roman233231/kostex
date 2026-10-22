'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  LayoutDashboard,
  Package,
  Bell,
  MessageSquare,
  FolderOpen,
  User,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/account', labelKey: 'account.dashboard' as const, icon: LayoutDashboard },
  { href: '/account/orders', labelKey: 'account.orders' as const, icon: Package },
  { href: '/account/notifications', labelKey: 'account.notifications' as const, icon: Bell },
  { href: '/account/messages', labelKey: 'account.messages' as const, icon: MessageSquare },
  { href: '/account/files', labelKey: 'account.files' as const, icon: FolderOpen },
  { href: '/account/profile', labelKey: 'account.profile' as const, icon: User },
  { href: '/account/settings', labelKey: 'account.settings' as const, icon: Settings },
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
      <div className="container py-32 flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <>
      <Navbar />

      {/* Mobile nav */}
      <div className="md:hidden border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl sticky top-16 z-30">
        <div className="px-4 overflow-x-auto scrollbar-hide">
          <nav className="flex gap-2 py-3 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white shadow-[0_0_15px_var(--accent)]'
                      : 'bg-[var(--surface-2)] text-[var(--text-3)] border border-[var(--border)]'
                  }`}
                >
                  <Icon size={16} />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="container py-8 md:py-16 flex flex-col md:flex-row gap-8 min-h-[80vh]">
        {/* Desktop sidebar */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="glass-card rounded-3xl p-4 sticky top-28">
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 relative group overflow-hidden ${
                      isActive
                        ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                        : 'text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent)] rounded-r-full shadow-[0_0_10px_var(--accent)]" />
                    )}
                    <Icon size={18} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[var(--accent)]' : ''}`} />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 animate-slide-up">
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}

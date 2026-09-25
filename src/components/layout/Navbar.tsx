'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Button from '../ui/Button';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';
import UserMenu from './UserMenu';
import SupportMessagesBell from './SupportMessagesBell';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/translations';
import {
  Menu,
  X,
  Home,
  Layers,
  Tag,
  Briefcase,
  Lightbulb,
  BookOpen,
  Info,
  Mail,
  LogIn,
  UserPlus,
  User,
  MessageSquare,
  Shield,
  Star,
  Package,
} from 'lucide-react';

const NotificationBell = dynamic(() => import('./NotificationBell'), { ssr: false });

const navLinks: { href: string; key: TranslationKey; icon: any }[] = [
  { href: '/services', key: 'nav.services', icon: Layers },
  { href: '/catalog', key: 'nav.catalog', icon: Tag },
  { href: '/pricing', key: 'pricing.badge', icon: Briefcase },
  { href: '/portfolio', key: 'nav.portfolio', icon: Home },
  { href: '/reviews', key: 'reviews.badge', icon: Star },
  { href: '/blog', key: 'nav.blog', icon: BookOpen },
  { href: '/inspiration', key: 'nav.inspiration', icon: Lightbulb },
  { href: '/about', key: 'nav.about', icon: Info },
  { href: '/contact', key: 'nav.contact', icon: Mail },
];

export default function Navbar() {
  const { currentUser, appUser, loading } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isAdmin = appUser?.role === 'admin';

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="container flex items-center justify-between h-16 md:h-[68px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group relative"
            onClick={(e) => {
              if (e.shiftKey) {
                e.preventDefault();
                window.location.href = '/admin';
              }
            }}
          >
            <Logo
              size={34}
              className="w-8 h-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
            />
            <span className="hidden sm:block text-lg font-bold tracking-tight">
              KOSTEX
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm transition-colors group ${
                    active
                      ? 'text-[var(--text)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {t(link.key)}
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] transition-all duration-300 ${
                      active
                        ? 'w-5 opacity-100'
                        : 'w-0 opacity-0 group-hover:w-5 group-hover:opacity-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <div className="hidden sm:flex items-center gap-1">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {loading ? (
              <div className="w-8 h-8 rounded-full skeleton" />
            ) : currentUser ? (
              <>
                <SupportMessagesBell />
                <NotificationBell />
                <UserMenu />
              </>
            ) : (
              <>
                <Button variant="outline" href="/login" className="hidden md:inline-flex">
                  {t('nav.login')}
                </Button>
                <Button href="/register" className="hidden md:inline-flex">
                  {t('nav.register')}
                </Button>
              </>
            )}

            {/* Mobile burger */}
            <button
              className="xl:hidden p-2 ml-1 rounded-lg text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors relative z-[10001]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Меню"
            >
              <div className="w-6 h-6 relative flex items-center justify-center">
                <Menu
                  size={22}
                  className={`absolute transition-all duration-300 ${
                    menuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0'
                  }`}
                />
                <X
                  size={22}
                  className={`absolute transition-all duration-300 ${
                    menuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90 scale-50'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="xl:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-[9998]"
            style={{ animation: 'fadeIn 0.25s ease' }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Panel */}
          <div
            className="xl:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[var(--surface)] border-l border-[var(--border)] z-[9999] flex flex-col overflow-hidden"
            style={{ animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <Logo size={28} className="w-7 h-7" />
                <span className="font-bold tracking-tight">KOSTEX</span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                aria-label="Закрити"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-3">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3.5 text-base border-l-2 transition-all ${
                      active
                        ? 'border-[var(--purple)] text-[var(--purple-bright)] bg-[var(--purple-soft)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                    }`}
                    style={{ animation: `fadeUp 0.4s ease ${i * 40}ms both` }}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span>{t(link.key)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Theme + language */}
            <div className="px-5 py-4 border-t border-[var(--border)] flex items-center justify-between">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {/* Bottom actions */}
            <div className="p-5 border-t border-[var(--border)] space-y-2.5">
              {currentUser ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-all"
                  >
                    <User size={18} />
                    {t('nav.myAccount')}
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-all"
                  >
                    <Package size={18} />
                    {t('nav.myOrders')}
                  </Link>
                  <Link
                    href="/account/messages"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-all"
                  >
                    <MessageSquare size={18} />
                    {t('nav.messages')}
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-purple)] bg-[var(--purple-soft)] text-sm text-[var(--purple-bright)] font-medium hover:bg-[var(--purple)]/20 transition-all"
                    >
                      <Shield size={18} />
                      {t('nav.admin')}
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-all"
                  >
                    <LogIn size={18} />
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--purple)] to-[var(--purple-bright)] text-sm font-medium text-white shadow-[0_4px_18px_rgba(139,92,246,0.35)] hover:brightness-110 transition-all"
                  >
                    <UserPlus size={18} />
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
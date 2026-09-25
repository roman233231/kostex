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
  ArrowRight,
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
        <div className="container flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group"
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

          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language + Theme — показуємо з 640px і вище */}
            <div className="hidden sm:flex items-center gap-1.5">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {loading ? (
              <div className="w-9 h-9 rounded-full skeleton" />
            ) : currentUser ? (
              <div className="flex items-center gap-1">
                <SupportMessagesBell />
                <NotificationBell />
                <UserMenu />
              </div>
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
              className="xl:hidden w-11 h-11 rounded-xl flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface-2)] border border-transparent hover:border-[var(--border)] transition-all active:scale-95 ml-0.5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Меню"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <Menu
                  size={24}
                  className={`absolute transition-all duration-300 ${
                    menuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0'
                  }`}
                />
                <X
                  size={24}
                  className={`absolute transition-all duration-300 ${
                    menuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90 scale-50'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
          FULL-SCREEN MOBILE MENU
          ============================================================ */}
      {menuOpen && (
        <div
          className="xl:hidden fixed inset-0 z-[9999] bg-[var(--bg)] overflow-y-auto"
          style={{ animation: 'menuFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* Ambient glows */}
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(192,38,255,0.15), transparent 70%)',
              filter: 'blur(80px)',
            }}
          />

          <div className="relative flex flex-col min-h-full">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <Link
                href="/"
                className="flex items-center gap-2.5"
                onClick={() => setMenuOpen(false)}
              >
                <Logo size={32} className="w-8 h-8" />
                <span className="text-lg font-bold tracking-tight">KOSTEX</span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface-2)] transition-all active:scale-95"
                aria-label="Закрити"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav links — spacious */}
            <nav className="flex-1 px-5 py-6 flex flex-col">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between py-5 px-3 rounded-2xl transition-all active:scale-[0.98] hover:bg-[var(--surface-2)]"
                    style={{ animation: `menuItemIn 0.4s ease ${i * 50}ms both` }}
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                          active
                            ? 'bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] text-white shadow-[0_0_24px_rgba(139,92,246,0.55)]'
                            : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] group-hover:text-[var(--purple-bright)] group-hover:border-[var(--border-purple)]'
                        }`}
                      >
                        <Icon size={22} />
                      </div>
                      <span
                        className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
                          active
                            ? 'text-[var(--purple-bright)]'
                            : 'text-[var(--text)] group-hover:text-[var(--purple-bright)]'
                        }`}
                      >
                        {t(link.key)}
                      </span>
                    </div>
                    <ArrowRight
                      size={22}
                      className="text-[var(--text-faint)] group-hover:text-[var(--purple-bright)] group-hover:translate-x-1 transition-all shrink-0"
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Bottom section */}
            <div className="px-5 pt-6 pb-8 space-y-5 border-t border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
              {/* Theme + Language row */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.15em] text-[var(--text-faint)] font-medium">
                  Налаштування
                </span>
                <div className="flex items-center gap-2">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
              </div>

              {/* Actions */}
              {currentUser ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col items-center justify-center gap-2.5 py-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-all active:scale-[0.97]"
                  >
                    <User size={22} />
                    <span>{t('nav.myAccount')}</span>
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col items-center justify-center gap-2.5 py-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-all active:scale-[0.97]"
                  >
                    <Package size={22} />
                    <span>{t('nav.myOrders')}</span>
                  </Link>
                  <Link
                    href="/account/messages"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col items-center justify-center gap-2.5 py-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-all active:scale-[0.97]"
                  >
                    <MessageSquare size={22} />
                    <span>{t('nav.messages')}</span>
                  </Link>
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex flex-col items-center justify-center gap-2.5 py-5 rounded-2xl border border-[var(--border-purple)] bg-[var(--purple-soft)] text-sm font-medium text-[var(--purple-bright)] hover:bg-[var(--purple)]/20 transition-all active:scale-[0.97]"
                    >
                      <Shield size={22} />
                      <span>Адмін</span>
                    </Link>
                  ) : (
                    <Link
                      href="/builder"
                      onClick={() => setMenuOpen(false)}
                      className="flex flex-col items-center justify-center gap-2.5 py-5 rounded-2xl bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] text-sm font-semibold text-white shadow-[0_6px_24px_rgba(139,92,246,0.4)] active:scale-[0.97]"
                    >
                      <ArrowRight size={22} />
                      <span>Проєкт</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-all active:scale-[0.98]"
                  >
                    <LogIn size={20} />
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--purple)] to-[var(--purple-bright)] text-sm font-semibold text-white shadow-[0_6px_24px_rgba(139,92,246,0.4)] hover:brightness-110 transition-all active:scale-[0.98]"
                  >
                    <UserPlus size={20} />
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
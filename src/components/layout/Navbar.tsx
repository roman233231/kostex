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
        <div className="container flex items-center justify-between h-16 md:h-20">
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
              size={32}
              className="w-8 h-8 transition-transform duration-500 group-hover:scale-110"
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
                      : 'text-[var(--text-3)] hover:text-[var(--text)]'
                  }`}
                >
                  {t(link.key)}
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-[var(--accent)] transition-all duration-300 ${
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
              className="xl:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface-2)] transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Меню"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Menu
                  size={20}
                  className={`absolute transition-all duration-300 ${
                    menuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0'
                  }`}
                />
                <X
                  size={20}
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
          FULL-SCREEN MOBILE MENU — spacious version
          ============================================================ */}
      {menuOpen && (
        <div
          className="xl:hidden fixed inset-0 z-[9999] bg-[var(--bg)] flex flex-col"
          style={{ animation: 'menuFadeIn 0.3s ease' }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--border)] shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              onClick={() => setMenuOpen(false)}
            >
              <Logo size={28} className="w-7 h-7" />
              <span className="text-base font-bold tracking-tight">KOSTEX</span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface-2)] transition-all"
              aria-label="Закрити"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav links — spacious */}
          <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-1.5">
            {navLinks.map((link, i) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 py-4 px-4 rounded-xl transition-colors ${
                    active
                      ? 'bg-[var(--accent-soft)] text-[var(--accent-2)]'
                      : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                  }`}
                  style={{ animation: `menuItemIn 0.3s ease ${i * 30}ms both` }}
                >
                  <span
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      active
                        ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white'
                        : 'bg-[var(--surface-2)] text-[var(--text-3)]'
                    }`}
                  >
                    <Icon size={19} />
                  </span>
                  <span className="flex-1 text-base font-medium">
                    {t(link.key)}
                  </span>
                  <ArrowRight
                    size={16}
                    className={active ? 'text-[var(--accent-2)]' : 'text-[var(--text-4)]'}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Bottom section — spacious */}
          <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg)] px-5 py-6 space-y-5">
            {/* Theme + language */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-4)] font-medium">
                Налаштування
              </span>
              <div className="flex items-center gap-2.5">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)]" />

            {/* User actions */}
            {currentUser ? (
              <div className="grid grid-cols-4 gap-3">
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-[var(--border)] text-[11px] font-medium text-[var(--text-3)] hover:border-[var(--accent-border)] hover:text-[var(--accent-2)] transition-colors"
                >
                  <User size={20} />
                  <span>Акаунт</span>
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-[var(--border)] text-[11px] font-medium text-[var(--text-3)] hover:border-[var(--accent-border)] hover:text-[var(--accent-2)] transition-colors"
                >
                  <Package size={20} />
                  <span>Замовлення</span>
                </Link>
                <Link
                  href="/account/messages"
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-[var(--border)] text-[11px] font-medium text-[var(--text-3)] hover:border-[var(--accent-border)] hover:text-[var(--accent-2)] transition-colors"
                >
                  <MessageSquare size={20} />
                  <span>Чати</span>
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[11px] font-semibold text-[var(--accent-2)]"
                  >
                    <Shield size={20} />
                    <span>Адмін</span>
                  </Link>
                ) : (
                  <Link
                    href="/builder"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-[11px] font-semibold text-white"
                  >
                    <ArrowRight size={20} />
                    <span>Проєкт</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text)] hover:border-[var(--accent-border)] hover:text-[var(--accent-2)] transition-colors"
                >
                  <LogIn size={18} />
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-sm font-semibold text-white"
                >
                  <UserPlus size={18} />
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
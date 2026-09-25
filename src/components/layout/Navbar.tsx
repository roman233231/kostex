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

const NotificationBell = dynamic(() => import('./NotificationBell'), { ssr: false });

const navLinks: { href: string; key: TranslationKey }[] = [
  { href: '/services', key: 'nav.services' },
  { href: '/catalog', key: 'nav.catalog' },
  { href: '/pricing', key: 'pricing.badge' },
  { href: '/portfolio', key: 'nav.portfolio' },
  { href: '/inspiration', key: 'nav.inspiration' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
];

export default function Navbar() {
  const { currentUser, loading } = useAuth();
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
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

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
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm transition-colors group ${
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
            <LanguageSwitcher />
            <ThemeToggle />

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
              className="lg:hidden p-2 text-[var(--text)] relative z-[10001]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span
                  className={`w-full h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
                    menuOpen ? 'rotate-45 translate-y-[9px]' : ''
                  }`}
                />
                <span
                  className={`w-full h-[2px] bg-current rounded-full transition-all duration-300 ${
                    menuOpen ? 'opacity-0 scale-x-0' : ''
                  }`}
                />
                <span
                  className={`w-full h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
                    menuOpen ? '-rotate-45 -translate-y-[9px]' : ''
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
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            style={{ animation: 'fadeIn 0.2s ease' }}
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[var(--surface)] border-l border-[var(--border)] z-[9999] flex flex-col"
            style={{ animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <Logo size={28} className="w-7 h-7" />
                <span className="font-bold tracking-tight">KOSTEX</span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text)]"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between px-5 py-4 text-base border-l-2 transition-all ${
                      active
                        ? 'border-[var(--purple)] text-[var(--purple-bright)] bg-[var(--purple)]/[0.05]'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                    }`}
                    style={{ animation: `fadeUp 0.4s ease ${i * 40}ms both` }}
                  >
                    {t(link.key)}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                );
              })}
            </nav>

            <div className="p-5 border-t border-[var(--border)] space-y-3">
              {currentUser ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text)]"
                  >
                    {t('nav.account')}
                  </Link>
                  <Link
                    href="/admin/messages"
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-sm text-[var(--purple-bright)]"
                  >
                    💬 {t('nav.messages')}
                  </Link>
                </>
              ) : (
                <>
                  <Button variant="outline" href="/login" className="w-full">
                    {t('nav.login')}
                  </Button>
                  <Button href="/register" className="w-full">
                    {t('nav.register')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
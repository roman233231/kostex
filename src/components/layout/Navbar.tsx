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
import { Menu, X, Home, Layers, Tag, Briefcase, Lightbulb, BookOpen, Info, Mail, LogIn, UserPlus, User, MessageSquare, Shield, Star, Package, ArrowRight } from 'lucide-react';

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
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isAdmin = appUser?.role === 'admin';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-2 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
            : 'py-4 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Logo size={32} className="w-8 h-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
            <span className="hidden sm:block text-lg font-bold tracking-tight text-gradient-animated">
              KOSTEX
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-1 bg-[var(--surface-2)]/50 px-2 py-1.5 rounded-full border border-[var(--border)]/50 backdrop-blur-md">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${
                    active
                      ? 'text-white bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]'
                      : 'text-[var(--text-3)] hover:text-white hover:bg-[var(--surface)]'
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
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
                <Button variant="outline" href="/login" className="hidden md:inline-flex btn-tactile rounded-full">
                  {t('nav.login')}
                </Button>
                <Button href="/register" className="hidden md:inline-flex btn-tactile rounded-full shadow-[0_0_15px_var(--accent)]">
                  {t('nav.register')}
                </Button>
              </>
            )}

            <button
              className="xl:hidden w-10 h-10 rounded-full flex items-center justify-center text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="xl:hidden fixed inset-0 z-[9999] bg-[var(--bg)]/95 backdrop-blur-2xl flex flex-col" style={{ animation: 'menuFadeIn 0.3s ease' }}>
          <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--border)] shrink-0">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
              <Logo size={28} className="w-7 h-7" />
              <span className="text-base font-bold tracking-tight">KOSTEX</span>
            </Link>
            <button onClick={() => setMenuOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--surface-2)] border border-[var(--border)]">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-2">
            {navLinks.map((link, i) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 py-3 px-4 rounded-2xl transition-all ${
                    active ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30' : 'text-[var(--text)] hover:bg-[var(--surface-2)] border border-transparent'
                  }`}
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-[var(--accent)] text-white shadow-[0_0_10px_var(--accent)]' : 'bg-[var(--surface-2)] text-[var(--text-3)]'}`}>
                    <Icon size={18} />
                  </span>
                  <span className="flex-1 text-base font-medium">{t(link.key)}</span>
                  <ArrowRight size={16} className={active ? 'text-[var(--accent)]' : 'text-[var(--text-4)]'} />
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg)] px-5 py-4 space-y-4" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-4)] font-medium">Налаштування</span>
              <div className="flex items-center gap-2.5"><LanguageSwitcher /><ThemeToggle /></div>
            </div>
            <div className="h-px bg-[var(--border)]" />
            {currentUser ? (
              <div className="grid grid-cols-4 gap-2">
                <Link href="/account" onClick={() => setMenuOpen(false)} className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl bg-[var(--surface-2)] text-[11px] font-medium text-[var(--text-3)]"><User size={20} /><span>Акаунт</span></Link>
                <Link href="/account/orders" onClick={() => setMenuOpen(false)} className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl bg-[var(--surface-2)] text-[11px] font-medium text-[var(--text-3)]"><Package size={20} /><span>Замовлення</span></Link>
                <Link href="/account/messages" onClick={() => setMenuOpen(false)} className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl bg-[var(--surface-2)] text-[11px] font-medium text-[var(--text-3)]"><MessageSquare size={20} /><span>Чати</span></Link>
                {isAdmin ? (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[11px] font-semibold text-[var(--accent-2)]"><Shield size={20} /><span>Адмін</span></Link>
                ) : (
                  <Link href="/builder" onClick={() => setMenuOpen(false)} className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-[11px] font-semibold text-white"><ArrowRight size={20} /><span>Проєкт</span></Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--border)] text-sm font-medium"><LogIn size={18} />Увійти</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-sm font-semibold text-white"><UserPlus size={18} />Реєстрація</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

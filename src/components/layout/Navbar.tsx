'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Button from '../ui/Button';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import UserMenu from './UserMenu';
import SupportMessagesBell from './SupportMessagesBell';
import { useAuth } from '@/context/AuthContext';

const NotificationBell = dynamic(() => import('./NotificationBell'), { ssr: false });

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/inspiration', label: 'Inspiration' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { currentUser, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-16">
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
          <Logo size={36} className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden sm:block text-lg font-bold tracking-tight">KOSTEX</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          {loading ? null : currentUser ? (
            <>
              <SupportMessagesBell />
              <NotificationBell />
              <UserMenu />
            </>
          ) : (
            <>
              <Button variant="outline" href="/login" className="hidden md:inline-flex">
                Login
              </Button>
              <Button href="/register" className="hidden md:inline-flex">
                Start a Project
              </Button>
            </>
          )}

          <button
            className="lg:hidden p-2 text-[var(--text)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--bg)]">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors py-3"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-[var(--border)] flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] py-2"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/admin/messages"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-[var(--purple-bright)] py-2 font-medium"
                  >
                    Messages
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-[var(--purple-bright)] py-2 font-medium"
                  >
                    Admin Panel
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] py-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-[var(--purple)] py-2"
                  >
                    Start a Project
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
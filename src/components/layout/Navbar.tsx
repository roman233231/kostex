'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Button from '../ui/Button';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/services/auth';
import { useRouter } from 'next/navigation';

const NotificationBell = dynamic(() => import('./NotificationBell'), {
  ssr: false,
});

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/inspiration', label: 'Inspiration' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold tracking-tight">
          KOSTEX
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? null : currentUser ? (
            <>
              <NotificationBell />
              <Link
                href="/account"
                className="hidden md:inline text-sm text-white/70 hover:text-white"
              >
                {appUser?.displayName || 'Account'}
              </Link>
              <Button variant="outline" onClick={handleLogout} className="hidden md:inline-flex">
                Logout
              </Button>
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

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 text-white/80"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[var(--bg)]">
          <nav className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-white/70 hover:text-white transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-white/70 hover:text-white py-2"
                  >
                    {appUser?.displayName || 'Account'}
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-sm text-white/70 hover:text-white text-left py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-white/70 hover:text-white py-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-purple-bright py-2"
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
'use client';

import Link from 'next/link';
import Button from '../ui/Button';
import NotificationBell from './NotificationBell';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();

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
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/catalog"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Catalog
          </Link>
          <Link
            href="/portfolio"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/inspiration"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Inspiration
          </Link>
          <Link
            href="/about"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {loading ? null : currentUser ? (
            <>
              <NotificationBell />
              <Link
                href="/account"
                className="text-sm text-white/70 hover:text-white"
              >
                {appUser?.displayName || 'Account'}
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" href="/login">
                Login
              </Button>
              <Button href="/register">Start a Project</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
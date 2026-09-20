'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/services/auth';

export default function UserMenu() {
  const { currentUser, appUser } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!currentUser) return null;

  const initial = (appUser?.displayName?.[0] || currentUser.email?.[0] || 'U').toUpperCase();
  const isAdmin = appUser?.role === 'admin';

  const handleLogout = async () => {
    setOpen(false);
    await logoutUser();
    router.push('/');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] text-white font-semibold text-sm flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="User menu"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-[var(--border)]">
            <div className="text-sm font-semibold truncate">
              {appUser?.displayName || 'User'}
            </div>
            <div className="text-xs text-[var(--text-muted)] truncate">
              {currentUser.email}
            </div>
            {isAdmin && (
              <div className="mt-1 inline-block px-2 py-0.5 rounded-full bg-[var(--purple)]/15 text-[var(--purple-bright)] text-[10px] font-semibold uppercase tracking-wider">
                Admin
              </div>
            )}
          </div>

          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              My Account
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              My Orders
            </Link>
            <Link
              href="/account/notifications"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              Notifications
            </Link>
            <Link
              href="/account/profile"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              Profile Settings
            </Link>

            {isAdmin && (
              <>
                <div className="my-1 border-t border-[var(--border)]" />
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-[var(--purple-bright)] hover:bg-[var(--purple)]/10 transition-colors font-medium"
                >
                  ⚡ Admin Panel
                </Link>
              </>
            )}
          </div>

          <div className="border-t border-[var(--border)]">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/5 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
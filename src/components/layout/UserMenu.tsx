'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/services/auth';
import { User, Package, Bell, Settings, LogOut, Shield, ChevronDown } from 'lucide-react';

export default function UserMenu() {
  const { currentUser, appUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const initial = (appUser?.displayName?.[0] || currentUser.email?.[0] || 'U').toUpperCase();
  const isAdmin = appUser?.role === 'admin';

  const menuItems = [
    { href: '/account', label: 'Мій акаунт', icon: User },
    { href: '/account/orders', label: 'Мої замовлення', icon: Package },
    { href: '/account/notifications', label: 'Сповіщення', icon: Bell },
    { href: '/account/profile', label: 'Налаштування профілю', icon: Settings },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-2 rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-all bg-[var(--surface)]"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
          {initial}
        </div>
        <ChevronDown size={14} className={`text-[var(--text-3)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden animate-slide-up z-[100]">
          {/* Header */}
          <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-2)]">
            <p className="font-bold text-[var(--text)] truncate">{appUser?.displayName || 'Користувач'}</p>
            <p className="text-xs text-[var(--text-3)] truncate">{currentUser.email}</p>
          </div>

          {/* Links */}
          <div className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-2)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors"
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Admin link */}
          {isAdmin && (
            <div className="p-2 border-t border-[var(--border)]">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[var(--accent)] bg-[var(--accent-soft)] hover:bg-[var(--accent)] hover:text-white transition-colors"
              >
                <Shield size={18} />
                Адмін-панель
              </Link>
            </div>
          )}

          {/* Logout */}
          <div className="p-2 border-t border-[var(--border)]">
            <button
              onClick={() => {
                setIsOpen(false);
                logoutUser();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} />
              Вийти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

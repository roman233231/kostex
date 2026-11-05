'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/services/auth';
import { User, Package, Bell, Settings, LogOut, Shield, ChevronDown, X } from 'lucide-react';

export default function UserMenu() {
  const { currentUser, appUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Блокуємо скрол фону, коли відкрите мобільне меню
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
        type="button"
        onClick={(e) => { e.stopPropagation(); setIsOpen((v) => !v); }}
        className="flex items-center gap-1 sm:gap-2 p-1 sm:pr-2 rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-all bg-[var(--surface)] cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
          {initial}
        </div>
        <ChevronDown size={14} className={`text-[var(--text-3)] transition-transform duration-300 hidden sm:block ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* DESKTOP DROPDOWN */}
      {isOpen && (
        <div className="hidden sm:block absolute right-0 mt-3 w-64 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden animate-slide-up z-[1000]">
          <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-2)]">
            <p className="font-bold text-[var(--text)] truncate">{appUser?.displayName || 'Користувач'}</p>
            <p className="text-xs text-[var(--text-3)] truncate">{currentUser.email}</p>
          </div>
          <div className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-2)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors">
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
          </div>
          {isAdmin && (
            <div className="p-2 border-t border-[var(--border)]">
              <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[var(--accent)] bg-[var(--accent-soft)] hover:bg-[var(--accent)] hover:text-white transition-colors">
                <Shield size={18} /> Адмін-панель
              </Link>
            </div>
          )}
          <div className="p-2 border-t border-[var(--border)]">
            <button type="button" onClick={() => { setIsOpen(false); logoutUser(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors">
              <LogOut size={18} /> Вийти
            </button>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET (Через портал, щоб не ламалося через Navbar) */}
      {isOpen && mounted && createPortal(
        <div className="sm:hidden fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-end justify-center p-3 animate-fade-in" onClick={() => setIsOpen(false)}>
          <div className="w-full rounded-[2rem] bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden animate-slide-up pb-safe" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-5 border-b border-[var(--border)] bg-[var(--surface-2)]">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--text)] truncate text-base">{appUser?.displayName || 'Користувач'}</p>
                <p className="text-xs text-[var(--text-3)] truncate">{currentUser.email}</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-medium text-[var(--text-2)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors">
                    <Icon size={20} /> {item.label}
                  </Link>
                );
              })}
            </div>
            {isAdmin && (
              <div className="px-3 pb-2">
                <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold text-[var(--accent)] bg-[var(--accent-soft)] hover:bg-[var(--accent)] hover:text-white transition-colors">
                  <Shield size={20} /> Адмін-панель
                </Link>
              </div>
            )}
            <div className="p-3 border-t border-[var(--border)] pb-8">
              <button type="button" onClick={() => { setIsOpen(false); logoutUser(); }} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-medium text-red-500 hover:bg-red-500/10 transition-colors">
                <LogOut size={20} /> Вийти
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUserNotifications, getUnreadCount, markNotificationRead } from '@/services/notification';
import { Notification } from '@/types/notification';
import { Bell, Check } from 'lucide-react';

export default function NotificationBell() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = async () => {
    if (!currentUser) return;
    try {
      const [items, count] = await Promise.all([
        getUserNotifications(currentUser.uid),
        getUnreadCount(currentUser.uid),
      ]);
      setNotifications(items.slice(0, 10));
      setUnread(count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

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

  const handleOpen = async () => {
    setOpen(!open);
    if (!open) await load();
  };

  const handleClickItem = async (n: Notification) => {
    if (n.id && !n.read) {
      await markNotificationRead(n.id);
      setUnread((c) => Math.max(0, c - 1));
      setNotifications((list) =>
        list.map((x) => (x.id === n.id ? { ...x, read: true } : x))
      );
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative w-11 h-11 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] border border-transparent hover:border-[var(--border)] transition-all active:scale-95"
        aria-label="Сповіщення"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--purple-neon)] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(192,38,255,0.6)]">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-80 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface-2)]/50">
            <span className="text-sm font-semibold">Сповіщення</span>
            <Link
              href="/account/notifications"
              className="text-xs text-[var(--purple-bright)] hover:underline"
              onClick={() => setOpen(false)}
            >
              Всі →
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-sm text-[var(--text-muted)] text-center">
                Немає сповіщень
              </p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || '/account/notifications'}
                  onClick={() => handleClickItem(n)}
                  className={`block p-4 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-2)] transition-colors ${
                    !n.read ? 'bg-[var(--purple-soft)]/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!n.read && (
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--purple-bright)] flex-shrink-0 shadow-[0_0_8px_var(--purple-bright)]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[var(--text)] leading-snug">
                        {n.title}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </div>
                      <div className="text-[10px] text-[var(--text-faint)] mt-2">
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleString('uk-UA')
                          : ''}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
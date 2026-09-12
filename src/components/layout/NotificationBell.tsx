'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getUserNotifications,
  getUnreadCount,
  markNotificationRead,
} from '@/services/notification';
import { Notification } from '@/types/notification';

export default function NotificationBell() {
  const { currentUser } = useAuth();
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
        className="relative p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-purple-neon text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-white/10 bg-[var(--surface)] shadow-lg z-50">
          <div className="p-3 border-b border-white/10 flex justify-between items-center">
            <span className="text-sm font-semibold">Notifications</span>
            <Link
              href="/account/notifications"
              className="text-xs text-purple-bright hover:underline"
              onClick={() => setOpen(false)}
            >
              View all
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-white/50">No notifications.</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || '/account/notifications'}
                  onClick={() => handleClickItem(n)}
                  className={`block p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                    !n.read ? 'bg-purple/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="mt-1 w-2 h-2 rounded-full bg-purple-bright flex-shrink-0"></span>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white/90">{n.title}</div>
                      <div className="text-xs text-white/60 line-clamp-2">{n.message}</div>
                      <div className="text-[10px] text-white/40 mt-1">
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
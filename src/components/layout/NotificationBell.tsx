'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserNotifications } from '@/services/notification';

export default function NotificationBell() {
  const { currentUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      try {
        const items = await getUserNotifications(currentUser.uid);
        setUnreadCount(items.filter((n) => !n.read).length);
      } catch (err) {
        console.error(err);
      }
    };
    load();
    // Оновлюємо кожні 30 секунд
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <Link
      href="/account/notifications"
      className="relative w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all"
      aria-label="Сповіщення"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[var(--bg)]">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

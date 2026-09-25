'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { subscribeToAdminUnreadCount } from '@/services/support';
import { MessageSquare } from 'lucide-react';

export default function SupportMessagesBell() {
  const { appUser } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (appUser?.role !== 'admin') return;
    const unsub = subscribeToAdminUnreadCount(setUnread);
    return () => unsub();
  }, [appUser]);

  if (appUser?.role !== 'admin') return null;

  return (
    <Link
      href="/admin/messages"
      aria-label="Повідомлення"
      className="relative w-11 h-11 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] border border-transparent hover:border-[var(--border)] transition-all active:scale-95"
    >
      <MessageSquare size={20} />
      {unread > 0 && (
        <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--purple-neon)] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(192,38,255,0.6)]">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  );
}
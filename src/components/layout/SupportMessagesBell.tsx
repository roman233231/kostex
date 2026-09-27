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
      className="relative w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all active:scale-95"
    >
      <MessageSquare size={18} />
      {unread > 0 && (
        <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--purple-neon)] text-white text-[9px] font-bold flex items-center justify-center">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  );
}
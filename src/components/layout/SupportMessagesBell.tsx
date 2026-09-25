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
      className="relative p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
    >
      <MessageSquare size={20} />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--purple-neon)] text-white text-[10px] font-bold flex items-center justify-center">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  );
}
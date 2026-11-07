'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders } from '@/services/order';
import { MessageSquare, ArrowRight, Clock } from 'lucide-react';
import { Order } from '@/types/order';

export default function MessagesPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [chats, setChats] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchChats = async () => {
      try {
        const orders = await getUserOrders(currentUser.uid);
        setChats(orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [currentUser]);

  return (
    <div className="animate-slide-up">
      <Reveal>
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            {t('account.messages')}
          </h1>
          <p className="text-lg text-[var(--text-3)]">Всі ваші чати з командою в одному місці</p>
        </div>
      </Reveal>

      {loading ? (
        <div className="text-center py-20 text-[var(--text-3)]">Завантаження...</div>
      ) : chats.length > 0 ? (
        <div className="space-y-4">
          {chats.map((order, i) => (
            <Reveal key={order.id} delay={i * 50}>
              <Link href={`/account/messages/${order.id}`} className="glass-card p-6 rounded-2xl flex items-center gap-6 hover:border-[var(--accent)] transition-all group block">
                <div className="w-14 h-14 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[var(--text)] mb-1 truncate">
                    Чат по замовленню: {order.productTitle}
                  </h3>
                  <p className="text-sm text-[var(--text-3)] truncate">Натисніть, щоб перейти до обговорення</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-4)]">
                  <Clock size={14} /> {new Date(order.createdAt || '').toLocaleDateString('uk-UA')}
                </div>
                <ArrowRight size={20} className="text-[var(--text-4)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal delay={80}>
          <div className="glass-card rounded-[2rem] p-10 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[var(--accent)]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 relative z-10 animate-float shadow-[0_15px_40px_-10px_var(--accent)]" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
              <MessageSquare size={40} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10 text-[var(--text)]">
              {t('account.noMessages')}
            </h2>
            <p className="text-base text-[var(--text-3)] max-w-md mx-auto mb-8 relative z-10">
              {t('account.noMessagesDesc')}
            </p>
            <Link href="/account/orders" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] font-bold hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all btn-tactile relative z-10">
              {t('account.viewOrders')} <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      )}
    </div>
  );
}

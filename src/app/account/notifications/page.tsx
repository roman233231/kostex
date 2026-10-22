'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUserNotifications, markAllRead, markNotificationRead } from '@/services/notification';
import { Notification } from '@/types/notification';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { Bell, Check, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!currentUser) return;
    try {
      const data = await getUserNotifications(currentUser.uid);
      setItems(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [currentUser]);

  const handleMarkAll = async () => {
    if (!currentUser) return;
    await markAllRead(currentUser.uid);
    load();
  };

  const handleClickItem = async (n: Notification) => {
    if (n.id && !n.read) {
      await markNotificationRead(n.id);
      load();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-slide-up max-w-4xl mx-auto">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
              {t('account.notifications')}
            </h1>
            <p className="text-lg text-[var(--text-3)]">Оновлення по ваших замовленнях та системі</p>
          </div>
          {items.some((n) => !n.read) && (
            <Button variant="outline" onClick={handleMarkAll} className="btn-tactile rounded-xl border-[var(--border)]">
              <Check size={16} className="mr-2" /> {t('account.markAll')}
            </Button>
          )}
        </div>
      </Reveal>

      {items.length === 0 ? (
        <Reveal delay={80}>
          <div className="glass-card rounded-[2rem] p-10 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 relative z-10 animate-float shadow-[0_15px_40px_-10px_rgba(236,72,153,0.6)]" style={{ background: 'linear-gradient(135deg, #EC4899, #F43F5E)' }}>
              <Bell size={40} />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10 text-[var(--text)]">
              {t('account.noNotifications')}
            </h2>
            <p className="text-base text-[var(--text-3)] max-w-md mx-auto relative z-10">
              {t('account.noNotificationsDesc')}
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="space-y-3">
          {items.map((n, i) => (
            <Reveal key={n.id} delay={i * 40}>
              <Link href={n.link || '/account/notifications'} onClick={() => handleClickItem(n)} className="block group">
                <div className={`glass-card rounded-2xl p-5 md:p-6 flex items-start gap-4 md:gap-5 transition-all duration-300 relative overflow-hidden ${!n.read ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5' : 'opacity-80 hover:opacity-100'}`}>
                  {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />}
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white shadow-lg ${!n.read ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]' : 'bg-[var(--surface-2)] text-[var(--text-4)]'}`}>
                    {!n.read ? <Bell size={20} className="animate-pulse" /> : <CheckCircle2 size={20} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className={`font-bold text-base md:text-lg ${!n.read ? 'text-[var(--text)]' : 'text-[var(--text-3)]'}`}>
                        {n.title}
                      </div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] shrink-0" />}
                    </div>
                    <div className={`text-sm leading-relaxed ${!n.read ? 'text-[var(--text-2)]' : 'text-[var(--text-4)]'}`}>
                      {n.message}
                    </div>
                    <div className="text-[10px] font-medium text-[var(--text-4)] mt-2 uppercase tracking-wider">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString('uk-UA') : ''}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[var(--surface-2)] text-[var(--text-4)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all mt-1">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUserNotifications, markAllRead, markNotificationRead } from '@/services/notification';
import { Notification } from '@/types/notification';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Reveal>
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight">{t('account.notifications')}</h1>
          {items.some((n) => !n.read) && (
            <Button variant="outline" onClick={handleMarkAll}>
              {t('account.markAll')}
            </Button>
          )}
        </div>
      </Reveal>

      {items.length === 0 ? (
        <Reveal delay={80}>
          <Card hover={false} className="text-center py-12">
            <div className="text-4xl mb-3">🔔</div>
            <h2 className="text-lg font-semibold mb-1">{t('account.noNotifications')}</h2>
            <p className="text-[var(--text-muted)] text-sm">{t('account.noNotificationsDesc')}</p>
          </Card>
        </Reveal>
      ) : (
        <div className="space-y-3">
          {items.map((n, i) => (
            <Reveal key={n.id} delay={i * 40}>
              <Link
                href={n.link || '/account/notifications'}
                onClick={() => handleClickItem(n)}
                className="block"
              >
                <Card
                  hover={false}
                  className={`cursor-pointer transition-all hover:border-[var(--border-purple)] ${
                    !n.read ? 'border-[var(--border-purple)] bg-[var(--purple)]/[0.03]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!n.read && (
                      <span className="mt-2 w-2 h-2 rounded-full bg-[var(--purple-bright)] flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{n.title}</div>
                      <div className="text-sm text-[var(--text-muted)] mt-1">{n.message}</div>
                      <div className="text-xs text-[var(--text-faint)] mt-2">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString('uk-UA') : ''}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
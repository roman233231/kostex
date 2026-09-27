'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUserNotifications, markAllRead, markNotificationRead } from '@/services/notification';
import { Notification } from '@/types/notification';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { Bell, Check, ArrowRight } from 'lucide-react';

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

  useEffect(() => {
    load();
  }, [currentUser]);

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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('account.notifications')}
          </h1>
          {items.some((n) => !n.read) && (
            <Button variant="outline" onClick={handleMarkAll}>
              <Check size={16} />
              {t('account.markAll')}
            </Button>
          )}
        </div>
      </Reveal>

      {items.length === 0 ? (
        <Reveal delay={80}>
          <div
            className="color-card"
            style={
              {
                '--card-color-1': '#EC4899',
                '--card-color-2': '#F43F5E',
                '--card-glow': 'rgba(236,72,153,0.5)',
              } as React.CSSProperties
            }
          >
            <div className="color-card-inner !p-10 md:!p-14">
              <div className="color-card-content text-center">
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto mb-5"
                  style={{
                    background: 'linear-gradient(135deg, #EC4899, #F43F5E)',
                    boxShadow: '0 12px 32px -8px rgba(236,72,153,0.6)',
                  }}
                >
                  <Bell size={28} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3">
                  {t('account.noNotifications')}
                </h2>
                <p className="text-sm md:text-base text-[var(--text-muted)] max-w-md mx-auto">
                  {t('account.noNotificationsDesc')}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      ) : (
        <div className="space-y-3">
          {items.map((n, i) => (
            <Reveal key={n.id} delay={i * 40}>
              <Link
                href={n.link || '/account/notifications'}
                onClick={() => handleClickItem(n)}
                className="block group"
              >
                <div
                  className="color-card"
                  style={
                    {
                      '--card-color-1': n.read ? '#6B7280' : '#EC4899',
                      '--card-color-2': n.read ? '#4B5563' : '#F43F5E',
                      '--card-glow': n.read
                        ? 'rgba(107,114,128,0.3)'
                        : 'rgba(236,72,153,0.5)',
                    } as React.CSSProperties
                  }
                >
                  <div className="color-card-inner">
                    <div className="color-card-content">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                          style={{
                            background: n.read
                              ? 'linear-gradient(135deg, #6B7280, #4B5563)'
                              : 'linear-gradient(135deg, #EC4899, #F43F5E)',
                          }}
                        >
                          <Bell size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-semibold text-base">{n.title}</div>
                            {!n.read && (
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{
                                  background: '#EC4899',
                                  boxShadow: '0 0 8px #EC4899',
                                }}
                              />
                            )}
                          </div>
                          <div className="text-sm text-[var(--text-muted)] leading-relaxed">
                            {n.message}
                          </div>
                          <div className="text-xs text-[var(--text-faint)] mt-2">
                            {n.createdAt
                              ? new Date(n.createdAt).toLocaleString('uk-UA')
                              : ''}
                          </div>
                        </div>

                        <ArrowRight
                          size={18}
                          className="text-[var(--text-faint)] group-hover:text-[var(--purple-bright)] group-hover:translate-x-1 transition-all shrink-0"
                        />
                      </div>
                    </div>
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
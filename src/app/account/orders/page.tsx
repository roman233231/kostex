'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUserOrders } from '@/services/order';
import { Order } from '@/types/order';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Package, Plus } from 'lucide-react';

const statusLabels: Record<string, string> = {
  'NEW': 'Нове',
  'REVIEW': 'На розгляді',
  'ACCEPTED': 'Прийнято',
  'IN DEVELOPMENT': 'В розробці',
  'CLIENT REVIEW': 'На перевірці',
  'REVISION': 'Доопрацювання',
  'COMPLETED': 'Завершено',
  'CANCELLED': 'Скасовано',
};

const statusColors: Record<string, { color1: string; color2: string; glow: string }> = {
  'NEW': { color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
  'REVIEW': { color1: '#F59E0B', color2: '#F97316', glow: 'rgba(245,158,11,0.5)' },
  'ACCEPTED': { color1: '#06B6D4', color2: '#14B8A6', glow: 'rgba(6,182,212,0.5)' },
  'IN DEVELOPMENT': { color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
  'CLIENT REVIEW': { color1: '#F97316', color2: '#F43F5E', glow: 'rgba(249,115,22,0.5)' },
  'REVISION': { color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
  'COMPLETED': { color1: '#10B981', color2: '#14B8A6', glow: 'rgba(16,185,129,0.5)' },
  'CANCELLED': { color1: '#EF4444', color2: '#F43F5E', glow: 'rgba(239,68,68,0.5)' },
};

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(currentUser.uid);
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
          {t('account.orders')}
        </h1>
        <div
          className="color-card"
          style={
            {
              '--card-color-1': '#3B82F6',
              '--card-color-2': '#06B6D4',
              '--card-glow': 'rgba(59,130,246,0.5)',
            } as React.CSSProperties
          }
        >
          <div className="color-card-inner !p-10 md:!p-14">
            <div className="color-card-content text-center">
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto mb-5"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                  boxShadow: '0 12px 32px -8px rgba(59,130,246,0.6)',
                }}
              >
                <Package size={28} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-3">
                {t('account.noOrders')}
              </h2>
              <p className="text-sm md:text-base text-[var(--text-muted)] mb-7 max-w-md mx-auto">
                {t('account.noOrdersDesc')}
              </p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] text-white font-semibold text-sm hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-[0_8px_24px_rgba(139,92,246,0.4)]"
              >
                <Plus size={16} />
                {t('account.createFirst')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
        {t('account.orders')}
      </h1>

      <div className="space-y-4">
        {orders.map((order, i) => {
          const colors = statusColors[order.status] || statusColors.NEW;
          return (
            <Reveal key={order.id} delay={i * 50}>
              <Link href={`/account/orders/${order.id}`} className="block group">
                <div
                  className="color-card"
                  style={
                    {
                      '--card-color-1': colors.color1,
                      '--card-color-2': colors.color2,
                      '--card-glow': colors.glow,
                    } as React.CSSProperties
                  }
                >
                  <div className="color-card-inner">
                    <div className="color-card-content">
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold">
                            {order.productTitle || 'Order'}
                          </h3>
                          <p className="text-sm text-[var(--text-faint)] mt-1">
                            #{order.id?.slice(0, 8)}
                          </p>
                          <p className="text-xs text-[var(--text-faint)] mt-1">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString('uk-UA')
                              : ''}
                          </p>
                        </div>

                        <div className="text-right flex items-center gap-3 shrink-0">
                          <span
                            className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                            style={{
                              background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`,
                              boxShadow: `0 6px 16px -6px ${colors.glow}`,
                            }}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                          <ArrowRight
                            size={18}
                            className="text-[var(--text-faint)] group-hover:text-[var(--purple-bright)] group-hover:translate-x-1 transition-all"
                          />
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center flex-wrap gap-2">
                        <div className="text-sm text-[var(--text-muted)]">
                          {order.finalPrice ? (
                            <>
                              <span className="text-[var(--text-faint)]">
                                {t('common.finalPrice')}:
                              </span>{' '}
                              <strong
                                style={{
                                  background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`,
                                  WebkitBackgroundClip: 'text',
                                  backgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                {order.finalPrice.toLocaleString('uk-UA')} ₴
                              </strong>
                            </>
                          ) : (
                            <>
                              <span className="text-[var(--text-faint)]">
                                {t('common.estimatedPrice')}:
                              </span>{' '}
                              <strong>
                                {order.estimatedPrice.toLocaleString('uk-UA')} ₴
                              </strong>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
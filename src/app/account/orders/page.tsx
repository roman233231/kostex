'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUserOrders } from '@/services/order';
import { Order } from '@/types/order';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

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
        <h1 className="text-3xl font-bold mb-6">{t('account.orders')}</h1>
        <Card hover={false} className="text-center py-12">
          <div className="text-4xl mb-3">📦</div>
          <h2 className="text-xl font-semibold mb-2">{t('account.noOrders')}</h2>
          <p className="text-[var(--text-muted)] mb-5">{t('account.noOrdersDesc')}</p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] text-white font-semibold text-sm hover:brightness-110 transition"
          >
            {t('account.createFirst')}
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('account.orders')}</h1>
      <div className="space-y-4">
        {orders.map((order, i) => (
          <Reveal key={order.id} delay={i * 50}>
            <div onClick={() => router.push(`/account/orders/${order.id}`)} className="cursor-pointer">
              <Card hover={false} className="transition-all hover:border-[var(--border-purple)] hover:-translate-y-0.5">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold">{order.productTitle || 'Order'}</h3>
                    <p className="text-sm text-[var(--text-faint)] mt-1">#{order.id?.slice(0, 8)}</p>
                  </div>
                  <Badge>{order.status}</Badge>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center flex-wrap gap-2">
                  <div className="text-sm text-[var(--text-muted)]">
                    {order.finalPrice ? (
                      <>
                        <span className="text-[var(--text-faint)]">{t('common.finalPrice')}:</span>{' '}
                        <strong className="text-[var(--purple-bright)]">
                          {order.finalPrice.toLocaleString('uk-UA')} ₴
                        </strong>
                      </>
                    ) : (
                      <>
                        <span className="text-[var(--text-faint)]">{t('common.estimatedPrice')}:</span>{' '}
                        <strong>{order.estimatedPrice.toLocaleString('uk-UA')} ₴</strong>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-[var(--text-faint)]">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('uk-UA')
                      : ''}
                  </div>
                </div>
              </Card>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
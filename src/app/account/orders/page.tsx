'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUserOrders } from '@/services/order';
import { Order } from '@/types/order';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Package, Plus, Calendar } from 'lucide-react';

const statusLabels: Record<string, string> = {
  'NEW': 'Нове', 'REVIEW': 'На розгляді', 'ACCEPTED': 'Прийнято',
  'IN DEVELOPMENT': 'В розробці', 'CLIENT REVIEW': 'На перевірці',
  'REVISION': 'Доопрацювання', 'COMPLETED': 'Завершено', 'CANCELLED': 'Скасовано',
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
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchOrders();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="animate-slide-up">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight text-[var(--text)]">{t('account.orders')}</h1>
        <div className="glass-card rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 relative z-10 shadow-lg" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
            <Package size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-3 relative z-10 text-[var(--text)]">{t('account.noOrders')}</h2>
          <p className="text-[var(--text-3)] mb-8 max-w-md mx-auto relative z-10">{t('account.noOrdersDesc')}</p>
          <Link href="/builder" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white font-bold hover:-translate-y-1 transition-all shadow-[0_0_20px_var(--accent)] relative z-10 btn-tactile">
            <Plus size={18} /> {t('account.createFirst')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text)]">{t('account.orders')}</h1>
        <Link href="/builder" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm font-semibold text-[var(--text)] hover:border-[var(--accent)] transition-all">
          <Plus size={16} className="text-[var(--accent)]" /> Новий проєкт
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order, i) => {
          const colors = statusColors[order.status] || statusColors.NEW;
          return (
            <Reveal key={order.id} delay={i * 50}>
              <Link href={`/account/orders/${order.id}`} className="block group">
                <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_var(--accent)] transition-all duration-300 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-50" style={{ background: colors.color1 }} />
                  
                  <div className="flex items-center gap-4 md:gap-6 flex-1">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})` }}>
                      <Package size={24} />
                    </div>
                    
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-[var(--text)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                        {order.productTitle || 'Замовлення'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[var(--text-3)]">
                        <span>#{order.id?.slice(0, 8)}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA') : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 border-[var(--border)] pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Сума</div>
                      <div className="text-lg font-bold text-[var(--text)]">
                        {order.finalPrice ? `${order.finalPrice.toLocaleString('uk-UA')} ₴` : `~ ${order.estimatedPrice.toLocaleString('uk-UA')} ₴`}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border" style={{ color: colors.color1, borderColor: `${colors.color1}40`, background: `${colors.color1}10` }}>
                        {statusLabels[order.status] || order.status}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-3)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all">
                        <ArrowRight size={16} />
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

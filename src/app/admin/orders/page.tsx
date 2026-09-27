'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders } from '@/services/admin';
import { Order } from '@/types/order';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import { Search, ArrowRight, Package } from 'lucide-react';

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

export default function AdminOrdersPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchData = async () => {
        try {
          const data = await getAllOrders();
          setOrders(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [appUser]);

  if (loading || loadingData) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  const statuses = ['ALL', 'NEW', 'REVIEW', 'ACCEPTED', 'IN DEVELOPMENT', 'CLIENT REVIEW', 'COMPLETED', 'CANCELLED'];

  const filtered = orders.filter((o) => {
    if (filter !== 'ALL' && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (o.productTitle || '').toLowerCase().includes(q) ||
        o.id?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <main className="container py-12">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Замовлення
            </h1>
            <p className="text-[var(--text-muted)] mt-2">
              {orders.length} {orders.length === 1 ? 'замовлення' : 'замовлень'} всього
            </p>
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal delay={80}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative md:max-w-xs w-full">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
              />
              <input
                type="text"
                placeholder="Пошук за назвою або ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    filter === s
                      ? 'bg-[var(--purple)] text-white border-[var(--purple)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)]'
                  }`}
                >
                  {s === 'ALL' ? 'Усі' : statusLabels[s] || s}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="card no-hover text-center py-14">
            <Package size={48} className="text-[var(--text-faint)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">Нічого не знайдено.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order, i) => {
              const colors = statusColors[order.status] || statusColors.NEW;
              return (
                <Reveal key={order.id} delay={i * 30}>
                  <Link href={`/admin/orders/${order.id}`} className="block group">
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
                              <h3 className="text-base font-semibold">
                                {order.productTitle || 'Замовлення'}
                              </h3>
                              <p className="text-xs text-[var(--text-faint)] mt-1">
                                #{order.id?.slice(0, 8)}
                              </p>
                              <p className="text-xs text-[var(--text-faint)] mt-1">
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString('uk-UA')
                                  : ''}
                              </p>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              <span
                                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                                style={{
                                  background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`,
                                  boxShadow: `0 6px 16px -6px ${colors.glow}`,
                                }}
                              >
                                {statusLabels[order.status] || order.status}
                              </span>
                              <div className="text-sm font-bold">
                                {order.finalPrice
                                  ? `${order.finalPrice.toLocaleString('uk-UA')} ₴`
                                  : `${order.estimatedPrice.toLocaleString('uk-UA')} ₴`}
                              </div>
                              <ArrowRight
                                size={18}
                                className="text-[var(--text-faint)] group-hover:text-[var(--purple-bright)] group-hover:translate-x-1 transition-all"
                              />
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
        )}
      </main>
      <Footer />
    </>
  );
}
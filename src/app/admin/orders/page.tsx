'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders } from '@/services/admin';
import { Order } from '@/types/order';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

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

const statusColors: Record<string, string> = {
  'NEW': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'REVIEW': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  'ACCEPTED': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  'IN DEVELOPMENT': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'CLIENT REVIEW': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  'REVISION': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  'COMPLETED': 'bg-green-500/10 text-green-400 border-green-500/30',
  'CANCELLED': 'bg-red-500/10 text-red-400 border-red-500/30',
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
            <Badge>Admin</Badge>
            <h1 className="text-4xl font-bold mt-4 tracking-tight">Orders</h1>
            <p className="text-[var(--text-muted)] mt-2">
              {orders.length} {orders.length === 1 ? 'замовлення' : 'замовлень'} всього
            </p>
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal delay={80}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Пошук за назвою або ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input md:max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    filter === s
                      ? 'bg-[var(--purple)] text-white border-[var(--purple)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)]'
                  }`}
                >
                  {s === 'ALL' ? 'Усі' : statusLabels[s] || s}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <p className="text-[var(--text-muted)]">Нічого не знайдено.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((order, i) => (
              <Reveal key={order.id} delay={i * 30}>
                <Link href={`/admin/orders/${order.id}`} className="block">
                  <Card
                    hover={false}
                    className="transition-all duration-300 hover:border-[var(--border-purple)] hover:-translate-y-0.5 cursor-pointer"
                  >
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
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            statusColors[order.status] || ''
                          }`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                        <div className="text-sm font-medium">
                          {order.finalPrice
                            ? `${order.finalPrice.toLocaleString('uk-UA')} ₴`
                            : `${order.estimatedPrice.toLocaleString('uk-UA')} ₴`}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
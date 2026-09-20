'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders } from '@/services/admin';
import { Order } from '@/types/order';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

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

  const statuses = ['ALL', 'NEW', 'ACCEPTED', 'IN DEVELOPMENT', 'CLIENT REVIEW', 'COMPLETED', 'CANCELLED'];

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
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal delay={80}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search by title or ID..."
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
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <p className="text-[var(--text-muted)]">No orders found.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((order, i) => (
              <Reveal key={order.id} delay={i * 30}>
                <div
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                  className="cursor-pointer"
                >
                  <Card hover={false} className="transition-all duration-300 hover:border-[var(--purple)]/40 hover:-translate-y-0.5">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold">
                          {order.productTitle || 'Order'}
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
                        <Badge>{order.status}</Badge>
                        <div className="text-sm font-medium">
                          {order.finalPrice
                            ? `${order.finalPrice.toLocaleString('uk-UA')} ₴`
                            : `${order.estimatedPrice.toLocaleString('uk-UA')} ₴`}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
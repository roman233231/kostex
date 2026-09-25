'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders, getAdminStats, AdminStats } from '@/services/admin';
import { Order } from '@/types/order';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

const adminLinks = [
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/features', label: 'Features' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/portfolio', label: 'Portfolio' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin/seed', label: '⚡ Seed Data' },
];

export default function AdminPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchData = async () => {
        try {
          const [ordersData, statsData] = await Promise.all([
            getAllOrders(),
            getAdminStats(),
          ]);
          setOrders(ordersData);
          setStats(statsData);
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

  const statCards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, accent: false },
        { label: 'New Orders', value: stats.newOrders, accent: true },
        { label: 'Active Projects', value: stats.activeOrders, accent: false },
        { label: 'Completed', value: stats.completedOrders, accent: false },
        { label: 'Clients', value: stats.totalClients, accent: false },
        { label: 'Revenue', value: `${stats.totalRevenue.toLocaleString('uk-UA')} ₴`, accent: true },
      ]
    : [];

  return (
    <>
      <Navbar />
      <main className="container py-12">
        <Reveal>
          <div className="mb-8">
            <Badge>Admin</Badge>
            <h1 className="text-4xl font-bold mt-4 tracking-tight">Dashboard</h1>
          </div>
        </Reveal>

        {/* Quick links */}
        <Reveal delay={80}>
          <div className="mb-10 flex gap-2 flex-wrap">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {statCards.map((s, i) => (
              <Reveal key={s.label} delay={i * 50}>
                <Card hover={false} className="text-center py-5">
                  <div className="text-xs text-[var(--text-faint)] uppercase tracking-wider mb-2">
                    {s.label}
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      s.accent ? 'text-[var(--purple-bright)]' : ''
                    }`}
                  >
                    {s.value}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}

        {/* Recent orders */}
        <Reveal delay={200}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-[var(--purple)] hover:underline"
            >
              View all →
            </Link>
          </div>
        </Reveal>

        {orders.length === 0 ? (
          <p className="text-[var(--text-muted)]">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 8).map((order, i) => (
              <Reveal key={order.id} delay={i * 40}>
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
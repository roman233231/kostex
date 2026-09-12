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
    return <div className="container py-16 text-center">Loading...</div>;
  }

  if (!currentUser || appUser?.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Badge>Admin</Badge>
        <h1 className="text-4xl font-bold mt-4 mb-4">Dashboard</h1>

        {/* Посилання на керування */}
        <div className="mb-8 flex gap-6 flex-wrap">
          <Link href="/admin/products" className="text-purple-bright hover:underline">
            Manage Products
          </Link>
          <Link href="/admin/features" className="text-purple-bright hover:underline">
            Manage Features
          </Link>
          <Link href="/admin/categories" className="text-purple-bright hover:underline">
            Manage Categories
          </Link>
          <Link href="/admin/clients" className="text-purple-bright hover:underline">
            Clients
          </Link>
        </div>

        {/* Статистика */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card hover={false}>
              <div className="text-sm text-white/50 uppercase tracking-wide">Total Orders</div>
              <div className="text-4xl font-bold mt-2">{stats.totalOrders}</div>
            </Card>
            <Card hover={false}>
              <div className="text-sm text-white/50 uppercase tracking-wide">New Orders</div>
              <div className="text-4xl font-bold mt-2 text-purple-bright">{stats.newOrders}</div>
            </Card>
            <Card hover={false}>
              <div className="text-sm text-white/50 uppercase tracking-wide">Active Projects</div>
              <div className="text-4xl font-bold mt-2">{stats.activeOrders}</div>
            </Card>
            <Card hover={false}>
              <div className="text-sm text-white/50 uppercase tracking-wide">Completed</div>
              <div className="text-4xl font-bold mt-2 text-green-400">{stats.completedOrders}</div>
            </Card>
            <Card hover={false}>
              <div className="text-sm text-white/50 uppercase tracking-wide">Clients</div>
              <div className="text-4xl font-bold mt-2">{stats.totalClients}</div>
            </Card>
            <Card hover={false}>
              <div className="text-sm text-white/50 uppercase tracking-wide">Revenue (Completed)</div>
              <div className="text-4xl font-bold mt-2 text-purple-bright">
                {stats.totalRevenue.toLocaleString('uk-UA')} ₴
              </div>
            </Card>
          </div>
        )}

        {/* Список замовлень */}
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-white/60">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="cursor-pointer"
              >
                <Card hover={false} className="hover:border-purple-bright transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{order.productTitle || 'Order'}</h3>
                      <p className="text-sm text-white/50">
                        Client: {order.userId} | Created:{' '}
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA') : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge>{order.status}</Badge>
                      <div className="mt-2 text-sm text-white/60">
                        {order.finalPrice
                          ? `Final: ${order.finalPrice.toLocaleString('uk-UA')} ₴`
                          : `Est: ${order.estimatedPrice.toLocaleString('uk-UA')} ₴`}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
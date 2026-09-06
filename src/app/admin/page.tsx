'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Додано
import { useAuth } from '@/context/AuthContext';
import { getAllOrders } from '@/services/admin';
import { Order } from '@/types/order';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function AdminPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchOrders = async () => {
        try {
          const data = await getAllOrders();
          setOrders(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [appUser]);

  if (loading || loadingOrders) {
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
        <h1 className="text-4xl font-bold mt-4 mb-4">Orders Dashboard</h1>

        {/* Посилання на керування продуктами */}
        <div className="mb-8">
          <Link href="/admin/products" className="text-purple-bright hover:underline">
            Manage Products
          </Link>
        </div>

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
                        Client: {order.userId} | Created: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA') : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge>{order.status}</Badge>
                      <div className="mt-2 text-sm text-white/60">
                        Est. price: {order.estimatedPrice.toLocaleString('uk-UA')} ₴
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
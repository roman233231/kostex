'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders } from '@/services/order';
import { Order } from '@/types/order';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function OrdersPage() {
  const { currentUser } = useAuth();
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
    return <div className="text-white/60">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
        <p className="text-white/60">You have no orders yet.</p>
        <Link href="/builder" className="text-purple-bright hover:underline">Create your first order</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            onClick={() => router.push(`/account/orders/${order.id}`)}
            className="cursor-pointer"
          >
            <Card hover={false} className="hover:border-purple-bright transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{order.productTitle || 'Order'}</h3>
                  <p className="text-sm text-white/50">#{order.id?.slice(0, 6)}</p>
                </div>
                <Badge>{order.status}</Badge>
              </div>
              <div className="mt-3 text-sm text-white/60">
                Price: {order.estimatedPrice.toLocaleString('uk-UA')} ₴
              </div>
              <div className="mt-1 text-sm text-white/40">
                Created: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA') : ''}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders } from '@/services/admin';
import { updateOrderStatusAndPrice } from '@/services/order';
import { getOrderMessages, sendMessage } from '@/services/message';
import { Order } from '@/types/order';
import { Message } from '@/types/message';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createNotification } from '@/services/notification';

const statuses: Order['status'][] = [
  'NEW',
  'REVIEW',
  'ACCEPTED',
  'IN DEVELOPMENT',
  'CLIENT REVIEW',
  'REVISION',
  'COMPLETED',
  'CANCELLED',
];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const { currentUser, appUser } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Order['status']>('NEW');
  const [finalPrice, setFinalPrice] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser || appUser?.role !== 'admin' || !id) return;
    const fetchData = async () => {
      try {
        const orders = await getAllOrders();
        const found = orders.find(o => o.id === id);
        if (found) {
          setOrder(found);
          setStatus(found.status);
          setFinalPrice(found.finalPrice || found.estimatedPrice);
          const msgs = await getOrderMessages(id as string);
          setMessages(msgs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser, appUser, id]);

const handleSaveStatusAndPrice = async () => {
  if (!order) return;
  setSaving(true);
  try {
    await updateOrderStatusAndPrice(
      order.id!,
      status,
      finalPrice === '' ? undefined : Number(finalPrice)
    );

    await createNotification(
      order.userId,
      'Order updated',
      `Your order status is now: ${status}`,
      `/account/orders/${order.id}`
    );

    const updatedOrder = {
      ...order,
      status,
      finalPrice: finalPrice === '' ? order.finalPrice : Number(finalPrice),
    };
    setOrder(updatedOrder);
    alert('Order updated successfully');
  } catch (err) {
    console.error(err);
    alert('Failed to update order');
  } finally {
    setSaving(false);
  }
};

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !order) return;
    setSending(true);
    try {
      await sendMessage({
        orderId: order.id!,
        userId: order.userId,
        senderId: currentUser.uid,
        senderRole: 'admin',
        text: newMessage.trim(),
        read: false,
      });
      setNewMessage('');
      const msgs = await getOrderMessages(order.id!);
      setMessages(msgs);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="container py-16 text-center">Loading...</div>;
  }

  if (!order) {
    return <div className="container py-16 text-center">Order not found.</div>;
  }

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <div className="mb-8">
          <Badge>{order.status}</Badge>
          <h1 className="text-4xl font-bold mt-4">{order.productTitle || 'Order'}</h1>
          <p className="text-white/60">Order ID: #{order.id}</p>
          <div className="mt-2 text-white/60">Client UID: {order.userId}</div>
          <div className="text-white/60">
            Estimated price: {order.estimatedPrice.toLocaleString('uk-UA')} ₴
          </div>
          {order.finalPrice && (
            <div className="text-white/60">
              Final price: {order.finalPrice.toLocaleString('uk-UA')} ₴
            </div>
          )}
          <div className="text-white/60">
            Created: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA') : ''}
          </div>
        </div>

        {/* Блок керування статусом та ціною */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Manage Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm text-white/70">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Order['status'])}
                className="mt-1 block w-full bg-surface-2 border border-white/10 rounded-md px-3 py-2 text-white"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-white/70">Final Price (UAH)</label>
              <Input
  type="number"
  value={finalPrice === '' ? '' : finalPrice}
  onChange={(e) => setFinalPrice(e.target.value === '' ? '' : Number(e.target.value))}
  placeholder="Final price"
/>
            </div>
            <div>
              <Button onClick={handleSaveStatusAndPrice} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Чат */}
        <Card>
          <h2 className="text-2xl font-semibold mb-4">Messages</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4 flex flex-col">
            {messages.length === 0 ? (
              <p className="text-white/50">No messages yet.</p>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.senderRole === 'admin'
                      ? 'bg-purple/10 border border-purple/30 self-start'
                      : 'bg-white/5 border border-white/10 self-end ml-auto'
                  }`}
                >
                  <div className="text-sm text-white/50">
                    {msg.senderRole === 'admin' ? 'KOSTEX' : 'Client'} ·{' '}
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString('uk-UA') : ''}
                  </div>
                  <div className="mt-1 text-white/90">{msg.text}</div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={sending}>
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </Card>
      </main>
      <Footer />
    </>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders } from '@/services/admin';
import { getOrderMessages, sendMessage } from '@/services/message';
import { Order } from '@/types/order';
import { Message } from '@/types/message';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const { currentUser, appUser } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!currentUser || appUser?.role !== 'admin' || !id) return;
    const fetchData = async () => {
      try {
        const orders = await getAllOrders();
        const found = orders.find(o => o.id === id);
        if (found) {
          setOrder(found);
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
          <div className="text-white/60">Estimated price: {order.estimatedPrice.toLocaleString('uk-UA')} ₴</div>
          <div className="text-white/60">Created: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA') : ''}</div>
        </div>

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
          {msg.senderRole === 'admin' ? 'KOSTEX' : 'Client'} · {msg.createdAt ? new Date(msg.createdAt).toLocaleString('uk-UA') : ''}
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
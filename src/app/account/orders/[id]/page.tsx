'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUserOrders } from '@/services/order';
import { getOrderMessages, sendMessage } from '@/services/message';
import { Order } from '@/types/order';
import { Message } from '@/types/message';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ClientOrderDetailPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!currentUser || !id) return;
    const fetchData = async () => {
      try {
        const orders = await getUserOrders(currentUser.uid);
        const found = orders.find((o) => o.id === id);
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
  }, [currentUser, id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !order) return;
    setSending(true);
    try {
      await sendMessage({
        orderId: order.id!,
        userId: order.userId,
        senderId: currentUser.uid,
        senderRole: 'client',
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
    return (
      <>
        <Navbar />
        <main className="container py-16">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="container py-16 text-center">
          <p className="text-[var(--text-muted)]">Order not found.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <div className="mb-8">
          <Badge>{order.status}</Badge>
          <h1 className="text-4xl font-bold mt-4 tracking-tight">
            {order.productTitle || 'Order'}
          </h1>
          <p className="text-[var(--text-muted)]">#{order.id}</p>

          {order.finalPrice ? (
            <div className="mt-3 text-[var(--text-secondary)]">
              <span className="text-[var(--text-faint)]">{t('common.finalPrice')}:</span>{' '}
              <span className="text-xl font-bold text-[var(--purple-bright)]">
                {order.finalPrice.toLocaleString('uk-UA')} ₴
              </span>
            </div>
          ) : (
            <div className="mt-3 text-[var(--text-muted)]">
              {t('common.estimatedPrice')}: {order.estimatedPrice.toLocaleString('uk-UA')} ₴
              <span className="text-[var(--text-faint)] text-sm ml-2">
                ({t('product.finalNote')})
              </span>
            </div>
          )}

          <div className="text-[var(--text-muted)] mt-1">
            {t('common.created')}: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA') : ''}
          </div>
        </div>

        <Card hover={false}>
          <h2 className="text-2xl font-semibold mb-4">{t('common.messages')}</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4 flex flex-col">
            {messages.length === 0 ? (
              <p className="text-[var(--text-muted)]">{t('common.noMessages')}</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble max-w-[80%] ${
                    msg.senderRole === 'admin'
                      ? 'chat-bubble admin self-start'
                      : 'chat-bubble client self-end ml-auto'
                  }`}
                >
                  <div className="text-xs opacity-60 mb-1">
                    {msg.senderRole === 'admin' ? 'KOSTEX' : t('nav.account')} ·{' '}
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString('uk-UA') : ''}
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('common.typeMessage')}
              className="flex-1"
            />
            <Button type="submit" disabled={sending}>
              {sending ? t('common.sending') : t('common.send')}
            </Button>
          </form>
        </Card>
      </main>
      <Footer />
    </>
  );
}
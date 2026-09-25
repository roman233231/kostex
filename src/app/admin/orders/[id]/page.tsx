'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders } from '@/services/admin';
import { updateOrderStatusAndPrice } from '@/services/order';
import { getOrderMessages, sendMessage } from '@/services/message';
import { createNotification } from '@/services/notification';
import { Order } from '@/types/order';
import { Message } from '@/types/message';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { ArrowLeft, Send } from 'lucide-react';

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
  const router = useRouter();
  const { currentUser, appUser } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Order['status']>('NEW');
  const [finalPrice, setFinalPrice] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    if (!currentUser || appUser?.role !== 'admin' || !id) return;
    const fetchData = async () => {
      try {
        const orders = await getAllOrders();
        const found = orders.find((o) => o.id === id);
        if (found) {
          setOrder(found);
          setStatus(found.status);
          setFinalPrice(found.finalPrice || found.estimatedPrice);
          const msgs = await getOrderMessages(id as string);
          setMessages(msgs);

          const userRef = doc(db, 'users', found.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setClientEmail(userData.email || '');
            setClientName(userData.displayName || 'Client');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser, appUser, id]);

  const handleQuickStatus = async (newStatus: Order['status']) => {
    if (!order) return;
    setSaving(true);
    try {
      await updateOrderStatusAndPrice(order.id!, newStatus, finalPrice === '' ? undefined : Number(finalPrice));

      await createNotification(
        order.userId,
        'Статус замовлення оновлено',
        `Ваше замовлення тепер: ${statusLabels[newStatus] || newStatus}`,
        `/account/orders/${order.id}`
      );

      setStatus(newStatus);
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      console.error(err);
      alert('Помилка оновлення');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrice = async () => {
    if (!order) return;
    setSaving(true);
    try {
      await updateOrderStatusAndPrice(order.id!, status, finalPrice === '' ? undefined : Number(finalPrice));
      setOrder({ ...order, finalPrice: finalPrice === '' ? order.finalPrice : Number(finalPrice) });
      alert('Ціну збережено');
    } catch (err) {
      console.error(err);
      alert('Помилка');
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
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <p className="text-[var(--text-muted)]">Замовлення не знайдено</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container py-8 md:py-12">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--purple-bright)] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Назад до замовлень
        </Link>

        {/* Header */}
        <Reveal>
          <div className="mb-8">
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  statusColors[order.status] || ''
                }`}
              >
                {statusLabels[order.status] || order.status}
              </span>
              <span className="text-xs text-[var(--text-faint)]">
                #{order.id?.slice(0, 12)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {order.productTitle || 'Замовлення'}
            </h1>
            <p className="text-[var(--text-muted)] mt-2">
              Клієнт: <strong>{clientName}</strong> · {clientEmail}
            </p>
            <p className="text-[var(--text-faint)] text-sm mt-1">
              Створено:{' '}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString('uk-UA')
                : ''}
            </p>
          </div>
        </Reveal>

        {/* Config details */}
        <Reveal delay={80}>
          <Card hover={false} className="mb-6">
            <h2 className="text-lg font-semibold mb-5">Конфігурація замовлення</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-1">
                  Продукт
                </div>
                <div className="font-medium">{order.productTitle || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-1">
                  Шаблон
                </div>
                <div className="font-medium">{order.template || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-1">
                  Дизайн
                </div>
                <div className="font-medium">{order.design || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-1">
                  Термін
                </div>
                <div className="font-medium">{order.estimatedTime || '—'}</div>
              </div>
            </div>

            {order.pages && order.pages.length > 0 && (
              <div className="mt-5">
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-2">
                  Сторінки ({order.pages.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {order.pages.map((p, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-xs"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {order.features && order.features.length > 0 && (
              <div className="mt-5">
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-2">
                  Функції ({order.features.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {order.features.map((f, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-[var(--purple-soft)] border border-[var(--border-purple)] text-xs text-[var(--purple-bright)]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {order.requirements && (
              <div className="mt-5">
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-2">
                  Побажання клієнта
                </div>
                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                  {order.requirements}
                </p>
              </div>
            )}

            {order.references && order.references.length > 0 && (
              <div className="mt-5">
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-2">
                  Референси
                </div>
                <div className="space-y-1">
                  {order.references.map((r, i) => (
                    <a
                      key={i}
                      href={r}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-[var(--purple-bright)] hover:underline truncate"
                    >
                      {r}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Reveal>

        {/* Manage order */}
        <Reveal delay={160}>
          <Card hover={false} className="mb-6 border-[var(--border-purple)]">
            <h2 className="text-lg font-semibold mb-5">Керування замовленням</h2>

            {/* Quick statuses */}
            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider text-[var(--text-faint)] mb-3">
                Швидка зміна статусу
              </div>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleQuickStatus(s)}
                    disabled={saving || s === order.status}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                      s === order.status
                        ? statusColors[s] + ' cursor-default'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple-bright)] hover:-translate-y-0.5'
                    }`}
                  >
                    {statusLabels[s] || s}
                  </button>
                ))}
              </div>
            </div>

            {/* Final price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-5 border-t border-[var(--border)]">
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-faint)] mb-2 block">
                  Орієнтовна ціна
                </label>
                <div className="text-lg font-medium text-[var(--text-muted)]">
                  {order.estimatedPrice.toLocaleString('uk-UA')} ₴
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-faint)] mb-2 block">
                  Фінальна ціна (₴)
                </label>
                <Input
                  type="number"
                  value={finalPrice === '' ? '' : finalPrice}
                  onChange={(e) =>
                    setFinalPrice(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="Введіть фінальну ціну"
                />
              </div>
              <div>
                <Button onClick={handleSavePrice} disabled={saving} className="w-full">
                  {saving ? 'Збереження...' : 'Зберегти ціну'}
                </Button>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* Chat */}
        <Reveal delay={240}>
          <Card hover={false}>
            <h2 className="text-lg font-semibold mb-5">Повідомлення з клієнтом</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto mb-4 flex flex-col">
              {messages.length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm text-center py-8">
                  Ще немає повідомлень
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.senderRole === 'admin'
                        ? 'bg-[var(--purple-soft)] border border-[var(--border-purple)] self-end ml-auto'
                        : 'bg-[var(--surface-2)] border border-[var(--border)] self-start'
                    }`}
                  >
                    <div className="text-xs text-[var(--text-faint)] mb-1">
                      {msg.senderRole === 'admin' ? 'KOSTEX' : clientName} ·{' '}
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleString('uk-UA')
                        : ''}
                    </div>
                    <div className="text-sm text-[var(--text)]">{msg.text}</div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Напишіть повідомлення..."
                className="flex-1"
              />
              <Button type="submit" disabled={sending || !newMessage.trim()}>
                <Send size={16} />
              </Button>
            </form>
          </Card>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
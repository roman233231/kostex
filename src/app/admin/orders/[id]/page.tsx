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
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Package,
  Palette,
  FileText,
  Zap,
  User as UserIcon,
  Mail,
  ExternalLink,
  Check,
} from 'lucide-react';

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

const statusColors: Record<string, { color1: string; color2: string; glow: string }> = {
  'NEW': { color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
  'REVIEW': { color1: '#F59E0B', color2: '#F97316', glow: 'rgba(245,158,11,0.5)' },
  'ACCEPTED': { color1: '#06B6D4', color2: '#14B8A6', glow: 'rgba(6,182,212,0.5)' },
  'IN DEVELOPMENT': { color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
  'CLIENT REVIEW': { color1: '#F97316', color2: '#F43F5E', glow: 'rgba(249,115,22,0.5)' },
  'REVISION': { color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
  'COMPLETED': { color1: '#10B981', color2: '#14B8A6', glow: 'rgba(16,185,129,0.5)' },
  'CANCELLED': { color1: '#EF4444', color2: '#F43F5E', glow: 'rgba(239,68,68,0.5)' },
};

const statuses: Order['status'][] = [
  'NEW', 'REVIEW', 'ACCEPTED', 'IN DEVELOPMENT',
  'CLIENT REVIEW', 'REVISION', 'COMPLETED', 'CANCELLED',
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
      await updateOrderStatusAndPrice(
        order.id!,
        newStatus,
        finalPrice === '' ? undefined : Number(finalPrice)
      );

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
      await updateOrderStatusAndPrice(
        order.id!,
        status,
        finalPrice === '' ? undefined : Number(finalPrice)
      );
      setOrder({
        ...order,
        finalPrice: finalPrice === '' ? order.finalPrice : Number(finalPrice),
      });
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

  const colors = statusColors[order.status] || statusColors.NEW;

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
          <div
            className="color-card mb-6"
            style={
              {
                '--card-color-1': colors.color1,
                '--card-color-2': colors.color2,
                '--card-glow': colors.glow,
              } as React.CSSProperties
            }
          >
            <div className="color-card-inner !p-6 md:!p-8">
              <div className="color-card-content">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`,
                      boxShadow: `0 6px 16px -6px ${colors.glow}`,
                    }}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                  <span className="text-xs text-[var(--text-faint)] font-mono">
                    #{order.id?.slice(0, 12)}
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
                  {order.productTitle || 'Замовлення'}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} className="text-[var(--text-faint)]" />
                    <span className="text-[var(--text-muted)]">Клієнт:</span>
                    <strong className="truncate">{clientName}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[var(--text-faint)]" />
                    <a
                      href={`mailto:${clientEmail}`}
                      className="text-[var(--purple-bright)] hover:underline truncate"
                    >
                      {clientEmail}
                    </a>
                  </div>
                </div>

                <div className="text-xs text-[var(--text-faint)] mt-3">
                  Створено:{' '}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString('uk-UA')
                    : ''}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Config details */}
        <Reveal delay={80}>
          <div className="card no-hover mb-6">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Package size={18} className="text-[var(--purple-bright)]" />
              Конфігурація
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-1 flex items-center gap-1.5">
                  <Package size={11} /> Продукт
                </div>
                <div className="font-medium">{order.productTitle || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-1 flex items-center gap-1.5">
                  <Palette size={11} /> Шаблон
                </div>
                <div className="font-medium">{order.template || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-1 flex items-center gap-1.5">
                  <Palette size={11} /> Дизайн
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
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-2 flex items-center gap-1.5">
                  <FileText size={11} /> Сторінки ({order.pages.length})
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
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-2 flex items-center gap-1.5">
                  <Zap size={11} /> Функції ({order.features.length})
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
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-2">
                  Побажання клієнта
                </div>
                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                  {order.requirements}
                </p>
              </div>
            )}

            {order.references && order.references.length > 0 && (
              <div className="mt-6">
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
                      className="flex items-center gap-2 text-sm text-[var(--purple-bright)] hover:underline truncate"
                    >
                      <ExternalLink size={12} className="shrink-0" />
                      <span className="truncate">{r}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Manage order */}
        <Reveal delay={160}>
          <div className="card no-hover mb-6 border-[var(--border-purple)]">
            <h2 className="text-lg font-semibold mb-5">Керування замовленням</h2>

            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider text-[var(--text-faint)] mb-3">
                Швидка зміна статусу
              </div>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => {
                  const sc = statusColors[s];
                  const isCurrent = s === order.status;
                  return (
                    <button
                      key={s}
                      onClick={() => handleQuickStatus(s)}
                      disabled={saving || isCurrent}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isCurrent
                          ? 'text-white cursor-default'
                          : 'border border-[var(--border)] text-[var(--text-muted)] hover:-translate-y-0.5 hover:text-[var(--text)]'
                      }`}
                      style={
                        isCurrent
                          ? {
                              background: `linear-gradient(135deg, ${sc.color1}, ${sc.color2})`,
                              boxShadow: `0 6px 16px -6px ${sc.glow}`,
                            }
                          : {}
                      }
                    >
                      {isCurrent && <Check size={12} strokeWidth={3} />}
                      {statusLabels[s] || s}
                    </button>
                  );
                })}
              </div>
            </div>

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
          </div>
        </Reveal>

        {/* Chat */}
        <Reveal delay={240}>
          <div
            className="color-card"
            style={
              {
                '--card-color-1': '#8B5CF6',
                '--card-color-2': '#A855F7',
                '--card-glow': 'rgba(139,92,246,0.5)',
              } as React.CSSProperties
            }
          >
            <div className="color-card-inner">
              <div className="color-card-content">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
                    }}
                  >
                    <MessageSquare size={18} />
                  </div>
                  <div className="font-semibold">Повідомлення з клієнтом</div>
                </div>

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
                            ? 'self-end ml-auto text-white'
                            : 'bg-[var(--surface-2)] border border-[var(--border)] self-start'
                        }`}
                        style={
                          msg.senderRole === 'admin'
                            ? {
                                background: 'linear-gradient(135deg, #8B5CF6, #C026FF)',
                              }
                            : {}
                        }
                      >
                        <div className="text-xs opacity-60 mb-1">
                          {msg.senderRole === 'admin' ? 'KOSTEX' : clientName} ·{' '}
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleString('uk-UA')
                            : ''}
                        </div>
                        <div className="text-sm">{msg.text}</div>
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
              </div>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
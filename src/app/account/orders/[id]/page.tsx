'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUserOrders } from '@/services/order';
import { getOrderMessages, sendMessage } from '@/services/message';
import { Order } from '@/types/order';
import { Message } from '@/types/message';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';

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
        <main className="container py-16 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
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
          <p className="text-[var(--text-muted)]">Замовлення не знайдено</p>
        </main>
        <Footer />
      </>
    );
  }

  const colors = statusColors[order.status] || statusColors.NEW;

  return (
    <>
      <Navbar />
      <main className="container py-8 md:py-12">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--purple-bright)] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Назад до замовлень
        </Link>

        {/* Header card */}
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
                  <span className="text-xs text-[var(--text-faint)]">
                    #{order.id?.slice(0, 12)}
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
                  {order.productTitle || 'Замовлення'}
                </h1>

                {order.finalPrice ? (
                  <div className="text-base md:text-lg">
                    <span className="text-[var(--text-faint)]">
                      {t('common.finalPrice')}:
                    </span>{' '}
                    <span
                      className="text-2xl font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {order.finalPrice.toLocaleString('uk-UA')} ₴
                    </span>
                  </div>
                ) : (
                  <div className="text-[var(--text-muted)]">
                    {t('common.estimatedPrice')}:{' '}
                    <strong>{order.estimatedPrice.toLocaleString('uk-UA')} ₴</strong>
                  </div>
                )}

                <div className="text-sm text-[var(--text-faint)] mt-3">
                  {t('common.created')}:{' '}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString('uk-UA')
                    : ''}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Chat card */}
        <Reveal delay={100}>
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
                  <div className="font-semibold">{t('common.messages')}</div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto mb-4 flex flex-col">
                  {messages.length === 0 ? (
                    <p className="text-[var(--text-muted)] text-sm text-center py-8">
                      {t('common.noMessages')}
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg max-w-[80%] ${
                          msg.senderRole === 'admin'
                            ? 'bg-[var(--surface-2)] border border-[var(--border)] self-start'
                            : 'self-end ml-auto text-white'
                        }`}
                        style={
                          msg.senderRole === 'client'
                            ? {
                                background:
                                  'linear-gradient(135deg, #8B5CF6, #C026FF)',
                              }
                            : {}
                        }
                      >
                        <div className="text-xs opacity-60 mb-1">
                          {msg.senderRole === 'admin' ? 'KOSTEX' : 'Ви'} ·{' '}
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
                    placeholder={t('common.typeMessage')}
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
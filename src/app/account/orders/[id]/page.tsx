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
import ReviewForm from '@/components/ui/ReviewForm';
import { getReviewByOrderId } from '@/services/review';
import { Star } from 'lucide-react';
import { Review } from '@/types/review';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import ClientPaymentBlock from '@/components/ui/ClientPaymentBlock';
import ClientLinksBlock from '@/components/ui/ClientLinksBlock';
import { ArrowLeft, Send, MessageSquare, Hash, Calendar } from 'lucide-react';

const statusLabels: Record<string, string> = {
  'NEW': 'Нове', 'REVIEW': 'На розгляді', 'ACCEPTED': 'Прийнято',
  'IN DEVELOPMENT': 'В розробці', 'CLIENT REVIEW': 'На перевірці',
  'REVISION': 'Доопрацювання', 'COMPLETED': 'Завершено', 'CANCELLED': 'Скасовано',
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
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);

  const fetchData = async () => {
    if (!currentUser || !id) return;
    try {
      const orders = await getUserOrders(currentUser.uid);
      const found = orders.find((o) => o.id === id);
      if (found) {
        setOrder(found);
        const msgs = await getOrderMessages(id as string, currentUser.uid);
        setMessages(msgs);
        if (found.status === 'COMPLETED') {
          setLoadingReview(true);
          try { setExistingReview(await getReviewByOrderId(found.id!, currentUser.uid)); } catch (e) { console.error(e); } finally { setLoadingReview(false); }
        }
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [currentUser, id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !order) return;
    setSending(true);
    try {
      await sendMessage({
        orderId: order.id!, userId: order.userId, senderId: currentUser.uid,
        senderRole: 'client', text: newMessage.trim(), read: false,
      });
      setNewMessage('');
      setMessages(await getOrderMessages(order.id!, currentUser.uid));
    } catch (err) { console.error(err); } finally { setSending(false); }
  };

  if (loading) return <div className="py-32 text-center"><div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin mx-auto" /></div>;
  if (!order) return <div className="py-32 text-center text-[var(--text-3)]">Замовлення не знайдено</div>;

  const colors = statusColors[order.status] || statusColors.NEW;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/account/orders" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-all mb-8 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Назад до замовлень
      </Link>

      <Reveal>
        <div className="glass-card rounded-[2rem] p-8 md:p-10 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none" style={{ background: `${colors.color1}20` }} />
          <div className="flex flex-wrap items-center gap-3 mb-4 relative z-10">
            <span className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border" style={{ color: colors.color1, borderColor: `${colors.color1}40`, background: `${colors.color1}10` }}>{statusLabels[order.status] || order.status}</span>
            <span className="flex items-center gap-1 text-xs font-medium text-[var(--text-4)] bg-[var(--surface-2)] px-3 py-1.5 rounded-xl"><Hash size={12} /> {order.id?.slice(0, 12)}</span>
            {order.createdAt && <span className="flex items-center gap-1 text-xs font-medium text-[var(--text-4)] bg-[var(--surface-2)] px-3 py-1.5 rounded-xl"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString('uk-UA')}</span>}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-3 text-[var(--text)] relative z-10">{order.productTitle || 'Замовлення'}</h1>
          <div className="text-2xl font-bold relative z-10" style={{ color: colors.color1 }}>
            {(order.finalPrice || order.estimatedPrice).toLocaleString('uk-UA')} ₴
          </div>
        </div>
      </Reveal>

      <ClientLinksBlock order={order} />

      {order.paymentStatus && order.paymentStatus !== 'pending' && (
        <Reveal delay={80}>
          <div className="mb-6">
            <ClientPaymentBlock order={order} onUpdate={fetchData} />
          </div>
        </Reveal>
      )}

      <Reveal delay={100}>
        <div className="glass-card rounded-[2rem] p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}><MessageSquare size={18} /></div>
            <h2 className="text-xl font-bold text-[var(--text)]">Чат з командою</h2>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto mb-4 flex flex-col">
            {messages.length === 0 ? (<div className="text-center py-10 text-[var(--text-4)] text-sm">Тут з'являться повідомлення</div>) : (
              messages.map((msg) => {
                const isAdmin = msg.senderRole === 'admin';
                return (
                  <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl ${isAdmin ? 'bg-[var(--surface-2)] border border-[var(--border)] rounded-tl-sm text-[var(--text)]' : 'bg-[var(--accent)] text-white rounded-tr-sm'}`}>
                      <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70 ${isAdmin ? 'text-[var(--text-3)]' : 'text-white/80'}`}>{isAdmin ? 'KOSTEX' : 'Ви'}</div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    <div className="text-[10px] text-[var(--text-4)] mt-1 px-1">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                  </div>
                );
              })
            )}
          </div>
          <form onSubmit={handleSend} className="flex gap-3">
            <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Напишіть повідомлення..." className="flex-1 !rounded-2xl !bg-[var(--surface-2)] !border-[var(--border)]" />
            <Button type="submit" disabled={sending || !newMessage.trim()} className="!rounded-2xl !px-6 shadow-[0_0_15px_var(--accent)] btn-tactile"><Send size={18} /></Button>
          </form>
        </div>
      </Reveal>

      {order.status === 'COMPLETED' && (
        <Reveal delay={200}>
          <div className="mt-6">
            {loadingReview ? (<div className="glass-card rounded-3xl p-8 animate-pulse"><div className="h-6 bg-[var(--surface-2)] rounded w-1/3 mb-4" /><div className="h-4 bg-[var(--surface-2)] rounded w-full" /></div>)
            : existingReview ? (
              <div className="glass-card rounded-3xl p-8 border-[var(--gold)]/30">
                <div className="flex items-center gap-2 mb-4"><Star size={24} fill="var(--gold)" stroke="var(--gold)" /><h2 className="text-xl font-bold text-[var(--text)]">{t('reviews.yourReview')}</h2></div>
                <div className="flex items-center gap-1 mb-4">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={18} fill={i < existingReview.rating ? 'var(--gold)' : 'transparent'} stroke={i < existingReview.rating ? 'var(--gold)' : 'var(--text-4)'} />))}</div>
                <p className="text-[var(--text-2)] leading-relaxed text-lg">"{existingReview.text}"</p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] text-xs font-bold uppercase tracking-wider">
                  {existingReview.approved ? <span className="text-green-500">✓ {t('reviews.published')}</span> : <span className="text-yellow-500">⏳ {t('reviews.pending')}</span>}
                </div>
              </div>
            ) : (<ReviewForm orderId={order.id!} orderTitle={order.productTitle || 'KOSTEX'} />)}
          </div>
        </Reveal>
      )}
    </div>
  );
}

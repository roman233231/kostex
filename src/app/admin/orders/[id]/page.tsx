'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types/order';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import InvoiceGenerator from '@/components/admin/InvoiceGenerator';
import { 
  ArrowLeft, Package, User, Mail, Send, Phone, 
  CheckCircle, Clock, AlertCircle, Settings, MessageCircle, 
  AtSign, Wallet, ExternalLink
} from 'lucide-react';

const statusLabels: Record<string, string> = {
  'NEW': 'Нове', 'REVIEW': 'На розгляді', 'ACCEPTED': 'Прийнято',
  'IN DEVELOPMENT': 'В розробці', 'CLIENT REVIEW': 'На перевірці',
  'REVISION': 'Доопрацювання', 'COMPLETED': 'Завершено', 'CANCELLED': 'Скасовано',
};

const statusColors: Record<string, string> = {
  'NEW': 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  'REVIEW': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  'ACCEPTED': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
  'IN DEVELOPMENT': 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  'CLIENT REVIEW': 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  'REVISION': 'bg-pink-500/10 text-pink-500 border-pink-500/30',
  'COMPLETED': 'bg-green-500/10 text-green-500 border-green-500/30',
  'CANCELLED': 'bg-red-500/10 text-red-500 border-red-500/30',
};

const contactIcons: Record<string, any> = {
  telegram: Send,
  instagram: AtSign,
  phone: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  viber: MessageCircle,
  site: MessageCircle,
};

const contactLabels: Record<string, string> = {
  telegram: 'Telegram',
  instagram: 'Instagram',
  phone: 'Телефон',
  email: 'Email',
  whatsapp: 'WhatsApp',
  viber: 'Viber',
  site: 'Чат на сайті',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { currentUser, appUser, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!authLoading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, authLoading, router]);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const ref = doc(db, 'orders', id as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setOrder({ id: snap.id, ...snap.data() } as Order);
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appUser?.role === 'admin') fetchOrder();
  }, [appUser, id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order?.id) return;
    setUpdatingStatus(true);
    try {
      const ref = doc(db, 'orders', order.id);
      await updateDoc(ref, { status: newStatus, updatedAt: new Date().toISOString() });
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      console.error(err);
      alert('Помилка зміни статусу');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container py-32 flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="container py-32 min-h-screen text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Замовлення не знайдено</h1>
          <Link href="/admin/orders"><Button>Назад до замовлень</Button></Link>
        </main>
        <Footer />
      </>
    );
  }

  const ContactIcon = order.contactPreference ? contactIcons[order.contactPreference] : MessageCircle;
  const contactLabel = order.contactPreference ? contactLabels[order.contactPreference] : 'Не вказано';

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/orders" className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[var(--text)]">
                Замовлення #{order.id?.slice(0, 8)}
              </h1>
              <p className="text-sm text-[var(--text-3)]">
                Створено {order.createdAt ? new Date(order.createdAt).toLocaleString('uk-UA') : ''}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Ліва частина: Деталі */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Загальна інформація */}
            <Reveal delay={50}>
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-1">{order.productTitle || 'Індивідуальний проєкт'}</h2>
                    <p className="text-sm text-[var(--text-3)]">Тип: {order.productId || 'custom'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[var(--text-4)] uppercase tracking-wider mb-1">Сума</div>
                    <div className="text-2xl font-bold text-gradient-animated">
                      {(order.finalPrice || order.estimatedPrice).toLocaleString('uk-UA')} ₴
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] mb-6">
                  <div>
                    <div className="text-[10px] font-bold text-[var(--text-4)] uppercase tracking-wider mb-1">Сфера</div>
                    <div className="font-semibold text-[var(--text)]">{order.template || '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[var(--text-4)] uppercase tracking-wider mb-1">Дизайн</div>
                    <div className="font-semibold text-[var(--text)]">{order.design || '—'}</div>
                  </div>
                </div>

                {order.pages && order.pages.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[10px] font-bold text-[var(--text-4)] uppercase tracking-wider mb-2">Сторінки</div>
                    <div className="flex flex-wrap gap-1.5">
                      {order.pages.map((p, i) => <span key={i} className="px-2 py-1 rounded bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text-2)]">{p}</span>)}
                    </div>
                  </div>
                )}

                {order.features && order.features.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-[var(--text-4)] uppercase tracking-wider mb-2">Фічі</div>
                    <div className="flex flex-wrap gap-1.5">
                      {order.features.map((f, i) => <span key={i} className="px-2 py-1 rounded bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-xs text-[var(--accent)]">{f}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Контакти */}
            <Reveal delay={100}>
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                  <User size={18} className="text-[var(--accent)]" /> Контакт клієнта
                </h3>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)]">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                    <ContactIcon size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-4)] uppercase tracking-wider mb-0.5">{contactLabel}</div>
                    <div className="text-lg font-bold text-[var(--text)]">{order.contactValue || 'Чат на сайті'}</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Вимоги */}
            {(order.requirements || order.references) && (
              <Reveal delay={150}>
                <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
                  <h3 className="text-lg font-bold text-[var(--text)] mb-2">Деталі від клієнта</h3>
                  {order.requirements && (
                    <div>
                      <div className="text-[10px] font-bold text-[var(--text-4)] uppercase tracking-wider mb-1">Вимоги</div>
                      <p className="text-sm text-[var(--text-2)] whitespace-pre-wrap bg-[var(--surface-2)] p-4 rounded-xl border border-[var(--border)]">{order.requirements}</p>
                    </div>
                  )}
                  {order.references && order.references.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-[var(--text-4)] uppercase tracking-wider mb-1">Референси</div>
                      <ul className="space-y-1">
                        {order.references.map((ref, i) => (
                          <li key={i}>
                            <a href={ref} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
                              <ExternalLink size={12} /> {ref}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Reveal>
            )}
          </div>

          {/* Права частина: Статус + Рахунок */}
          <div className="lg:col-span-1 space-y-6 sticky top-28">
            
            {/* Статус */}
            <Reveal delay={80}>
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-4)] mb-4">Статус замовлення</h3>
                <div className={`inline-flex px-4 py-2 rounded-xl border text-sm font-bold uppercase tracking-wider mb-4 ${statusColors[order.status] || statusColors['NEW']}`}>
                  {statusLabels[order.status] || order.status}
                </div>
                
                <div className="space-y-2 mt-4">
                  <select 
                    className="w-full p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updatingStatus}
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  {updatingStatus && <p className="text-xs text-[var(--accent)] text-center animate-pulse">Оновлення...</p>}
                </div>
              </div>
            </Reveal>

            {/* Генератор рахунків (наш новий компонент) */}
            <Reveal delay={120}>
              <InvoiceGenerator order={order} onUpdate={fetchOrder} />
            </Reveal>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

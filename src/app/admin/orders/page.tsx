'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders } from '@/services/admin';
import { Order } from '@/types/order';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import { Search, ArrowRight, Package, Calendar, Hash } from 'lucide-react';

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

export default function AdminOrdersPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) router.push('/account');
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchData = async () => {
        try {
          const data = await getAllOrders();
          setOrders(data);
        } catch (err) { console.error(err); } finally { setLoadingData(false); }
      };
      fetchData();
    }
  }, [appUser]);

  if (loading || loadingData) {
    return (
      <div className="container py-32 flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  const statuses = ['ALL', 'NEW', 'REVIEW', 'ACCEPTED', 'IN DEVELOPMENT', 'CLIENT REVIEW', 'COMPLETED', 'CANCELLED'];

  const filtered = orders.filter((o) => {
    if (filter !== 'ALL' && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (o.productTitle || '').toLowerCase().includes(q) || o.id?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-[var(--text)]">
                Керування <span className="text-gradient-animated">Замовленнями</span>
              </h1>
              <p className="text-lg text-[var(--text-3)]">
                {orders.length} всього • {orders.filter(o => o.status === 'NEW').length} нових
              </p>
            </div>
          </div>
        </Reveal>

        {/* Search & Filters */}
        <Reveal delay={80}>
          <div className="glass-card rounded-3xl p-4 md:p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative w-full lg:max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)]" />
                <input
                  type="text"
                  placeholder="Пошук за назвою або ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {statuses.map((s) => {
                  const isActive = filter === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        isActive
                          ? 'bg-[var(--accent)] text-white shadow-[0_0_15px_var(--accent)] scale-105'
                          : 'bg-[var(--surface-2)] text-[var(--text-3)] border border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-[var(--text)]'
                      }`}
                    >
                      {s === 'ALL' ? 'Усі' : statusLabels[s] || s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <Reveal delay={150}>
            <div className="glass-card rounded-[2rem] text-center py-20">
              <Package size={48} className="text-[var(--text-4)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[var(--text)] mb-2">Нічого не знайдено</h3>
              <p className="text-[var(--text-3)]">Спробуйте змінити фільтри або запит пошуку.</p>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-4">
            {filtered.map((order, i) => {
              const colors = statusColors[order.status] || statusColors.NEW;
              return (
                <Reveal key={order.id} delay={i * 30}>
                  <Link href={`/admin/orders/${order.id}`} className="block group">
                    <div className="glass-card rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_var(--accent)] transition-all duration-300 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 opacity-60" style={{ background: colors.color1 }} />
                      
                      <div className="flex items-center gap-4 md:gap-6 flex-1 pl-2">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})` }}>
                          <Package size={22} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[var(--text)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                            {order.productTitle || 'Замовлення'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[var(--text-3)]">
                            <span className="flex items-center gap-1"><Hash size={12} /> {order.id?.slice(0, 8)}</span>
                            <span className="flex items-center gap-1"><Calendar size={12} /> {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA') : ''}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 border-[var(--border)] pt-4 md:pt-0">
                        <div className="text-left md:text-right">
                          <div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Сума</div>
                          <div className="text-lg font-bold text-[var(--text)]">
                            {order.finalPrice ? `${order.finalPrice.toLocaleString('uk-UA')} ₴` : `~ ${order.estimatedPrice.toLocaleString('uk-UA')} ₴`}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border" style={{ color: colors.color1, borderColor: `${colors.color1}40`, background: `${colors.color1}10` }}>
                            {statusLabels[order.status] || order.status}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-3)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all">
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

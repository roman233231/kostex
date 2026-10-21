'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllReviews, updateReview, deleteReview, seedDemoReviews } from '@/services/review';
import { Review } from '@/types/review';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import { Star, Check, Trash2, MessageSquare, EyeOff, Sparkles, Plus } from 'lucide-react';

export default function AdminReviewsPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) router.push('/account');
  }, [currentUser, appUser, loading, router]);

  const load = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (err) { console.error(err); } finally { setLoadingData(false); }
  };

  useEffect(() => { if (appUser?.role === 'admin') load(); }, [appUser]);

  const handleApprove = async (id: string, approved: boolean) => { await updateReview(id, { approved }); load(); };
  const handleFeature = async (id: string, featured: boolean) => { await updateReview(id, { featured }); load(); };
  const handleDelete = async (id: string) => { if (!confirm('Видалити цей відгук?')) return; await deleteReview(id); load(); };

  const handleSeed = async () => {
    if (!confirm('Додати 3 тестові відгуки (5, 4, 5 зірок)?')) return;
    setSeeding(true);
    try {
      const res = await seedDemoReviews();
      if (res.skipped) alert('Тестові відгуки вже є.');
      else alert(`Додано ${res.created} тестові відгуки.`);
      await load();
    } catch (err: any) { console.error(err); alert(err.message || 'Помилка додавання'); } finally { setSeeding(false); }
  };

  if (loading || loadingData) return <div className="container py-16 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" /></div>;
  if (!currentUser || appUser?.role !== 'admin') return null;

  const filtered = reviews.filter((r) => { if (filter === 'pending') return !r.approved; if (filter === 'approved') return r.approved; return true; });
  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <>
      <Navbar />
      <main className="container py-12 max-w-5xl">
        <Reveal>
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                Керування <span className="text-gradient-animated">Відгуками</span>
              </h1>
              <p className="text-[var(--text-3)] text-lg">
                {reviews.length} всього
                {pendingCount > 0 && <span className="text-[var(--gold)] ml-2 px-3 py-1 bg-[var(--gold)]/10 rounded-full text-sm font-semibold"> · {pendingCount} на модерації</span>}
              </p>
            </div>
            
            <button 
              onClick={handleSeed} 
              disabled={seeding} 
              className="btn-tactile group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all overflow-hidden shadow-lg shadow-[var(--accent)]/30"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Plus size={18} className="relative z-10" />
              <span className="relative z-10">{seeding ? 'Додаю...' : 'Додати тестові'}</span>
            </button>
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal delay={80}>
          <div className="flex flex-wrap gap-3 mb-8 bg-[var(--surface-2)] p-2 rounded-2xl w-fit border border-[var(--border)]">
            {([{ key: 'all', label: 'Усі' }, { key: 'pending', label: 'На модерації' }, { key: 'approved', label: 'Схвалені' }] as const).map((f) => (
              <button 
                key={f.key} 
                onClick={() => setFilter(f.key)} 
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filter === f.key 
                    ? 'bg-[var(--surface)] text-white shadow-md border border-[var(--border)]' 
                    : 'text-[var(--text-3)] hover:text-white hover:bg-[var(--surface)]/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-3xl text-center py-20 animate-float">
            <MessageSquare size={64} className="text-[var(--text-4)] mx-auto mb-6 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Тут поки порожньо</h3>
            <p className="text-[var(--text-3)]">Натисніть "Додати тестові", щоб побачити приклад.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filtered.map((r, i) => (
              <Reveal key={r.id} delay={i * 50}>
                <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden group">
                  {/* Декоративне світло на фоні */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                          {(r.userName?.[0] || 'U').toUpperCase()}
                        </div>
                        {r.approved && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[var(--surface)] flex items-center justify-center">
                            <Check size={10} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-white mb-1">{r.userName}</div>
                        <div className="text-sm text-[var(--text-3)] flex flex-wrap gap-2">
                          <span className="bg-[var(--surface-2)] px-2 py-0.5 rounded-md border border-[var(--border)]">{r.userEmail || 'без email'}</span>
                          <span className="bg-[var(--surface-2)] px-2 py-0.5 rounded-md border border-[var(--border)]">{r.orderTitle || 'без замовлення'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {!r.approved && (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse">
                          Чекає модерації
                        </span>
                      )}
                      {r.featured && (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--gold)]/20 shadow-[0_0_15px_rgba(240,194,101,0.2)] flex items-center gap-1">
                          <Sparkles size={12} /> Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-4 relative z-10">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={20} fill={j < r.rating ? 'var(--gold)' : 'transparent'} stroke={j < r.rating ? 'var(--gold)' : 'var(--text-4)'} className={j < r.rating ? 'drop-shadow-[0_0_8px_rgba(240,194,101,0.5)]' : ''} />
                    ))}
                    <span className="ml-2 font-bold text-lg text-[var(--gold)]">{r.rating}.0</span>
                  </div>

                  <p className="text-[var(--text-2)] text-lg leading-relaxed mb-6 relative z-10 pl-4 border-l-2 border-[var(--accent)]/30">
                    "{r.text}"
                  </p>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-[var(--border)] relative z-10">
                    <div className="text-xs font-medium text-[var(--text-4)] bg-[var(--surface-2)] px-3 py-1.5 rounded-lg">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString('uk-UA') : ''}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {!r.approved ? (
                        <button onClick={() => handleApprove(r.id!, true)} className="btn-tactile flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold hover:bg-green-500 hover:text-white transition-all">
                          <Check size={16} /> Схвалити
                        </button>
                      ) : (
                        <button onClick={() => handleApprove(r.id!, false)} className="btn-tactile flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold hover:bg-yellow-500 hover:text-white transition-all">
                          <EyeOff size={16} /> Приховати
                        </button>
                      )}
                      <button onClick={() => handleFeature(r.id!, !r.featured)} className={`btn-tactile flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${r.featured ? 'bg-[var(--gold-soft)] border border-[var(--gold)]/30 text-[var(--gold)]' : 'border border-[var(--border)] text-[var(--text-3)] hover:border-[var(--gold)]/30 hover:text-[var(--gold)] hover:bg-[var(--gold-soft)]'}`}>
                        <Sparkles size={16} /> {r.featured ? 'Зняти з обраних' : 'В обране'}
                      </button>
                      <button onClick={() => handleDelete(r.id!)} className="btn-tactile flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--border)] text-[var(--text-3)] hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

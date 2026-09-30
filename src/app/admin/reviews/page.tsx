'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllReviews, updateReview, deleteReview } from '@/services/review';
import { Review } from '@/types/review';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import { Star, Check, X, Trash2, MessageSquare, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function AdminReviewsPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  const load = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (appUser?.role === 'admin') load();
  }, [appUser]);

  const handleApprove = async (id: string, approved: boolean) => {
    await updateReview(id, { approved });
    load();
  };

  const handleFeature = async (id: string, featured: boolean) => {
    await updateReview(id, { featured });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цей відгук?')) return;
    await deleteReview(id);
    load();
  };

  if (loading || loadingData) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return !r.approved;
    if (filter === 'approved') return r.approved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <>
      <Navbar />
      <main className="container py-12">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Відгуки
            </h1>
            <p className="text-[var(--text-3)] mt-2">
              {reviews.length} всього
              {pendingCount > 0 && (
                <span className="text-[var(--gold)]"> · {pendingCount} очікує модерації</span>
              )}
            </p>
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal delay={80}>
          <div className="flex flex-wrap gap-2 mb-6">
            {([
              { key: 'all', label: 'Усі' },
              { key: 'pending', label: 'На модерації' },
              { key: 'approved', label: 'Схвалені' },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filter === f.key
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent-border)] hover:text-[var(--accent-2)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="card no-hover text-center py-14">
            <MessageSquare size={48} className="text-[var(--text-4)] mx-auto mb-4" />
            <p className="text-[var(--text-3)]">Нічого не знайдено.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r, i) => (
              <Reveal key={r.id} delay={i * 30}>
                <div className="card no-hover">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                        }}
                      >
                        {(r.userName?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm">{r.userName}</div>
                        <div className="text-xs text-[var(--text-4)]">
                          {r.userEmail || 'без email'} · {r.orderTitle || 'без замовлення'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {r.approved ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/30">
                          Схвалено
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                          На модерації
                        </span>
                      )}
                      {r.featured && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--gold)]/30">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        fill={j < r.rating ? 'var(--gold)' : 'transparent'}
                        stroke={j < r.rating ? 'var(--gold)' : 'var(--text-3)'}
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-sm text-[var(--text-2)] leading-relaxed mb-4">
                    {r.text}
                  </p>

                  <div className="text-xs text-[var(--text-4)] mb-4">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleString('uk-UA')
                      : ''}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap pt-4 border-t border-[var(--border)]">
                    {!r.approved ? (
                      <button
                        onClick={() => handleApprove(r.id!, true)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"
                      >
                        <Check size={14} />
                        Схвалити
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApprove(r.id!, false)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium hover:bg-yellow-500/20 transition-colors"
                      >
                        <EyeOff size={14} />
                        Зняти з публікації
                      </button>
                    )}

                    <button
                      onClick={() => handleFeature(r.id!, !r.featured)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                        r.featured
                          ? 'bg-[var(--gold-soft)] border border-[var(--gold)]/30 text-[var(--gold)]'
                          : 'border border-[var(--border)] text-[var(--text-3)] hover:border-[var(--gold)]/30 hover:text-[var(--gold)]'
                      }`}
                    >
                      <Sparkles size={14} />
                      {r.featured ? 'Featured' : 'Зробити featured'}
                    </button>

                    <button
                      onClick={() => handleDelete(r.id!)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[var(--border)] text-[var(--text-3)] text-xs font-medium hover:border-red-500/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                      Видалити
                    </button>
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
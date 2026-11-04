'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import GeneralReviewForm from '@/components/ui/GeneralReviewForm';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getApprovedReviews } from '@/services/review';
import { Review } from '@/types/review';
import { Star, Quote, ArrowRight, Users, TrendingUp, MessageSquarePlus, X } from 'lucide-react';

export default function ReviewsPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadReviews = async () => {
    try {
      const data = await getApprovedReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge>{t('reviews.badge')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-5 tracking-tight leading-[1.05]">
              {t('reviews.title')}
              <br />
              <span className="gradient-text">{t('reviews.title2')}</span>
            </h1>
            <p className="text-lg text-[var(--text-3)] mt-5">
              {t('reviews.subtitle')}
            </p>
          </div>
        </Reveal>

        {/* Кнопка залишити відгук */}
        <Reveal delay={50}>
          <div className="flex justify-center mb-10">
            {currentUser ? (
              <Button onClick={() => setShowForm(true)} className="btn-tactile rounded-full px-8 py-4 text-base shadow-[0_0_20px_var(--accent)]">
                <MessageSquarePlus size={18} className="mr-2" /> Залишити відгук
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="btn-tactile rounded-full px-8 py-4 text-base">
                  <MessageSquarePlus size={18} className="mr-2" /> Увійдіть, щоб залишити відгук
                </Button>
              </Link>
            )}
          </div>
        </Reveal>

        {/* Статистика */}
        <Reveal delay={80}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill="var(--gold)" stroke="var(--gold)" />
                ))}
              </div>
              <div className="text-3xl font-bold text-gradient-animated">{avgRating}</div>
              <div className="text-xs text-[var(--text-3)] mt-1 uppercase tracking-wider">Рейтинг</div>
            </div>
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
              <Quote size={24} className="text-[var(--accent)] mb-2" />
              <div className="text-3xl font-bold">{reviews.length || '50'}+</div>
              <div className="text-xs text-[var(--text-3)] mt-1 uppercase tracking-wider">Відгуків</div>
            </div>
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
              <Users size={24} className="text-blue-500 mb-2" />
              <div className="text-3xl font-bold">50+</div>
              <div className="text-xs text-[var(--text-3)] mt-1 uppercase tracking-wider">Клієнтів</div>
            </div>
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
              <TrendingUp size={24} className="text-emerald-500 mb-2" />
              <div className="text-3xl font-bold">98%</div>
              <div className="text-xs text-[var(--text-3)] mt-1 uppercase tracking-wider">Задоволених</div>
            </div>
          </div>
        </Reveal>

        {/* Список відгуків */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card p-6">
                <div className="skeleton skeleton-line" style={{ width: '40%' }} />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" style={{ width: '80%' }} />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="card no-hover text-center py-16">
            <Quote size={48} className="text-[var(--text-4)] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Ще немає відгуків</h2>
            <p className="text-[var(--text-3)] mb-6 max-w-md mx-auto">
              Станьте першим, хто залишить відгук про роботу з KOSTEX.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 60}>
                <div className="glass-card rounded-3xl p-6 h-full flex flex-col">
                  <div className="mb-4 text-[var(--accent)] opacity-30">
                    <Quote size={28} />
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={14} fill={j < r.rating ? 'var(--gold)' : 'transparent'} stroke={j < r.rating ? 'var(--gold)' : 'var(--text-3)'} />
                    ))}
                  </div>
                  <p className="text-[var(--text-2)] leading-relaxed flex-1 mb-6 text-sm">"{r.text}"</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-[var(--border)]">
                    <div className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                      {(r.userName?.[0] || 'U').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{r.userName}</div>
                      <div className="text-xs text-[var(--text-3)] truncate">{r.orderTitle || 'Клієнт KOSTEX'}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* CTA */}
        <Reveal delay={300}>
          <div className="mt-20">
            <div className="glass-card rounded-3xl text-center py-12 md:py-16 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Хочете бути наступним?</h2>
              <p className="text-[var(--text-3)] mb-7 max-w-lg mx-auto">Почніть свій проєкт зараз і отримайте продукт, який працює на вас.</p>
              <Link href="/builder">
                <Button className="btn-lg">Почати проєкт <ArrowRight size={18} /></Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      {/* Модальне вікно форми */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg)] border border-[var(--border)] shadow-2xl">
            <div className="p-4 flex justify-end">
              <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-red-500 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 pb-6">
              <GeneralReviewForm
                onSuccess={() => {
                  setShowForm(false);
                  loadReviews();
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

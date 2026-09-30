'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { getApprovedReviews } from '@/services/review';
import { Review } from '@/types/review';
import { Star, Quote, ArrowRight, Users, TrendingUp } from 'lucide-react';

export default function ReviewsPage() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getApprovedReviews();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <>
      <Navbar />
      <main className="container py-16">
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

        {/* Stats */}
        <Reveal delay={80}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            <div className="color-card" style={{ '--card-color-1': '#F0C265', '--card-color-2': '#FFD98A', '--card-glow': 'rgba(240,194,101,0.4)' } as React.CSSProperties}>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} fill="var(--gold)" stroke="var(--gold)" />
                  ))}
                </div>
                <div className="text-3xl font-bold gradient-text-color">{avgRating}</div>
                <div className="text-xs text-[var(--text-3)] mt-1 uppercase tracking-wider">
                  Рейтинг
                </div>
              </div>
            </div>

            <div className="color-card" style={{ '--card-color-1': '#8452FF', '--card-color-2': '#9A6BFF', '--card-glow': 'rgba(132,82,255,0.4)' } as React.CSSProperties}>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center mb-2">
                  <Quote size={18} className="text-[var(--accent-2)]" />
                </div>
                <div className="text-3xl font-bold">{reviews.length || '50'}+</div>
                <div className="text-xs text-[var(--text-3)] mt-1 uppercase tracking-wider">
                  Відгуків
                </div>
              </div>
            </div>

            <div className="color-card" style={{ '--card-color-1': '#3B82F6', '--card-color-2': '#06B6D4', '--card-glow': 'rgba(59,130,246,0.4)' } as React.CSSProperties}>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-2">
                  <Users size={18} className="text-blue-400" />
                </div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-xs text-[var(--text-3)] mt-1 uppercase tracking-wider">
                  Клієнтів
                </div>
              </div>
            </div>

            <div className="color-card" style={{ '--card-color-1': '#10B981', '--card-color-2': '#14B8A6', '--card-glow': 'rgba(16,185,129,0.4)' } as React.CSSProperties}>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-2">
                  <TrendingUp size={18} className="text-emerald-400" />
                </div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-xs text-[var(--text-3)] mt-1 uppercase tracking-wider">
                  Задоволених
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Reviews grid */}
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
            <Link href="/builder">
              <Button>
                Почати проєкт <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 60}>
                <div className="card no-hover h-full flex flex-col group">
                  <div className="mb-4 text-[var(--accent-2)] opacity-30 group-hover:opacity-60 transition-opacity">
                    <Quote size={28} />
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        fill={j < r.rating ? 'var(--gold)' : 'transparent'}
                        stroke={j < r.rating ? 'var(--gold)' : 'var(--text-3)'}
                      />
                    ))}
                  </div>

                  <p className="text-[var(--text-2)] leading-relaxed flex-1 mb-6 text-sm">
                    "{r.text}"
                  </p>

                  <div className="flex items-center gap-3 pt-5 border-t border-[var(--border)]">
                    <div
                      className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                      }}
                    >
                      {(r.userName?.[0] || 'U').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{r.userName}</div>
                      <div className="text-xs text-[var(--text-3)] truncate">
                        {r.orderTitle || 'Клієнт KOSTEX'}
                      </div>
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
            <div className="card no-hover text-center py-12 md:py-16 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Хочете бути наступним?
              </h2>
              <p className="text-[var(--text-3)] mb-7 max-w-lg mx-auto">
                Почніть свій проєкт зараз і отримайте продукт, який працює на вас.
              </p>
              <Link href="/builder">
                <Button className="btn-lg">
                  Почати проєкт <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
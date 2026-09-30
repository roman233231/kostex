'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getApprovedReviews } from '@/services/review';
import { Review } from '@/types/review';
import Card from './Card';
import { Star, Quote } from 'lucide-react';

const fallbackReviews = [
  { text: 'reviews.r1', name: 'reviews.r1name', role: 'reviews.r1role', initial: 'О', rating: 5 },
  { text: 'reviews.r2', name: 'reviews.r2name', role: 'reviews.r2role', initial: 'М', rating: 5 },
  { text: 'reviews.r3', name: 'reviews.r3name', role: 'reviews.r3role', initial: 'Д', rating: 5 },
] as const;

export default function Reviews() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getApprovedReviews(6);
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Показуємо реальні відгуки, якщо є; інакше — демо
  const showReal = !loading && reviews.length > 0;

  if (showReal) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.slice(0, 6).map((r) => (
          <Card key={r.id} hover={false} className="flex flex-col">
            <div className="mb-4 text-[var(--accent-2)] opacity-30">
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

            <p className="text-[var(--text-2)] leading-relaxed flex-1 mb-6">
              "{r.text}"
            </p>

            <div className="flex items-center gap-3 pt-5 border-t border-[var(--border)]">
              <div
                className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center shrink-0"
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
          </Card>
        ))}
      </div>
    );
  }

  // Fallback — демо-відгуки
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {fallbackReviews.map((r, i) => (
        <Card key={i} hover={false} className="flex flex-col">
          <div className="mb-4 text-[var(--accent-2)] opacity-30">
            <Quote size={28} />
          </div>

          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: r.rating }).map((_, j) => (
              <Star key={j} size={14} fill="var(--gold)" stroke="var(--gold)" />
            ))}
          </div>

          <p className="text-[var(--text-2)] leading-relaxed flex-1 mb-6">
            "{t(r.text as any)}"
          </p>

          <div className="flex items-center gap-3 pt-5 border-t border-[var(--border)]">
            <div
              className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              }}
            >
              {r.initial}
            </div>
            <div>
              <div className="font-semibold text-sm">{t(r.name as any)}</div>
              <div className="text-xs text-[var(--text-3)]">{t(r.role as any)}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
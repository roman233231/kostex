'use client';

import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getApprovedReviews } from '@/services/review';
import { Review } from '@/types/review';
import Card from './Card';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const fallbackReviews = [
  { text: 'reviews.r1', name: 'reviews.r1name', role: 'reviews.r1role', initial: 'О', rating: 5 },
  { text: 'reviews.r2', name: 'reviews.r2name', role: 'reviews.r2role', initial: 'М', rating: 5 },
  { text: 'reviews.r3', name: 'reviews.r3name', role: 'reviews.r3role', initial: 'Д', rating: 5 },
  { text: 'reviews.r1', name: 'reviews.r1name', role: 'reviews.r1role', initial: 'О', rating: 5 },
  { text: 'reviews.r2', name: 'reviews.r2name', role: 'reviews.r2role', initial: 'М', rating: 5 },
] as const;

export default function Reviews() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

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

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const showReal = !loading && reviews.length > 0;
  const displayItems = showReal ? reviews : fallbackReviews;

  return (
    <div className="relative">
      {/* Кнопки навігації для ПК */}
      <div className="hidden md:flex justify-end gap-2 mb-4">
        <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Сам слайдер */}
      <div ref={sliderRef} className="reviews-slider scrollbar-hide">
        {displayItems.map((r: any, i) => (
          <Card key={i} hover={false} className="flex flex-col h-full bg-[var(--surface)] border-[var(--border)] shadow-sm">
            <div className="mb-4 text-[var(--accent)] opacity-30">
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

            <p className="text-[var(--text-2)] leading-relaxed flex-1 mb-6 text-sm md:text-base">
              "{showReal ? r.text : t(r.text)}"
            </p>

            <div className="flex items-center gap-3 pt-5 border-t border-[var(--border)]">
              <div
                className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
              >
                {showReal ? (r.userName?.[0] || 'U').toUpperCase() : r.initial}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-[var(--text)] truncate">
                  {showReal ? r.userName : t(r.name)}
                </div>
                <div className="text-xs text-[var(--text-3)] truncate">
                  {showReal ? (r.orderTitle || 'Клієнт KOSTEX') : t(r.role)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

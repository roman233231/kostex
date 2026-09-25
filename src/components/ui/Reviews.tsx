'use client';

import { useLanguage } from '@/context/LanguageContext';
import Card from './Card';

const reviews = [
  { text: 'reviews.r1', name: 'reviews.r1name', role: 'reviews.r1role', initial: 'О' },
  { text: 'reviews.r2', name: 'reviews.r2name', role: 'reviews.r2role', initial: 'М' },
  { text: 'reviews.r3', name: 'reviews.r3name', role: 'reviews.r3role', initial: 'Д' },
] as const;

export default function Reviews() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {reviews.map((r, i) => (
        <Card key={i} hover={false} className="flex flex-col">
          {/* Stars */}
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="var(--purple-bright)" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>

          {/* Text */}
          <p className="text-[var(--text-secondary)] leading-relaxed flex-1 mb-6">
            "{t(r.text as any)}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 pt-5 border-t border-[var(--border)]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] text-white font-bold flex items-center justify-center shrink-0">
              {r.initial}
            </div>
            <div>
              <div className="font-semibold text-sm">{t(r.name as any)}</div>
              <div className="text-xs text-[var(--text-muted)]">{t(r.role as any)}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Button from './Button';

const faqs = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
  { q: 'faq.q6', a: 'faq.a6' },
] as const;

export default function FAQ() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'border-[var(--border-purple)] bg-[var(--purple-soft)]'
                : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)]'
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-semibold text-base md:text-lg">
                {t(item.q as any)}
              </span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen
                    ? 'bg-[var(--purple)] text-white rotate-45'
                    : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: isOpen ? '1fr' : '0fr',
              }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[var(--text-muted)] leading-relaxed">
                  {t(item.a as any)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
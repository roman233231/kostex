'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
      <button
        onClick={() => setLang('uk')}
        className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all ${
          lang === 'uk'
            ? 'bg-gradient-to-r from-[var(--purple)] to-[var(--purple-bright)] text-white shadow-sm'
            : 'text-[var(--text-muted)] hover:text-[var(--text)]'
        }`}
        aria-label="Українська"
      >
        UA
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all ${
          lang === 'en'
            ? 'bg-gradient-to-r from-[var(--purple)] to-[var(--purple-bright)] text-white shadow-sm'
            : 'text-[var(--text-muted)] hover:text-[var(--text)]'
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
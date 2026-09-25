'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
      <button
        onClick={() => setLang('uk')}
        className={`w-9 h-9 text-xs font-bold rounded-lg transition-all active:scale-95 ${
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
        className={`w-9 h-9 text-xs font-bold rounded-lg transition-all active:scale-95 ${
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
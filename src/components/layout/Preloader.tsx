'use client';

import { useState, useEffect } from 'react';
import Logo from './Logo';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFade(true);
      setTimeout(() => setLoading(false), 500);
    }, 1500);

    return () => clearTimeout(timer1);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[var(--bg)] transition-opacity duration-500 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative">
        {/* Світіння навколо логотипу */}
        <div className="absolute inset-0 bg-[var(--accent)]/30 blur-[40px] rounded-full animate-pulse" />
        
        {/* Логотип */}
        <Logo
          size={100}
          className="relative w-24 h-24 animate-float drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]"
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        {/* Використовуємо var(--text) замість text-white */}
        <h1 className="text-2xl font-bold tracking-[0.3em] text-[var(--text)] animate-pulse">
          KOSTEX
        </h1>
        
        {/* Лінія завантаження */}
        <div className="w-48 h-1 bg-[var(--border)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] rounded-full animate-[loading_1.5s_ease-in-out_forwards]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

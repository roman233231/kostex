'use client';

import { useEffect, useState } from 'react';
import Logo from '@/components/layout/Logo';

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Показуємо прелоадер лише раз за сесію
    const shown = sessionStorage.getItem('kostex-preloader-shown');
    if (shown) {
      setVisible(false);
      return;
    }

    const fadeTimer = setTimeout(() => setFading(true), 1400);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('kostex-preloader-shown', '1');
    }, 1900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{
        background: 'var(--bg)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Animated logo */}
        <div className="relative mb-8">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.6), transparent 70%)',
              filter: 'blur(30px)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <div
            className="relative"
            style={{ animation: 'preloaderLogo 1.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}
          >
            <Logo
              size={100}
              className="w-24 h-24 drop-shadow-[0_0_60px_rgba(139,92,246,0.8)]"
            />
          </div>
        </div>

        {/* Brand text */}
        <div
          className="text-2xl md:text-3xl font-bold tracking-[0.35em] uppercase mb-2"
          style={{ animation: 'preloaderText 1.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          KOSTEX
        </div>

        <div
          className="text-[10px] md:text-xs text-[var(--text-muted)] tracking-[0.4em] uppercase"
          style={{ animation: 'preloaderText 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}
        >
          Digital Products Studio
        </div>

        {/* Loading bar */}
        <div className="mt-10 w-48 h-[2px] bg-[var(--surface-2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] rounded-full"
            style={{
              animation: 'preloaderBar 1.4s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          />
        </div>
      </div>
    </div>
  );
}
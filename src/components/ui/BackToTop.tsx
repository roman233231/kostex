'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Догори"
      className={`fixed bottom-6 left-6 z-[9997] w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(135deg, #8B5CF6, #C026FF)',
        boxShadow: '0 8px 32px rgba(139,92,246,0.5), 0 0 40px rgba(192,38,255,0.3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
      }}
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
}
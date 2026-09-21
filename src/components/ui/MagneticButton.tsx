'use client';

import { useRef, ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  strength = 20,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${(x / rect.width) * strength}px, ${
      (y / rect.height) * strength
    }px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  };

  const inner = (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'inline-block',
      }}
      className={className}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} style={{ display: 'inline-block' }}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} style={{ display: 'inline-block' }}>
      {inner}
    </button>
  );
}
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        glass-card rounded-3xl p-6 md:p-8
        ${hover ? 'transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,0.2)] cursor-pointer' : 'cursor-default'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

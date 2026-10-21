import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  href?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  href,
  disabled = false,
}: ButtonProps) {
  const baseClass = `btn btn-${variant} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (href) {
    return (
      <a href={href} className={baseClass}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={baseClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
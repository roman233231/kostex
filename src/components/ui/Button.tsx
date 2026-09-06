import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  href?: string;
}

export default function Button({ children, variant = 'primary', className = '', onClick, type = 'button', href }: ButtonProps) {
  const baseClass = `btn btn-${variant} ${className}`;
  if (href) {
    return (
      <a href={href} className={baseClass}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={baseClass} onClick={onClick}>
      {children}
    </button>
  );
}
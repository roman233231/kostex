import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';

type BaseProps = {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | LinkProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles =
      'relative overflow-hidden inline-flex items-center justify-center font-semibold transition-all duration-300 btn-tactile rounded-xl group';

    const variants = {
      primary: 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]',
      outline: 'border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10',
      ghost: 'text-[var(--text-3)] hover:text-white hover:bg-[var(--surface-2)]',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    // Ефект переливу (gloss) при наведенні
    const shine = (
      <span className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    );

    if ('href' in props && props.href !== undefined) {
      return (
        <Link href={props.href} className={combinedClassName} {...(props as LinkProps)}>
          {shine}
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </Link>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={combinedClassName} {...(props as ButtonProps)}>
        {shine}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

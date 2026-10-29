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
    
    // w-fit та shrink-0 гарантують, що кнопка не буде розтягуватися без потреби
    const baseStyles =
      'relative overflow-hidden inline-flex items-center justify-center font-semibold transition-all duration-300 btn-tactile rounded-xl whitespace-nowrap cursor-pointer w-fit shrink-0';

    const variants = {
      primary: 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.23)] hover:brightness-110 border border-transparent',
      outline: 'border border-[var(--border-strong)] text-[var(--text)] bg-transparent hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]',
      ghost: 'text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] border border-transparent',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-6 py-3 text-sm md:text-base gap-2',
      lg: 'px-8 py-4 text-base md:text-lg gap-2.5',
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if ('href' in props && props.href !== undefined) {
      const { href, ...rest } = props as LinkProps;
      return (
        <Link href={href} className={combinedClassName} {...rest}>
          <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        </Link>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={combinedClassName} {...(props as ButtonProps)}>
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

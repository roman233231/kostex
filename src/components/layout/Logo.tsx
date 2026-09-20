'use client';

import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 36, className = '' }: LogoProps) {
  const { theme } = useTheme();
  const src = theme === 'light' ? '/logo-light.png' : '/logo-dark.png';

  return (
    <Image
      src={src}
      alt="KOSTEX"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
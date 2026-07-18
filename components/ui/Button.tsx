'use client';

import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  glow?: boolean;
  href?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  glow = false,
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
    variant === 'primary' &&
      'bg-primary text-white hover:bg-primary-dark',
    variant === 'secondary' &&
      'border border-white/20 text-text hover:bg-white/5',
    variant === 'ghost' && 'text-text-muted hover:text-text',
    glow && 'hover:shadow-glow',
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

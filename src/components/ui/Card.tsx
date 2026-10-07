import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, children, glass = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-200',
        glass ? 'glass-card' : 'bg-slate-900 border border-slate-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between pb-4 mb-4 border-b border-white/5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold tracking-tight text-slate-100', className)} {...props}>
      {children}
    </h3>
  );
}

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'aqua' | 'gold';
}

export const Card: React.FC<CardProps> = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'glass',
    aqua: 'glass-aqua',
    gold: 'glass-gold',
  };
  return (
    <div 
      className={cn('p-6 rounded-3xl transition-all', variants[variant], className)} 
      {...props} 
    />
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-aqua-400 text-slate-950 hover:bg-aqua-300',
    secondary: 'bg-gold-500 text-slate-950 hover:bg-gold-400',
    ghost: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    danger: 'bg-red-500 text-white hover:bg-red-400',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button 
      className={cn(
        'rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )} 
      {...props} 
    />
  );
};

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-aqua-400 transition-colors placeholder:text-slate-600',
          className
        )}
        {...props}
      />
    );
  }
);

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-aqua-400 transition-colors appearance-none',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

export const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <label className={cn('block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 ml-1', className)}>
    {children}
  </label>
);

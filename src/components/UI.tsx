import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
interface CardProps extends React.HTMLAttributes<HTMLDivElement> { variant?: string; }
export const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={cn('p-6 rounded-3xl glass', className)} {...props} />
);
export const Button: React.FC<any> = ({ className, ...props }) => (
  <button className={cn('bg-aqua-400 text-slate-950 p-3 rounded-2xl font-bold', className)} {...props} />
);
export const Input: React.FC<any> = ({ className, ...props }) => (
  <input className={cn('bg-white/5 border border-white/10 p-3 rounded-xl', className)} {...props} />
);
export const Label: React.FC<any> = ({ children }) => <label className="text-[10px] uppercase text-slate-500">{children}</label>;
export const Select: React.FC<any> = ({ className, ...props }) => <select className={cn('bg-slate-900 text-white p-3 rounded-xl', className)} {...props} />;
export const AlertTriangle = () => <span>⚠️</span>;

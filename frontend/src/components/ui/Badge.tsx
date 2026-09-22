import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'blue' | 'emerald' | 'rose' | 'purple' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    amber: 'bg-amber-50 text-amber-800 border-amber-300',
    blue: 'bg-sky-50 text-sky-800 border-sky-300',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    rose: 'bg-rose-50 text-rose-800 border-rose-300',
    purple: 'bg-purple-50 text-purple-800 border-purple-300',
    slate: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

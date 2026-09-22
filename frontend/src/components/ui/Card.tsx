import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'outline' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'clean-card rounded-2xl p-5 bg-white',
    interactive: 'clean-card-interactive rounded-2xl p-5 bg-white cursor-pointer',
    outline: 'bg-white border border-slate-200 rounded-2xl p-5',
    flat: 'bg-slate-100 rounded-2xl p-5 border border-slate-200',
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

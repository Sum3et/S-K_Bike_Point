import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  colorScheme?: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose' | 'slate';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  colorScheme = 'amber',
  className = '',
  onClick,
}) => {
  const colorMap = {
    amber: {
      iconBg: 'bg-orange-50 text-orange-600 border border-orange-200',
      glow: 'hover:border-orange-300',
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-200',
      glow: 'hover:border-blue-300',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      glow: 'hover:border-emerald-300',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-200',
      glow: 'hover:border-purple-300',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-200',
      glow: 'hover:border-rose-300',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      glow: 'hover:border-slate-300',
    },
  };

  const scheme = colorMap[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : ''
      } ${scheme.glow} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ${scheme.iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {trend ? (
          <div
            className={`flex items-center gap-1 font-semibold ${
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{trend.value}</span>
            <span className="text-slate-400 font-normal ml-0.5">vs last week</span>
          </div>
        ) : subtitle ? (
          <span className="text-slate-500 font-medium">{subtitle}</span>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};

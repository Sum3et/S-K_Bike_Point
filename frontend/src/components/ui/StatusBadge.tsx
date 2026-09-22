import React from 'react';
import { ServiceStatus } from '../../types/dashboard';

export interface StatusBadgeProps {
  status: ServiceStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  const getStatusConfig = () => {
    switch (normalized) {
      case 'RECEIVED':
        return {
          label: 'Received',
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
          dot: 'bg-blue-600',
        };
      case 'INSPECTION':
        return {
          label: 'Inspection',
          bg: 'bg-purple-50 border-purple-200 text-purple-800',
          dot: 'bg-purple-600',
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          bg: 'bg-amber-50 border-amber-300 text-amber-900',
          dot: 'bg-amber-500 animate-pulse',
        };
      case 'READY':
        return {
          label: 'Ready for Delivery',
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          dot: 'bg-emerald-600',
        };
      case 'DELIVERED':
        return {
          label: 'Delivered',
          bg: 'bg-slate-100 border-slate-300 text-slate-700',
          dot: 'bg-slate-500',
        };
      case 'PAID':
      case 'PAID_(UPI)':
      case 'PAID_(CASH)':
      case 'PAID_(CARD)':
        return {
          label: status,
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          dot: 'bg-emerald-600',
        };
      case 'PENDING':
        return {
          label: 'Pending',
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          dot: 'bg-rose-600',
        };
      case 'ACTIVE':
        return {
          label: 'Active',
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          dot: 'bg-emerald-600',
        };
      case 'IN_SERVICE':
        return {
          label: 'In Workshop',
          bg: 'bg-amber-50 border-amber-300 text-amber-900',
          dot: 'bg-amber-500 animate-pulse',
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-100 border-slate-300 text-slate-700',
          dot: 'bg-slate-500',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};

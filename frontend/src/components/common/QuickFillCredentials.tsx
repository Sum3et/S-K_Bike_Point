import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export interface QuickFillCredentialsProps {
  onSelect: (email: string, pass: string) => void;
}

export const QuickFillCredentials: React.FC<QuickFillCredentialsProps> = ({ onSelect }) => {
  return (
    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
      <div className="flex items-center gap-1.5 text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">
        <Zap className="w-3.5 h-3.5 fill-orange-600 text-orange-600" />
        <span>1-Click Staff Access</span>
      </div>

      <button
        type="button"
        onClick={() => onSelect('admin@skbikepoint.com', 'Admin@123')}
        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-left transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-orange-100 text-orange-700 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Sanjay Kumar Yadav (Workshop Head)</div>
            <div className="text-[11px] text-slate-500 font-mono">admin@skbikepoint.com</div>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
          Auto Fill
        </span>
      </button>
    </div>
  );
};


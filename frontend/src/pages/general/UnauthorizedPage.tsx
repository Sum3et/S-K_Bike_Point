import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-200 mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-rose-600">Access Restricted</span>
        <h1 className="mt-2 text-2xl font-black text-slate-900 tracking-tight">403 — Unauthorized</h1>
        <p className="mt-2 text-xs text-slate-500 font-medium">
          You do not have administrative clearance to access this workshop area.
        </p>

        <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

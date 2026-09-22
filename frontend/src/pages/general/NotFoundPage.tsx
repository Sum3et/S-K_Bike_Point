import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Wrench, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 border border-orange-200 mb-6">
          <Wrench className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Lost on the road?</span>
        <h1 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">404 — Page Not Found</h1>
        <p className="mt-2 text-xs text-slate-500 font-medium">
          The requested page or workshop route does not exist.
        </p>

        <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Workshop Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

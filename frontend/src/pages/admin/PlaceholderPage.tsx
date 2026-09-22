import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Sparkles, Construction, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon: React.ReactNode;
  moduleName?: string;
  features?: string[];
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  subtitle,
  description,
  icon,
  moduleName = 'Feature',
  features,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 animate-in fade-in duration-200">
      <Card className="text-center p-8 sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 border border-orange-200 mb-6 shadow-sm">
          {icon}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Construction className="w-3.5 h-3.5 text-orange-600" />
          <span>{moduleName || 'Workshop'} Module • Scheduled for Phase 2</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto font-medium">
          {subtitle || description || 'This feature module will be fully unlocked in the upcoming development sprint.'}
        </p>

        {features && features.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Upcoming Capabilities:</h4>
            <ul className="space-y-1.5">
              {features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Workshop Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

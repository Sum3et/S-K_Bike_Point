import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/ui/Button';
import { QuickFillCredentials } from '../../components/common/QuickFillCredentials';
import { isValidEmail } from '../../utils/validators';
import { Wrench, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const { success, error, warning } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (new URLSearchParams(location.search).get('expired') === 'true') {
      warning('Session Expired', 'Your session has timed out. Please sign in again.');
    }
  }, [location, warning]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/customer/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim() || !isValidEmail(email)) errs.email = 'Please enter a valid email address';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login({ email, password });
      success('Welcome Back!', 'Authentication successful.');
    } catch (err: any) {
      error('Sign In Failed', err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs mb-3 hover:scale-105 transition-transform">
            <Wrench className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900 font-mono">
            S K <span className="text-orange-600">BIKE POINT</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">Workshop Staff & Management Desk</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="staff@skbikepoint.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
                className="w-full rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
                className="w-full rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.password}</p>}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Workshop Panel
            </Button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <QuickFillCredentials onSelect={(e, p) => { setEmail(e); setPassword(p); setErrors({}); }} />
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <Link to="/" className="font-bold text-slate-600 hover:text-orange-600 transition-colors inline-flex items-center gap-1">
            ← Back to S K Bike Point Website
          </Link>
        </div>
      </div>
    </div>
  );
};

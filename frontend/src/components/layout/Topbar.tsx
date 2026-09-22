import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { healthService } from '../../services/healthService';
import { Menu, LogOut, User as UserIcon, Activity, Wrench, Shield, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const [isServerUp, setIsServerUp] = useState<boolean | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await healthService.checkHealth();
        setIsServerUp(true);
      } catch {
        setIsServerUp(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 lg:px-8 shadow-xs">
      {/* Left: Mobile Menu Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm shadow-orange-600/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-black tracking-wider uppercase text-slate-900">
              S K <span className="text-orange-600">BIKE POINT</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest text-slate-600 font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
              Workshop v1.0
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Server Health & User Menu */}
      <div className="flex items-center gap-4">
        {/* Backend API Health Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs">
          <Activity className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-medium">Backend:</span>
          {isServerUp === null ? (
            <span className="text-slate-500 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
              Connecting
            </span>
          ) : isServerUp ? (
            <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
              Online
            </span>
          ) : (
            <span className="text-amber-700 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Demo Mode
            </span>
          )}
        </div>

        {/* User Profile & Actions */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 pr-2.5 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-700 border border-orange-200">
              {isAdmin ? <Shield className="w-4 h-4 text-orange-600" /> : <UserIcon className="w-4 h-4 text-blue-600" />}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[130px]">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-none">
                {isAdmin ? 'Workshop Admin' : 'Customer'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 p-2 shadow-xl z-20 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                    {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Customer Account'}
                  </span>
                </div>

                <div className="mt-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

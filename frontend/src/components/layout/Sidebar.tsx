import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { WORKSHOP_CONFIG } from '../../config/workshopConfig';
import {
  LayoutDashboard,
  Users,
  Bike,
  Wrench,
  Boxes,
  ReceiptText,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  UserCircle,
  X,
} from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Customers', path: '/admin/customers', icon: Users, badge: '128' },
    { label: 'Vehicles', path: '/admin/vehicles', icon: Bike, badge: '184' },
    { label: 'Service Jobs', path: '/admin/service-jobs', icon: Wrench, badge: '14 active', badgeColor: 'amber' },
    { label: 'Inventory & Parts', path: '/admin/inventory', icon: Boxes, badge: '4 low', badgeColor: 'rose' },
    { label: 'Invoices & Billing', path: '/admin/invoices', icon: ReceiptText },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const customerNavItems = [
    { label: 'My Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'My Vehicles', path: '/customer/vehicles', icon: Bike, badge: '2' },
    { label: 'Service History', path: '/customer/service-history', icon: Wrench },
    { label: 'My Invoices', path: '/customer/invoices', icon: ReceiptText },
    { label: 'Notifications', path: '/customer/notifications', icon: Bell, badge: '1 new', badgeColor: 'blue' },
    { label: 'My Profile', path: '/customer/profile', icon: UserCircle },
  ];

  const navItems = isAdmin ? adminNavItems : customerNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 shrink-0 flex flex-col justify-between border-r border-slate-800 bg-slate-950 p-4 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header in mobile */}
          <div className="flex items-center justify-between pb-4 mb-2 lg:hidden border-b border-slate-800">
            <span className="text-sm font-black uppercase tracking-wider text-white">
              S K <span className="text-orange-500">BIKE POINT</span>
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Header */}
          <div className="px-3 py-2 mb-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-widest text-orange-400">
              {isAdmin ? 'Workshop Administration' : 'Customer Portal'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor === 'amber'
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                              : item.badgeColor === 'rose'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : item.badgeColor === 'blue'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Support Card */}
        <div className="mt-6 rounded-2xl bg-slate-900 border border-slate-800 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-orange-400 mb-1">
            <Wrench className="w-3.5 h-3.5" />
            <span>Workshop Desk</span>
          </div>
          <p className="text-xs font-bold text-white">{WORKSHOP_CONFIG.contact.phone}</p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Mon - Sat: 9 AM - 8 PM</p>
        </div>
      </aside>
    </>
  );
};

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { HomePage } from '../pages/public/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { PlaceholderPage } from '../pages/admin/PlaceholderPage';
import { CustomerDashboardPage } from '../pages/customer/CustomerDashboardPage';
import { UnauthorizedPage } from '../pages/general/UnauthorizedPage';
import { NotFoundPage } from '../pages/general/NotFoundPage';
import { Users, Bike, Wrench, Boxes, ReceiptText, CreditCard, BarChart3, Settings, Bell, UserCircle } from 'lucide-react';

const ADMIN_PAGES = [
  { path: 'customers', title: 'Customer Management', subtitle: 'Full customer registry & contacts', icon: <Users className="w-6 h-6" />, features: ['Search & edit customer directory', 'Link multiple two-wheelers', 'Export directory'] },
  { path: 'vehicles', title: 'Two-Wheeler Vehicle Registry', subtitle: 'Motorbikes, scooters & service history', icon: <Bike className="w-6 h-6" />, features: ['Search by Reg or VIN', 'Service interval schedule', 'Historical maintenance log'] },
  { path: 'service-jobs', title: 'Service Job Cards & Kanban', subtitle: 'Workflow tracking intake to delivery', icon: <Wrench className="w-6 h-6" />, features: ['Interactive Kanban board', 'Mechanic assignment & labor hours', 'WhatsApp triggers'] },
  { path: 'inventory', title: 'Inventory & Spare Parts', subtitle: 'Stock tracking & minimum thresholds', icon: <Boxes className="w-6 h-6" />, features: ['Stock ledger for spares & oils', 'Low-stock automated alerts', 'Barcode parts checkout'] },
  { path: 'invoices', title: 'GST Invoices & Billing', subtitle: 'Tax invoices & receipts', icon: <ReceiptText className="w-6 h-6" />, features: ['GST tax invoices & tax split', '80mm POS thermal & A4 PDF', 'Discounts & labor rates'] },
  { path: 'payments', title: 'Payments & UPI Reconciliation', subtitle: 'Cash, UPI, cards & balances', icon: <CreditCard className="w-6 h-6" />, features: ['Dynamic UPI QR codes', 'Split payments & dues ledger', 'Daily register closing'] },
  { path: 'reports', title: 'Reports & Workshop Analytics', subtitle: 'Revenue, margins & mechanic output', icon: <BarChart3 className="w-6 h-6" />, features: ['Monthly revenue & profit analytics', 'Mechanic scorecard & incentives', 'CA-ready GST returns'] },
  { path: 'settings', title: 'Workshop Settings', subtitle: 'Store timing, staff & rates', icon: <Settings className="w-6 h-6" />, features: ['Workshop profile & GSTIN', 'Mechanic accounts', 'Labor rate card'] },
];

const CUSTOMER_PAGES = [
  { path: 'vehicles', title: 'My Two-Wheelers', subtitle: 'Registered bikes and scooters', icon: <Bike className="w-6 h-6" />, features: ['Vehicle details & RC photos', 'Recommended service intervals', 'Digital service handbook'] },
  { path: 'service-history', title: 'Service History & Logs', subtitle: 'Past repairs & replaced parts', icon: <Wrench className="w-6 h-6" />, features: ['Search repair records', 'OEM parts replaced & warranty', 'Invoice PDF downloads'] },
  { path: 'invoices', title: 'My Bills & Payments', subtitle: 'Tax invoice records & UPI receipts', icon: <ReceiptText className="w-6 h-6" />, features: ['Download GST tax invoices', 'Payment confirmations'] },
  { path: 'notifications', title: 'Alerts & Reminders', subtitle: 'SMS & WhatsApp workshop alerts', icon: <Bell className="w-6 h-6" />, features: ['Preventive oil change reminders', 'Live ready-for-pickup alerts'] },
  { path: 'profile', title: 'My Account Profile', subtitle: 'Contact details & security', icon: <UserCircle className="w-6 h-6" />, features: ['Update phone & email', 'Manage alerts', 'Change password'] },
];

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route element={<PublicLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
    </Route>

    <Route path="/admin" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
      {ADMIN_PAGES.map((p) => (
        <Route key={p.path} path={p.path} element={<PlaceholderPage title={p.title} subtitle={p.subtitle} icon={p.icon} features={p.features} />} />
      ))}
    </Route>

    <Route path="/customer" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><CustomerLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="/customer/dashboard" replace />} />
      <Route path="dashboard" element={<CustomerDashboardPage />} />
      {CUSTOMER_PAGES.map((p) => (
        <Route key={p.path} path={p.path} element={<PlaceholderPage title={p.title} subtitle={p.subtitle} icon={p.icon} features={p.features} />} />
      ))}
    </Route>

    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

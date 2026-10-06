import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { HomePage } from '../pages/public/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ServiceJobsPage } from '../pages/admin/ServiceJobsPage';
import { CustomersPage } from '../pages/admin/CustomersPage';
import { InventoryPage } from '../pages/admin/InventoryPage';
import { InvoicesPage } from '../pages/admin/InvoicesPage';
import { CustomerDashboardPage } from '../pages/customer/CustomerDashboardPage';
import { CustomerVehiclesPage } from '../pages/customer/CustomerVehiclesPage';
import { CustomerHistoryPage } from '../pages/customer/CustomerHistoryPage';
import { UnauthorizedPage } from '../pages/general/UnauthorizedPage';
import { NotFoundPage } from '../pages/general/NotFoundPage';

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
      <Route path="service-jobs" element={<ServiceJobsPage />} />
      <Route path="customers" element={<CustomersPage />} />
      <Route path="vehicles" element={<Navigate to="/admin/customers" replace />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="invoices" element={<InvoicesPage />} />
      <Route path="payments" element={<Navigate to="/admin/invoices" replace />} />
      <Route path="reports" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="settings" element={<Navigate to="/admin/dashboard" replace />} />
    </Route>

    <Route path="/customer" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><CustomerLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="/customer/dashboard" replace />} />
      <Route path="dashboard" element={<CustomerDashboardPage />} />
      <Route path="vehicles" element={<CustomerVehiclesPage />} />
      <Route path="service-history" element={<CustomerHistoryPage />} />
      <Route path="invoices" element={<Navigate to="/customer/service-history" replace />} />
      <Route path="notifications" element={<Navigate to="/customer/dashboard" replace />} />
      <Route path="profile" element={<Navigate to="/customer/dashboard" replace />} />
    </Route>

    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

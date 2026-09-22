import api from './api';
import { ApiResponse } from '../types/api';
import { AdminDashboardData, CustomerDashboardData } from '../types/dashboard';

export const dashboardService = {
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    const res = await api.get<ApiResponse<AdminDashboardData>>('/admin/dashboard');
    return res.data.data;
  },

  getCustomerDashboard: async (): Promise<CustomerDashboardData> => {
    const res = await api.get<ApiResponse<CustomerDashboardData>>('/customer/dashboard');
    return res.data.data;
  },
};

import api from './api';
import { ApiResponse, HealthData } from '../types/api';

export const healthService = {
  checkHealth: async (): Promise<HealthData> => {
    const response = await api.get<ApiResponse<HealthData>>('/health');
    return response.data.data;
  },
};

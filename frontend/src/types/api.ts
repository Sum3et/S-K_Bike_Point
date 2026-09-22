export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errorCode?: string;
  timestamp?: string;
}

export interface HealthData {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  database: string;
  environment: string;
}

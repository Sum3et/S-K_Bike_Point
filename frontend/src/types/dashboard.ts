export type ServiceStatus = 'RECEIVED' | 'INSPECTION' | 'IN_PROGRESS' | 'READY' | 'DELIVERED';

export interface RevenueDataPoint {
  day: string;
  revenue: number;
  jobsCompleted: number;
}

export interface ServiceJobSummary {
  jobId: string;
  customerName: string;
  vehicleModel: string;
  registrationNumber: string;
  serviceType: string;
  status: ServiceStatus;
  estimatedCost: number;
  createdDate: string;
}

export interface InventoryAlert {
  partNumber: string;
  partName: string;
  currentStock: number;
  minThreshold: number;
  category: string;
}

export interface AdminDashboardData {
  totalCustomers: number;
  totalVehicles: number;
  activeServiceJobs: number;
  todayRevenue: number;
  lowStockParts: number;
  pendingInvoices: number;
  weeklyRevenue: RevenueDataPoint[];
  recentServiceJobs: ServiceJobSummary[];
  lowStockAlerts: InventoryAlert[];
}

export interface CustomerVehicle {
  id: number;
  make: string;
  model: string;
  year: string;
  registrationNumber: string;
  mileageKm: number;
  lastServiceDate: string;
  status: 'ACTIVE' | 'IN_SERVICE';
}

export interface TrackerStep {
  stepName: string;
  description: string;
  status: 'COMPLETED' | 'CURRENT' | 'PENDING';
  timestamp: string;
}

export interface ActiveServiceTracker {
  jobId: string;
  vehicle: string;
  serviceType: string;
  currentStatus: ServiceStatus;
  progressPercentage: number;
  estimatedCompletion: string;
  assignedMechanic: string;
  steps: TrackerStep[];
}

export interface ServiceHistoryItem {
  invoiceId: string;
  vehicle: string;
  date: string;
  serviceType: string;
  totalAmount: number;
  paymentStatus: string;
}

export interface LatestInvoice {
  invoiceNumber: string;
  vehicle: string;
  date: string;
  totalAmount: number;
  status: string;
  downloadUrl: string;
}

export interface MaintenanceReminder {
  vehicle: string;
  reminderText: string;
  dueMileageOrDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CustomerDashboardData {
  customerName: string;
  totalVehicles: number;
  activeJobsCount: number;
  completedServicesCount: number;
  vehicles: CustomerVehicle[];
  activeService?: ActiveServiceTracker;
  recentServices: ServiceHistoryItem[];
  latestInvoice?: LatestInvoice;
  maintenanceReminder?: MaintenanceReminder;
}

package com.skbikepoint.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AdminDashboardDto {
    private long totalCustomers;
    private long totalVehicles;
    private long activeServiceJobs;
    private BigDecimal todayRevenue;
    private long lowStockParts;
    private long pendingInvoices;
    private List<RevenueDataPoint> weeklyRevenue;
    private List<ServiceJobSummary> recentServiceJobs;
    private List<InventoryAlert> lowStockAlerts;

    public AdminDashboardDto() {}

    public AdminDashboardDto(long totalCustomers, long totalVehicles, long activeServiceJobs, BigDecimal todayRevenue, long lowStockParts, long pendingInvoices, List<RevenueDataPoint> weeklyRevenue, List<ServiceJobSummary> recentServiceJobs, List<InventoryAlert> lowStockAlerts) {
        this.totalCustomers = totalCustomers;
        this.totalVehicles = totalVehicles;
        this.activeServiceJobs = activeServiceJobs;
        this.todayRevenue = todayRevenue;
        this.lowStockParts = lowStockParts;
        this.pendingInvoices = pendingInvoices;
        this.weeklyRevenue = weeklyRevenue;
        this.recentServiceJobs = recentServiceJobs;
        this.lowStockAlerts = lowStockAlerts;
    }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; }

    public long getActiveServiceJobs() { return activeServiceJobs; }
    public void setActiveServiceJobs(long activeServiceJobs) { this.activeServiceJobs = activeServiceJobs; }

    public BigDecimal getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(BigDecimal todayRevenue) { this.todayRevenue = todayRevenue; }

    public long getLowStockParts() { return lowStockParts; }
    public void setLowStockParts(long lowStockParts) { this.lowStockParts = lowStockParts; }

    public long getPendingInvoices() { return pendingInvoices; }
    public void setPendingInvoices(long pendingInvoices) { this.pendingInvoices = pendingInvoices; }

    public List<RevenueDataPoint> getWeeklyRevenue() { return weeklyRevenue; }
    public void setWeeklyRevenue(List<RevenueDataPoint> weeklyRevenue) { this.weeklyRevenue = weeklyRevenue; }

    public List<ServiceJobSummary> getRecentServiceJobs() { return recentServiceJobs; }
    public void setRecentServiceJobs(List<ServiceJobSummary> recentServiceJobs) { this.recentServiceJobs = recentServiceJobs; }

    public List<InventoryAlert> getLowStockAlerts() { return lowStockAlerts; }
    public void setLowStockAlerts(List<InventoryAlert> lowStockAlerts) { this.lowStockAlerts = lowStockAlerts; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalCustomers;
        private long totalVehicles;
        private long activeServiceJobs;
        private BigDecimal todayRevenue;
        private long lowStockParts;
        private long pendingInvoices;
        private List<RevenueDataPoint> weeklyRevenue;
        private List<ServiceJobSummary> recentServiceJobs;
        private List<InventoryAlert> lowStockAlerts;

        public Builder totalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; return this; }
        public Builder totalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; return this; }
        public Builder activeServiceJobs(long activeServiceJobs) { this.activeServiceJobs = activeServiceJobs; return this; }
        public Builder todayRevenue(BigDecimal todayRevenue) { this.todayRevenue = todayRevenue; return this; }
        public Builder lowStockParts(long lowStockParts) { this.lowStockParts = lowStockParts; return this; }
        public Builder pendingInvoices(long pendingInvoices) { this.pendingInvoices = pendingInvoices; return this; }
        public Builder weeklyRevenue(List<RevenueDataPoint> weeklyRevenue) { this.weeklyRevenue = weeklyRevenue; return this; }
        public Builder recentServiceJobs(List<ServiceJobSummary> recentServiceJobs) { this.recentServiceJobs = recentServiceJobs; return this; }
        public Builder lowStockAlerts(List<InventoryAlert> lowStockAlerts) { this.lowStockAlerts = lowStockAlerts; return this; }

        public AdminDashboardDto build() {
            return new AdminDashboardDto(totalCustomers, totalVehicles, activeServiceJobs, todayRevenue, lowStockParts, pendingInvoices, weeklyRevenue, recentServiceJobs, lowStockAlerts);
        }
    }

    public static class RevenueDataPoint {
        private String day;
        private BigDecimal revenue;
        private int jobsCompleted;

        public RevenueDataPoint() {}
        public RevenueDataPoint(String day, BigDecimal revenue, int jobsCompleted) {
            this.day = day;
            this.revenue = revenue;
            this.jobsCompleted = jobsCompleted;
        }

        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }
        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
        public int getJobsCompleted() { return jobsCompleted; }
        public void setJobsCompleted(int jobsCompleted) { this.jobsCompleted = jobsCompleted; }
    }

    public static class ServiceJobSummary {
        private String jobId;
        private String customerName;
        private String vehicleModel;
        private String registrationNumber;
        private String serviceType;
        private String status;
        private BigDecimal estimatedCost;
        private LocalDateTime createdDate;

        public ServiceJobSummary() {}
        public ServiceJobSummary(String jobId, String customerName, String vehicleModel, String registrationNumber, String serviceType, String status, BigDecimal estimatedCost, LocalDateTime createdDate) {
            this.jobId = jobId;
            this.customerName = customerName;
            this.vehicleModel = vehicleModel;
            this.registrationNumber = registrationNumber;
            this.serviceType = serviceType;
            this.status = status;
            this.estimatedCost = estimatedCost;
            this.createdDate = createdDate;
        }

        public String getJobId() { return jobId; }
        public void setJobId(String jobId) { this.jobId = jobId; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getVehicleModel() { return vehicleModel; }
        public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
        public String getRegistrationNumber() { return registrationNumber; }
        public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
        public String getServiceType() { return serviceType; }
        public void setServiceType(String serviceType) { this.serviceType = serviceType; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public BigDecimal getEstimatedCost() { return estimatedCost; }
        public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }
        public LocalDateTime getCreatedDate() { return createdDate; }
        public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    }

    public static class InventoryAlert {
        private String partNumber;
        private String partName;
        private int currentStock;
        private int minThreshold;
        private String category;

        public InventoryAlert() {}
        public InventoryAlert(String partNumber, String partName, int currentStock, int minThreshold, String category) {
            this.partNumber = partNumber;
            this.partName = partName;
            this.currentStock = currentStock;
            this.minThreshold = minThreshold;
            this.category = category;
        }

        public String getPartNumber() { return partNumber; }
        public void setPartNumber(String partNumber) { this.partNumber = partNumber; }
        public String getPartName() { return partName; }
        public void setPartName(String partName) { this.partName = partName; }
        public int getCurrentStock() { return currentStock; }
        public void setCurrentStock(int currentStock) { this.currentStock = currentStock; }
        public int getMinThreshold() { return minThreshold; }
        public void setMinThreshold(int minThreshold) { this.minThreshold = minThreshold; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }
}

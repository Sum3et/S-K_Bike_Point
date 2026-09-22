package com.skbikepoint.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class RevenueDataPoint {
        private String day;
        private BigDecimal revenue;
        private int jobsCompleted;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ServiceJobSummary {
        private String jobId;
        private String customerName;
        private String vehicleModel;
        private String registrationNumber;
        private String serviceType;
        private String status;
        private BigDecimal estimatedCost;
        private LocalDateTime createdDate;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class InventoryAlert {
        private String partNumber;
        private String partName;
        private int currentStock;
        private int minThreshold;
        private String category;
    }
}

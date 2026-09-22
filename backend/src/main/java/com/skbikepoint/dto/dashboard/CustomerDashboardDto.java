package com.skbikepoint.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDashboardDto {
    private String customerName;
    private int totalVehicles;
    private int activeJobsCount;
    private int completedServicesCount;
    private List<CustomerVehicle> vehicles;
    private ActiveServiceTracker activeService;
    private List<ServiceHistoryItem> recentServices;
    private LatestInvoice latestInvoice;
    private MaintenanceReminder maintenanceReminder;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CustomerVehicle {
        private Long id;
        private String make;
        private String model;
        private String year;
        private String registrationNumber;
        private int mileageKm;
        private String lastServiceDate;
        private String status;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ActiveServiceTracker {
        private String jobId;
        private String vehicle;
        private String serviceType;
        private String currentStatus;
        private int progressPercentage;
        private String estimatedCompletion;
        private String assignedMechanic;
        private List<TrackerStep> steps;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TrackerStep {
        private String stepName;
        private String description;
        private String status;
        private String timestamp;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ServiceHistoryItem {
        private String invoiceId;
        private String vehicle;
        private LocalDate date;
        private String serviceType;
        private BigDecimal totalAmount;
        private String paymentStatus;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class LatestInvoice {
        private String invoiceNumber;
        private String vehicle;
        private LocalDate date;
        private BigDecimal totalAmount;
        private String status;
        private String downloadUrl;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MaintenanceReminder {
        private String vehicle;
        private String reminderText;
        private String dueMileageOrDate;
        private String priority;
    }
}

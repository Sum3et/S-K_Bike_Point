package com.skbikepoint.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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

    public CustomerDashboardDto() {}

    public CustomerDashboardDto(String customerName, int totalVehicles, int activeJobsCount, int completedServicesCount, List<CustomerVehicle> vehicles, ActiveServiceTracker activeService, List<ServiceHistoryItem> recentServices, LatestInvoice latestInvoice, MaintenanceReminder maintenanceReminder) {
        this.customerName = customerName;
        this.totalVehicles = totalVehicles;
        this.activeJobsCount = activeJobsCount;
        this.completedServicesCount = completedServicesCount;
        this.vehicles = vehicles;
        this.activeService = activeService;
        this.recentServices = recentServices;
        this.latestInvoice = latestInvoice;
        this.maintenanceReminder = maintenanceReminder;
    }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public int getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(int totalVehicles) { this.totalVehicles = totalVehicles; }

    public int getActiveJobsCount() { return activeJobsCount; }
    public void setActiveJobsCount(int activeJobsCount) { this.activeJobsCount = activeJobsCount; }

    public int getCompletedServicesCount() { return completedServicesCount; }
    public void setCompletedServicesCount(int completedServicesCount) { this.completedServicesCount = completedServicesCount; }

    public List<CustomerVehicle> getVehicles() { return vehicles; }
    public void setVehicles(List<CustomerVehicle> vehicles) { this.vehicles = vehicles; }

    public ActiveServiceTracker getActiveService() { return activeService; }
    public void setActiveService(ActiveServiceTracker activeService) { this.activeService = activeService; }

    public List<ServiceHistoryItem> getRecentServices() { return recentServices; }
    public void setRecentServices(List<ServiceHistoryItem> recentServices) { this.recentServices = recentServices; }

    public LatestInvoice getLatestInvoice() { return latestInvoice; }
    public void setLatestInvoice(LatestInvoice latestInvoice) { this.latestInvoice = latestInvoice; }

    public MaintenanceReminder getMaintenanceReminder() { return maintenanceReminder; }
    public void setMaintenanceReminder(MaintenanceReminder maintenanceReminder) { this.maintenanceReminder = maintenanceReminder; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String customerName;
        private int totalVehicles;
        private int activeJobsCount;
        private int completedServicesCount;
        private List<CustomerVehicle> vehicles;
        private ActiveServiceTracker activeService;
        private List<ServiceHistoryItem> recentServices;
        private LatestInvoice latestInvoice;
        private MaintenanceReminder maintenanceReminder;

        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder totalVehicles(int totalVehicles) { this.totalVehicles = totalVehicles; return this; }
        public Builder activeJobsCount(int activeJobsCount) { this.activeJobsCount = activeJobsCount; return this; }
        public Builder completedServicesCount(int completedServicesCount) { this.completedServicesCount = completedServicesCount; return this; }
        public Builder vehicles(List<CustomerVehicle> vehicles) { this.vehicles = vehicles; return this; }
        public Builder activeService(ActiveServiceTracker activeService) { this.activeService = activeService; return this; }
        public Builder recentServices(List<ServiceHistoryItem> recentServices) { this.recentServices = recentServices; return this; }
        public Builder latestInvoice(LatestInvoice latestInvoice) { this.latestInvoice = latestInvoice; return this; }
        public Builder maintenanceReminder(MaintenanceReminder maintenanceReminder) { this.maintenanceReminder = maintenanceReminder; return this; }

        public CustomerDashboardDto build() {
            return new CustomerDashboardDto(customerName, totalVehicles, activeJobsCount, completedServicesCount, vehicles, activeService, recentServices, latestInvoice, maintenanceReminder);
        }
    }

    public static class CustomerVehicle {
        private Long id;
        private String make;
        private String model;
        private String year;
        private String registrationNumber;
        private int mileageKm;
        private String lastServiceDate;
        private String status;

        public CustomerVehicle() {}
        public CustomerVehicle(Long id, String make, String model, String year, String registrationNumber, int mileageKm, String lastServiceDate, String status) {
            this.id = id;
            this.make = make;
            this.model = model;
            this.year = year;
            this.registrationNumber = registrationNumber;
            this.mileageKm = mileageKm;
            this.lastServiceDate = lastServiceDate;
            this.status = status;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getMake() { return make; }
        public void setMake(String make) { this.make = make; }
        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
        public String getYear() { return year; }
        public void setYear(String year) { this.year = year; }
        public String getRegistrationNumber() { return registrationNumber; }
        public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
        public int getMileageKm() { return mileageKm; }
        public void setMileageKm(int mileageKm) { this.mileageKm = mileageKm; }
        public String getLastServiceDate() { return lastServiceDate; }
        public void setLastServiceDate(String lastServiceDate) { this.lastServiceDate = lastServiceDate; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class ActiveServiceTracker {
        private String jobId;
        private String vehicle;
        private String serviceType;
        private String currentStatus;
        private int progressPercentage;
        private String estimatedCompletion;
        private String assignedMechanic;
        private List<TrackerStep> steps;

        public ActiveServiceTracker() {}
        public ActiveServiceTracker(String jobId, String vehicle, String serviceType, String currentStatus, int progressPercentage, String estimatedCompletion, String assignedMechanic, List<TrackerStep> steps) {
            this.jobId = jobId;
            this.vehicle = vehicle;
            this.serviceType = serviceType;
            this.currentStatus = currentStatus;
            this.progressPercentage = progressPercentage;
            this.estimatedCompletion = estimatedCompletion;
            this.assignedMechanic = assignedMechanic;
            this.steps = steps;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String jobId;
            private String vehicle;
            private String serviceType;
            private String currentStatus;
            private int progressPercentage;
            private String estimatedCompletion;
            private String assignedMechanic;
            private List<TrackerStep> steps;

            public Builder jobId(String jobId) { this.jobId = jobId; return this; }
            public Builder vehicle(String vehicle) { this.vehicle = vehicle; return this; }
            public Builder serviceType(String serviceType) { this.serviceType = serviceType; return this; }
            public Builder currentStatus(String currentStatus) { this.currentStatus = currentStatus; return this; }
            public Builder progressPercentage(int progressPercentage) { this.progressPercentage = progressPercentage; return this; }
            public Builder estimatedCompletion(String estimatedCompletion) { this.estimatedCompletion = estimatedCompletion; return this; }
            public Builder assignedMechanic(String assignedMechanic) { this.assignedMechanic = assignedMechanic; return this; }
            public Builder steps(List<TrackerStep> steps) { this.steps = steps; return this; }

            public ActiveServiceTracker build() {
                return new ActiveServiceTracker(jobId, vehicle, serviceType, currentStatus, progressPercentage, estimatedCompletion, assignedMechanic, steps);
            }
        }

        public String getJobId() { return jobId; }
        public void setJobId(String jobId) { this.jobId = jobId; }
        public String getVehicle() { return vehicle; }
        public void setVehicle(String vehicle) { this.vehicle = vehicle; }
        public String getServiceType() { return serviceType; }
        public void setServiceType(String serviceType) { this.serviceType = serviceType; }
        public String getCurrentStatus() { return currentStatus; }
        public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }
        public int getProgressPercentage() { return progressPercentage; }
        public void setProgressPercentage(int progressPercentage) { this.progressPercentage = progressPercentage; }
        public String getEstimatedCompletion() { return estimatedCompletion; }
        public void setEstimatedCompletion(String estimatedCompletion) { this.estimatedCompletion = estimatedCompletion; }
        public String getAssignedMechanic() { return assignedMechanic; }
        public void setAssignedMechanic(String assignedMechanic) { this.assignedMechanic = assignedMechanic; }
        public List<TrackerStep> getSteps() { return steps; }
        public void setSteps(List<TrackerStep> steps) { this.steps = steps; }
    }

    public static class TrackerStep {
        private String stepName;
        private String description;
        private String status;
        private String timestamp;

        public TrackerStep() {}
        public TrackerStep(String stepName, String description, String status, String timestamp) {
            this.stepName = stepName;
            this.description = description;
            this.status = status;
            this.timestamp = timestamp;
        }

        public String getStepName() { return stepName; }
        public void setStepName(String stepName) { this.stepName = stepName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    }

    public static class ServiceHistoryItem {
        private String invoiceId;
        private String vehicle;
        private LocalDate date;
        private String serviceType;
        private BigDecimal totalAmount;
        private String paymentStatus;

        public ServiceHistoryItem() {}
        public ServiceHistoryItem(String invoiceId, String vehicle, LocalDate date, String serviceType, BigDecimal totalAmount, String paymentStatus) {
            this.invoiceId = invoiceId;
            this.vehicle = vehicle;
            this.date = date;
            this.serviceType = serviceType;
            this.totalAmount = totalAmount;
            this.paymentStatus = paymentStatus;
        }

        public String getInvoiceId() { return invoiceId; }
        public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }
        public String getVehicle() { return vehicle; }
        public void setVehicle(String vehicle) { this.vehicle = vehicle; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public String getServiceType() { return serviceType; }
        public void setServiceType(String serviceType) { this.serviceType = serviceType; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public String getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    }

    public static class LatestInvoice {
        private String invoiceNumber;
        private String vehicle;
        private LocalDate date;
        private BigDecimal totalAmount;
        private String status;
        private String downloadUrl;

        public LatestInvoice() {}
        public LatestInvoice(String invoiceNumber, String vehicle, LocalDate date, BigDecimal totalAmount, String status, String downloadUrl) {
            this.invoiceNumber = invoiceNumber;
            this.vehicle = vehicle;
            this.date = date;
            this.totalAmount = totalAmount;
            this.status = status;
            this.downloadUrl = downloadUrl;
        }

        public String getInvoiceNumber() { return invoiceNumber; }
        public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
        public String getVehicle() { return vehicle; }
        public void setVehicle(String vehicle) { this.vehicle = vehicle; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDownloadUrl() { return downloadUrl; }
        public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    }

    public static class MaintenanceReminder {
        private String vehicle;
        private String reminderText;
        private String dueMileageOrDate;
        private String priority;

        public MaintenanceReminder() {}
        public MaintenanceReminder(String vehicle, String reminderText, String dueMileageOrDate, String priority) {
            this.vehicle = vehicle;
            this.reminderText = reminderText;
            this.dueMileageOrDate = dueMileageOrDate;
            this.priority = priority;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String vehicle;
            private String reminderText;
            private String dueMileageOrDate;
            private String priority;

            public Builder vehicle(String vehicle) { this.vehicle = vehicle; return this; }
            public Builder reminderText(String reminderText) { this.reminderText = reminderText; return this; }
            public Builder dueMileageOrDate(String dueMileageOrDate) { this.dueMileageOrDate = dueMileageOrDate; return this; }
            public Builder priority(String priority) { this.priority = priority; return this; }

            public MaintenanceReminder build() {
                return new MaintenanceReminder(vehicle, reminderText, dueMileageOrDate, priority);
            }
        }

        public String getVehicle() { return vehicle; }
        public void setVehicle(String vehicle) { this.vehicle = vehicle; }
        public String getReminderText() { return reminderText; }
        public void setReminderText(String reminderText) { this.reminderText = reminderText; }
        public String getDueMileageOrDate() { return dueMileageOrDate; }
        public void setDueMileageOrDate(String dueMileageOrDate) { this.dueMileageOrDate = dueMileageOrDate; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
    }
}

package com.skbikepoint.dto.job;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class JobCardDto {
    private Long id;
    private String jobNumber;
    private Long vehicleId;
    private String vehicleRegistration;
    private String vehicleModel;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private String serviceType;
    private String status;
    private Integer stageNumber;
    private String stageName;
    private String assignedMechanic;
    private String estimatedCompletion;
    private String diagnosticNotes;
    private BigDecimal laborCharges;
    private BigDecimal partsTotal;
    private BigDecimal grandTotal;
    private List<JobPartDto> parts;
    private LocalDateTime createdAt;

    public JobCardDto() {}

    public JobCardDto(Long id, String jobNumber, Long vehicleId, String vehicleRegistration, String vehicleModel, Long customerId, String customerName, String customerPhone, String serviceType, String status, Integer stageNumber, String stageName, String assignedMechanic, String estimatedCompletion, String diagnosticNotes, BigDecimal laborCharges, BigDecimal partsTotal, BigDecimal grandTotal, List<JobPartDto> parts, LocalDateTime createdAt) {
        this.id = id;
        this.jobNumber = jobNumber;
        this.vehicleId = vehicleId;
        this.vehicleRegistration = vehicleRegistration;
        this.vehicleModel = vehicleModel;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.serviceType = serviceType;
        this.status = status;
        this.stageNumber = stageNumber;
        this.stageName = stageName;
        this.assignedMechanic = assignedMechanic;
        this.estimatedCompletion = estimatedCompletion;
        this.diagnosticNotes = diagnosticNotes;
        this.laborCharges = laborCharges;
        this.partsTotal = partsTotal;
        this.grandTotal = grandTotal;
        this.parts = parts;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public String getVehicleRegistration() { return vehicleRegistration; }
    public void setVehicleRegistration(String vehicleRegistration) { this.vehicleRegistration = vehicleRegistration; }

    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getStageNumber() { return stageNumber; }
    public void setStageNumber(Integer stageNumber) { this.stageNumber = stageNumber; }

    public String getStageName() { return stageName; }
    public void setStageName(String stageName) { this.stageName = stageName; }

    public String getAssignedMechanic() { return assignedMechanic; }
    public void setAssignedMechanic(String assignedMechanic) { this.assignedMechanic = assignedMechanic; }

    public String getEstimatedCompletion() { return estimatedCompletion; }
    public void setEstimatedCompletion(String estimatedCompletion) { this.estimatedCompletion = estimatedCompletion; }

    public String getDiagnosticNotes() { return diagnosticNotes; }
    public void setDiagnosticNotes(String diagnosticNotes) { this.diagnosticNotes = diagnosticNotes; }

    public BigDecimal getLaborCharges() { return laborCharges; }
    public void setLaborCharges(BigDecimal laborCharges) { this.laborCharges = laborCharges; }

    public BigDecimal getPartsTotal() { return partsTotal; }
    public void setPartsTotal(BigDecimal partsTotal) { this.partsTotal = partsTotal; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }

    public List<JobPartDto> getParts() { return parts; }
    public void setParts(List<JobPartDto> parts) { this.parts = parts; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String jobNumber;
        private Long vehicleId;
        private String vehicleRegistration;
        private String vehicleModel;
        private Long customerId;
        private String customerName;
        private String customerPhone;
        private String serviceType;
        private String status;
        private Integer stageNumber;
        private String stageName;
        private String assignedMechanic;
        private String estimatedCompletion;
        private String diagnosticNotes;
        private BigDecimal laborCharges;
        private BigDecimal partsTotal;
        private BigDecimal grandTotal;
        private List<JobPartDto> parts;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder jobNumber(String jobNumber) { this.jobNumber = jobNumber; return this; }
        public Builder vehicleId(Long vehicleId) { this.vehicleId = vehicleId; return this; }
        public Builder vehicleRegistration(String vehicleRegistration) { this.vehicleRegistration = vehicleRegistration; return this; }
        public Builder vehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; return this; }
        public Builder customerId(Long customerId) { this.customerId = customerId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder customerPhone(String customerPhone) { this.customerPhone = customerPhone; return this; }
        public Builder serviceType(String serviceType) { this.serviceType = serviceType; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder stageNumber(Integer stageNumber) { this.stageNumber = stageNumber; return this; }
        public Builder stageName(String stageName) { this.stageName = stageName; return this; }
        public Builder assignedMechanic(String assignedMechanic) { this.assignedMechanic = assignedMechanic; return this; }
        public Builder estimatedCompletion(String estimatedCompletion) { this.estimatedCompletion = estimatedCompletion; return this; }
        public Builder diagnosticNotes(String diagnosticNotes) { this.diagnosticNotes = diagnosticNotes; return this; }
        public Builder laborCharges(BigDecimal laborCharges) { this.laborCharges = laborCharges; return this; }
        public Builder partsTotal(BigDecimal partsTotal) { this.partsTotal = partsTotal; return this; }
        public Builder grandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; return this; }
        public Builder parts(List<JobPartDto> parts) { this.parts = parts; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public JobCardDto build() {
            return new JobCardDto(id, jobNumber, vehicleId, vehicleRegistration, vehicleModel, customerId, customerName, customerPhone, serviceType, status, stageNumber, stageName, assignedMechanic, estimatedCompletion, diagnosticNotes, laborCharges, partsTotal, grandTotal, parts, createdAt);
        }
    }

    public static class JobPartDto {
        private Long id;
        private Long partId;
        private String partName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        public JobPartDto() {}
        public JobPartDto(Long id, Long partId, String partName, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice) {
            this.id = id;
            this.partId = partId;
            this.partName = partName;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.totalPrice = totalPrice;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id;
            private Long partId;
            private String partName;
            private Integer quantity;
            private BigDecimal unitPrice;
            private BigDecimal totalPrice;

            public Builder id(Long id) { this.id = id; return this; }
            public Builder partId(Long partId) { this.partId = partId; return this; }
            public Builder partName(String partName) { this.partName = partName; return this; }
            public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
            public Builder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
            public Builder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }

            public JobPartDto build() {
                return new JobPartDto(id, partId, partName, quantity, unitPrice, totalPrice);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getPartId() { return partId; }
        public void setPartId(Long partId) { this.partId = partId; }
        public String getPartName() { return partName; }
        public void setPartName(String partName) { this.partName = partName; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
        public BigDecimal getTotalPrice() { return totalPrice; }
        public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    }
}

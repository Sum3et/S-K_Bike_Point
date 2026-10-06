package com.skbikepoint.dto.job;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class JobCardRequest {
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotBlank(message = "Service type is required")
    private String serviceType;

    private String status;
    private Integer stageNumber;
    private String stageName;
    private String assignedMechanic;
    private String estimatedCompletion;
    private String diagnosticNotes;
    private BigDecimal laborCharges;
    private List<JobCardPartItem> parts;

    public JobCardRequest() {}

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

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

    public List<JobCardPartItem> getParts() { return parts; }
    public void setParts(List<JobCardPartItem> parts) { this.parts = parts; }

    public static class JobCardPartItem {
        private Long partId;
        private String partName;
        private Integer quantity;
        private BigDecimal unitPrice;

        public JobCardPartItem() {}
        public JobCardPartItem(Long partId, String partName, Integer quantity, BigDecimal unitPrice) {
            this.partId = partId;
            this.partName = partName;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
        }

        public Long getPartId() { return partId; }
        public void setPartId(Long partId) { this.partId = partId; }

        public String getPartName() { return partName; }
        public void setPartName(String partName) { this.partName = partName; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    }
}

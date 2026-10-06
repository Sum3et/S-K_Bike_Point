package com.skbikepoint.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_cards", indexes = {
    @Index(name = "idx_job_number", columnList = "job_number", unique = true)
})
public class JobCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String jobNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(nullable = false, length = 100)
    private String serviceType;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(nullable = false)
    private Integer stageNumber;

    @Column(nullable = false, length = 100)
    private String stageName;

    @Column(length = 80)
    private String assignedMechanic;

    @Column(length = 50)
    private String estimatedCompletion;

    @Column(columnDefinition = "TEXT")
    private String diagnosticNotes;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal laborCharges = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal partsTotal = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal grandTotal = BigDecimal.ZERO;

    @OneToMany(mappedBy = "jobCard", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobCardPart> parts = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public JobCard() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

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

    public List<JobCardPart> getParts() { return parts; }
    public void setParts(List<JobCardPart> parts) { this.parts = parts; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String jobNumber;
        private Vehicle vehicle;
        private User customer;
        private String serviceType;
        private String status;
        private Integer stageNumber = 1;
        private String stageName;
        private String assignedMechanic;
        private String estimatedCompletion;
        private String diagnosticNotes;
        private BigDecimal laborCharges = BigDecimal.ZERO;
        private BigDecimal partsTotal = BigDecimal.ZERO;
        private BigDecimal grandTotal = BigDecimal.ZERO;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder jobNumber(String jobNumber) { this.jobNumber = jobNumber; return this; }
        public Builder vehicle(Vehicle vehicle) { this.vehicle = vehicle; return this; }
        public Builder customer(User customer) { this.customer = customer; return this; }
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

        public JobCard build() {
            JobCard j = new JobCard();
            j.id = this.id;
            j.jobNumber = this.jobNumber;
            j.vehicle = this.vehicle;
            j.customer = this.customer;
            j.serviceType = this.serviceType;
            j.status = this.status;
            j.stageNumber = this.stageNumber;
            j.stageName = this.stageName;
            j.assignedMechanic = this.assignedMechanic;
            j.estimatedCompletion = this.estimatedCompletion;
            j.diagnosticNotes = this.diagnosticNotes;
            j.laborCharges = this.laborCharges;
            j.partsTotal = this.partsTotal;
            j.grandTotal = this.grandTotal;
            return j;
        }
    }
}

package com.skbikepoint.dto.appointment;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AppointmentDto {
    private Long id;
    private Long customerId;
    private String customerName;
    private String phone;
    private String bikeModel;
    private String serviceType;
    private LocalDate appointmentDate;
    private String timeSlot;
    private String notes;
    private String status;
    private LocalDateTime createdAt;

    public AppointmentDto() {}

    public AppointmentDto(Long id, Long customerId, String customerName, String phone, String bikeModel, String serviceType, LocalDate appointmentDate, String timeSlot, String notes, String status, LocalDateTime createdAt) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.phone = phone;
        this.bikeModel = bikeModel;
        this.serviceType = serviceType;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.notes = notes;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBikeModel() { return bikeModel; }
    public void setBikeModel(String bikeModel) { this.bikeModel = bikeModel; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long customerId;
        private String customerName;
        private String phone;
        private String bikeModel;
        private String serviceType;
        private LocalDate appointmentDate;
        private String timeSlot;
        private String notes;
        private String status;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder customerId(Long customerId) { this.customerId = customerId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder bikeModel(String bikeModel) { this.bikeModel = bikeModel; return this; }
        public Builder serviceType(String serviceType) { this.serviceType = serviceType; return this; }
        public Builder appointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public Builder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AppointmentDto build() {
            return new AppointmentDto(id, customerId, customerName, phone, bikeModel, serviceType, appointmentDate, timeSlot, notes, status, createdAt);
        }
    }
}

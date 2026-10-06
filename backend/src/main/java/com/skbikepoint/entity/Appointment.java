package com.skbikepoint.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User customer;

    @Column(nullable = false, length = 100)
    private String customerName;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 80)
    private String bikeModel;

    @Column(nullable = false, length = 100)
    private String serviceType;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false, length = 50)
    private String timeSlot;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false, length = 30)
    private String status = "CONFIRMED";

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Appointment() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

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
        private User customer;
        private String customerName;
        private String phone;
        private String bikeModel;
        private String serviceType;
        private LocalDate appointmentDate;
        private String timeSlot;
        private String notes;
        private String status = "CONFIRMED";

        public Builder id(Long id) { this.id = id; return this; }
        public Builder customer(User customer) { this.customer = customer; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder bikeModel(String bikeModel) { this.bikeModel = bikeModel; return this; }
        public Builder serviceType(String serviceType) { this.serviceType = serviceType; return this; }
        public Builder appointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public Builder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder status(String status) { this.status = status; return this; }

        public Appointment build() {
            Appointment a = new Appointment();
            a.id = this.id;
            a.customer = this.customer;
            a.customerName = this.customerName;
            a.phone = this.phone;
            a.bikeModel = this.bikeModel;
            a.serviceType = this.serviceType;
            a.appointmentDate = this.appointmentDate;
            a.timeSlot = this.timeSlot;
            a.notes = this.notes;
            a.status = this.status;
            return a;
        }
    }
}

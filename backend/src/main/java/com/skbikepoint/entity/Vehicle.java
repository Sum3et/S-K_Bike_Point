package com.skbikepoint.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles", indexes = {
    @Index(name = "idx_reg_number", columnList = "registration_number", unique = true)
})
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 25)
    private String registrationNumber;

    @Column(nullable = false, length = 60)
    private String make;

    @Column(nullable = false, length = 80)
    private String model;

    @Column(name = "manufacturing_year", nullable = false)
    private Integer year;

    @Column(length = 30)
    private String engineCc;

    @Column(nullable = false)
    private Integer odometerKm;

    private LocalDate lastServiceDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Vehicle() {}

    public Vehicle(Long id, String registrationNumber, String make, String model, Integer year, String engineCc, Integer odometerKm, LocalDate lastServiceDate, User user) {
        this.id = id;
        this.registrationNumber = registrationNumber;
        this.make = make;
        this.model = model;
        this.year = year;
        this.engineCc = engineCc;
        this.odometerKm = odometerKm;
        this.lastServiceDate = lastServiceDate;
        this.user = user;
    }

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

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getEngineCc() { return engineCc; }
    public void setEngineCc(String engineCc) { this.engineCc = engineCc; }

    public Integer getOdometerKm() { return odometerKm; }
    public void setOdometerKm(Integer odometerKm) { this.odometerKm = odometerKm; }

    public LocalDate getLastServiceDate() { return lastServiceDate; }
    public void setLastServiceDate(LocalDate lastServiceDate) { this.lastServiceDate = lastServiceDate; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String registrationNumber;
        private String make;
        private String model;
        private Integer year;
        private String engineCc;
        private Integer odometerKm;
        private LocalDate lastServiceDate;
        private User user;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder registrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; return this; }
        public Builder make(String make) { this.make = make; return this; }
        public Builder model(String model) { this.model = model; return this; }
        public Builder year(Integer year) { this.year = year; return this; }
        public Builder engineCc(String engineCc) { this.engineCc = engineCc; return this; }
        public Builder odometerKm(Integer odometerKm) { this.odometerKm = odometerKm; return this; }
        public Builder lastServiceDate(LocalDate lastServiceDate) { this.lastServiceDate = lastServiceDate; return this; }
        public Builder user(User user) { this.user = user; return this; }

        public Vehicle build() {
            Vehicle v = new Vehicle();
            v.id = this.id;
            v.registrationNumber = this.registrationNumber;
            v.make = this.make;
            v.model = this.model;
            v.year = this.year;
            v.engineCc = this.engineCc;
            v.odometerKm = this.odometerKm;
            v.lastServiceDate = this.lastServiceDate;
            v.user = this.user;
            return v;
        }
    }
}

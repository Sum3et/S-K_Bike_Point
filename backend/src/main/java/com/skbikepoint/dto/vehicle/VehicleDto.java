package com.skbikepoint.dto.vehicle;

import java.time.LocalDate;

public class VehicleDto {
    private Long id;
    private String registrationNumber;
    private String make;
    private String model;
    private Integer year;
    private String engineCc;
    private Integer odometerKm;
    private LocalDate lastServiceDate;
    private Long customerId;
    private String customerName;

    public VehicleDto() {}

    public VehicleDto(Long id, String registrationNumber, String make, String model, Integer year, String engineCc, Integer odometerKm, LocalDate lastServiceDate, Long customerId, String customerName) {
        this.id = id;
        this.registrationNumber = registrationNumber;
        this.make = make;
        this.model = model;
        this.year = year;
        this.engineCc = engineCc;
        this.odometerKm = odometerKm;
        this.lastServiceDate = lastServiceDate;
        this.customerId = customerId;
        this.customerName = customerName;
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

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

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
        private Long customerId;
        private String customerName;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder registrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; return this; }
        public Builder make(String make) { this.make = make; return this; }
        public Builder model(String model) { this.model = model; return this; }
        public Builder year(Integer year) { this.year = year; return this; }
        public Builder engineCc(String engineCc) { this.engineCc = engineCc; return this; }
        public Builder odometerKm(Integer odometerKm) { this.odometerKm = odometerKm; return this; }
        public Builder lastServiceDate(LocalDate lastServiceDate) { this.lastServiceDate = lastServiceDate; return this; }
        public Builder customerId(Long customerId) { this.customerId = customerId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }

        public VehicleDto build() {
            return new VehicleDto(id, registrationNumber, make, model, year, engineCc, odometerKm, lastServiceDate, customerId, customerName);
        }
    }
}

package com.skbikepoint.dto.invoice;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InvoiceDto {
    private Long id;
    private String invoiceNumber;
    private Long jobCardId;
    private String jobNumber;
    private String vehicleRegistration;
    private String vehicleModel;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private BigDecimal laborAmount;
    private BigDecimal partsAmount;
    private BigDecimal subtotal;
    private BigDecimal gstRate;
    private BigDecimal gstAmount;
    private BigDecimal grandTotal;
    private String paymentStatus;
    private String paymentMode;
    private LocalDate invoiceDate;

    public InvoiceDto() {}

    public InvoiceDto(Long id, String invoiceNumber, Long jobCardId, String jobNumber, String vehicleRegistration, String vehicleModel, Long customerId, String customerName, String customerPhone, BigDecimal laborAmount, BigDecimal partsAmount, BigDecimal subtotal, BigDecimal gstRate, BigDecimal gstAmount, BigDecimal grandTotal, String paymentStatus, String paymentMode, LocalDate invoiceDate) {
        this.id = id;
        this.invoiceNumber = invoiceNumber;
        this.jobCardId = jobCardId;
        this.jobNumber = jobNumber;
        this.vehicleRegistration = vehicleRegistration;
        this.vehicleModel = vehicleModel;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.laborAmount = laborAmount;
        this.partsAmount = partsAmount;
        this.subtotal = subtotal;
        this.gstRate = gstRate;
        this.gstAmount = gstAmount;
        this.grandTotal = grandTotal;
        this.paymentStatus = paymentStatus;
        this.paymentMode = paymentMode;
        this.invoiceDate = invoiceDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public Long getJobCardId() { return jobCardId; }
    public void setJobCardId(Long jobCardId) { this.jobCardId = jobCardId; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

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

    public BigDecimal getLaborAmount() { return laborAmount; }
    public void setLaborAmount(BigDecimal laborAmount) { this.laborAmount = laborAmount; }

    public BigDecimal getPartsAmount() { return partsAmount; }
    public void setPartsAmount(BigDecimal partsAmount) { this.partsAmount = partsAmount; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getGstRate() { return gstRate; }
    public void setGstRate(BigDecimal gstRate) { this.gstRate = gstRate; }

    public BigDecimal getGstAmount() { return gstAmount; }
    public void setGstAmount(BigDecimal gstAmount) { this.gstAmount = gstAmount; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String invoiceNumber;
        private Long jobCardId;
        private String jobNumber;
        private String vehicleRegistration;
        private String vehicleModel;
        private Long customerId;
        private String customerName;
        private String customerPhone;
        private BigDecimal laborAmount;
        private BigDecimal partsAmount;
        private BigDecimal subtotal;
        private BigDecimal gstRate;
        private BigDecimal gstAmount;
        private BigDecimal grandTotal;
        private String paymentStatus;
        private String paymentMode;
        private LocalDate invoiceDate;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder invoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; return this; }
        public Builder jobCardId(Long jobCardId) { this.jobCardId = jobCardId; return this; }
        public Builder jobNumber(String jobNumber) { this.jobNumber = jobNumber; return this; }
        public Builder vehicleRegistration(String vehicleRegistration) { this.vehicleRegistration = vehicleRegistration; return this; }
        public Builder vehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; return this; }
        public Builder customerId(Long customerId) { this.customerId = customerId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder customerPhone(String customerPhone) { this.customerPhone = customerPhone; return this; }
        public Builder laborAmount(BigDecimal laborAmount) { this.laborAmount = laborAmount; return this; }
        public Builder partsAmount(BigDecimal partsAmount) { this.partsAmount = partsAmount; return this; }
        public Builder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }
        public Builder gstRate(BigDecimal gstRate) { this.gstRate = gstRate; return this; }
        public Builder gstAmount(BigDecimal gstAmount) { this.gstAmount = gstAmount; return this; }
        public Builder grandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; return this; }
        public Builder paymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public Builder paymentMode(String paymentMode) { this.paymentMode = paymentMode; return this; }
        public Builder invoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; return this; }

        public InvoiceDto build() {
            return new InvoiceDto(id, invoiceNumber, jobCardId, jobNumber, vehicleRegistration, vehicleModel, customerId, customerName, customerPhone, laborAmount, partsAmount, subtotal, gstRate, gstAmount, grandTotal, paymentStatus, paymentMode, invoiceDate);
        }
    }
}

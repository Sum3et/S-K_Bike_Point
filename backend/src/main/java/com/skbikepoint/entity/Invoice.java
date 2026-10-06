package com.skbikepoint.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices", indexes = {
    @Index(name = "idx_invoice_number", columnList = "invoice_number", unique = true)
})
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String invoiceNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_card_id", nullable = false)
    private JobCard jobCard;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal laborAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal partsAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal gstRate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal gstAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal grandTotal;

    @Column(nullable = false, length = 20)
    private String paymentStatus;

    @Column(length = 30)
    private String paymentMode;

    @Column(nullable = false)
    private LocalDate invoiceDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Invoice() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.invoiceDate == null) {
            this.invoiceDate = LocalDate.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public JobCard getJobCard() { return jobCard; }
    public void setJobCard(JobCard jobCard) { this.jobCard = jobCard; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String invoiceNumber;
        private JobCard jobCard;
        private User customer;
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
        public Builder jobCard(JobCard jobCard) { this.jobCard = jobCard; return this; }
        public Builder customer(User customer) { this.customer = customer; return this; }
        public Builder laborAmount(BigDecimal laborAmount) { this.laborAmount = laborAmount; return this; }
        public Builder partsAmount(BigDecimal partsAmount) { this.partsAmount = partsAmount; return this; }
        public Builder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }
        public Builder gstRate(BigDecimal gstRate) { this.gstRate = gstRate; return this; }
        public Builder gstAmount(BigDecimal gstAmount) { this.gstAmount = gstAmount; return this; }
        public Builder grandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; return this; }
        public Builder paymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public Builder paymentMode(String paymentMode) { this.paymentMode = paymentMode; return this; }
        public Builder invoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; return this; }

        public Invoice build() {
            Invoice inv = new Invoice();
            inv.id = this.id;
            inv.invoiceNumber = this.invoiceNumber;
            inv.jobCard = this.jobCard;
            inv.customer = this.customer;
            inv.laborAmount = this.laborAmount;
            inv.partsAmount = this.partsAmount;
            inv.subtotal = this.subtotal;
            inv.gstRate = this.gstRate;
            inv.gstAmount = this.gstAmount;
            inv.grandTotal = this.grandTotal;
            inv.paymentStatus = this.paymentStatus;
            inv.paymentMode = this.paymentMode;
            inv.invoiceDate = this.invoiceDate;
            return inv;
        }
    }
}

package com.skbikepoint.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "job_card_parts")
public class JobCardPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_card_id", nullable = false)
    private JobCard jobCard;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id")
    private InventoryItem inventoryItem;

    @Column(nullable = false, length = 150)
    private String partName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    public JobCardPart() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JobCard getJobCard() { return jobCard; }
    public void setJobCard(JobCard jobCard) { this.jobCard = jobCard; }

    public InventoryItem getInventoryItem() { return inventoryItem; }
    public void setInventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }

    public String getPartName() { return partName; }
    public void setPartName(String partName) { this.partName = partName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private JobCard jobCard;
        private InventoryItem inventoryItem;
        private String partName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder jobCard(JobCard jobCard) { this.jobCard = jobCard; return this; }
        public Builder inventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; return this; }
        public Builder partName(String partName) { this.partName = partName; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
        public Builder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }

        public JobCardPart build() {
            JobCardPart p = new JobCardPart();
            p.id = this.id;
            p.jobCard = this.jobCard;
            p.inventoryItem = this.inventoryItem;
            p.partName = this.partName;
            p.quantity = this.quantity;
            p.unitPrice = this.unitPrice;
            p.totalPrice = this.totalPrice;
            return p;
        }
    }
}

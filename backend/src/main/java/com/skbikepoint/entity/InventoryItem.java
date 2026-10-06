package com.skbikepoint.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items", indexes = {
    @Index(name = "idx_part_number", columnList = "part_number", unique = true)
})
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String partNumber;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(nullable = false)
    private Integer stockQuantity;

    @Column(nullable = false)
    private Integer minThreshold;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(length = 30)
    private String locationBin;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public InventoryItem() {}

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

    public String getPartNumber() { return partNumber; }
    public void setPartNumber(String partNumber) { this.partNumber = partNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Integer getMinThreshold() { return minThreshold; }
    public void setMinThreshold(Integer minThreshold) { this.minThreshold = minThreshold; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public String getLocationBin() { return locationBin; }
    public void setLocationBin(String locationBin) { this.locationBin = locationBin; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String partNumber;
        private String name;
        private String category;
        private Integer stockQuantity;
        private Integer minThreshold;
        private BigDecimal unitPrice;
        private String locationBin;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder partNumber(String partNumber) { this.partNumber = partNumber; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder stockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; return this; }
        public Builder minThreshold(Integer minThreshold) { this.minThreshold = minThreshold; return this; }
        public Builder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
        public Builder locationBin(String locationBin) { this.locationBin = locationBin; return this; }

        public InventoryItem build() {
            InventoryItem item = new InventoryItem();
            item.id = this.id;
            item.partNumber = this.partNumber;
            item.name = this.name;
            item.category = this.category;
            item.stockQuantity = this.stockQuantity;
            item.minThreshold = this.minThreshold;
            item.unitPrice = this.unitPrice;
            item.locationBin = this.locationBin;
            return item;
        }
    }
}

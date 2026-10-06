package com.skbikepoint.dto.inventory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class InventoryItemDto {
    private Long id;

    @NotBlank(message = "Part number is required")
    private String partNumber;

    @NotBlank(message = "Part name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Stock quantity is required")
    private Integer stockQuantity;

    @NotNull(message = "Min threshold is required")
    private Integer minThreshold;

    @NotNull(message = "Unit price is required")
    private BigDecimal unitPrice;

    private String locationBin;
    private boolean isLowStock;

    public InventoryItemDto() {}

    public InventoryItemDto(Long id, String partNumber, String name, String category, Integer stockQuantity, Integer minThreshold, BigDecimal unitPrice, String locationBin, boolean isLowStock) {
        this.id = id;
        this.partNumber = partNumber;
        this.name = name;
        this.category = category;
        this.stockQuantity = stockQuantity;
        this.minThreshold = minThreshold;
        this.unitPrice = unitPrice;
        this.locationBin = locationBin;
        this.isLowStock = isLowStock;
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

    public boolean isLowStock() { return isLowStock; }
    public void setLowStock(boolean lowStock) { isLowStock = lowStock; }

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
        private boolean isLowStock;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder partNumber(String partNumber) { this.partNumber = partNumber; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder stockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; return this; }
        public Builder minThreshold(Integer minThreshold) { this.minThreshold = minThreshold; return this; }
        public Builder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
        public Builder locationBin(String locationBin) { this.locationBin = locationBin; return this; }
        public Builder isLowStock(boolean isLowStock) { this.isLowStock = isLowStock; return this; }

        public InventoryItemDto build() {
            return new InventoryItemDto(id, partNumber, name, category, stockQuantity, minThreshold, unitPrice, locationBin, isLowStock);
        }
    }
}

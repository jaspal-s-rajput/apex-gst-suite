package com.apex.gstsuite.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnore
    private Company company;

    @NotBlank(message = "Item name is required")
    @Column(nullable = false)
    private String name;

    @Column(length = 100)
    private String sku;

    @Column(length = 100)
    private String barcode;

    private String category;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private ItemType itemType = ItemType.GOODS;

    @NotBlank(message = "HSN/SAC code is required")
    @Column(nullable = false, length = 10)
    private String hsnSacCode;

    @Column(length = 20)
    private String uom = "PCS";

    private BigDecimal purchasePrice = BigDecimal.ZERO;

    @NotNull(message = "Selling price is required")
    @Column(nullable = false)
    private BigDecimal sellingPrice = BigDecimal.ZERO;

    @NotNull(message = "GST rate is required")
    @Column(nullable = false)
    private BigDecimal gstRate = BigDecimal.valueOf(18.0);

    private BigDecimal cessRate = BigDecimal.ZERO;
    private BigDecimal currentStock = BigDecimal.ZERO;
    private BigDecimal minStockAlert = BigDecimal.valueOf(5.0);
    private Boolean batchTrackingEnabled = false;
    private String batchNumber;
    private LocalDate expiryDate;
    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Item() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Item item = new Item();

        public Builder id(UUID id) { item.id = id; return this; }
        public Builder company(Company company) { item.company = company; return this; }
        public Builder name(String name) { item.name = name; return this; }
        public Builder sku(String sku) { item.sku = sku; return this; }
        public Builder barcode(String barcode) { item.barcode = barcode; return this; }
        public Builder category(String category) { item.category = category; return this; }
        public Builder itemType(ItemType type) { item.itemType = type; return this; }
        public Builder hsnSacCode(String hsn) { item.hsnSacCode = hsn; return this; }
        public Builder uom(String uom) { item.uom = uom; return this; }
        public Builder purchasePrice(BigDecimal price) { item.purchasePrice = price; return this; }
        public Builder sellingPrice(BigDecimal price) { item.sellingPrice = price; return this; }
        public Builder gstRate(BigDecimal rate) { item.gstRate = rate; return this; }
        public Builder cessRate(BigDecimal rate) { item.cessRate = rate; return this; }
        public Builder currentStock(BigDecimal stock) { item.currentStock = stock; return this; }
        public Builder minStockAlert(BigDecimal min) { item.minStockAlert = min; return this; }
        public Builder batchTrackingEnabled(Boolean enabled) { item.batchTrackingEnabled = enabled; return this; }
        public Builder batchNumber(String batch) { item.batchNumber = batch; return this; }
        public Builder expiryDate(LocalDate expiry) { item.expiryDate = expiry; return this; }
        public Builder isActive(Boolean active) { item.isActive = active; return this; }
        public Item build() { return item; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public ItemType getItemType() { return itemType; }
    public void setItemType(ItemType itemType) { this.itemType = itemType; }

    public String getHsnSacCode() { return hsnSacCode; }
    public void setHsnSacCode(String hsnSacCode) { this.hsnSacCode = hsnSacCode; }

    public String getUom() { return uom; }
    public void setUom(String uom) { this.uom = uom; }

    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }

    public BigDecimal getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; }

    public BigDecimal getGstRate() { return gstRate; }
    public void setGstRate(BigDecimal gstRate) { this.gstRate = gstRate; }

    public BigDecimal getCessRate() { return cessRate; }
    public void setCessRate(BigDecimal cessRate) { this.cessRate = cessRate; }

    public BigDecimal getCurrentStock() { return currentStock; }
    public void setCurrentStock(BigDecimal currentStock) { this.currentStock = currentStock; }

    public BigDecimal getMinStockAlert() { return minStockAlert; }
    public void setMinStockAlert(BigDecimal minStockAlert) { this.minStockAlert = minStockAlert; }

    public Boolean getBatchTrackingEnabled() { return batchTrackingEnabled; }
    public void setBatchTrackingEnabled(Boolean batchTrackingEnabled) { this.batchTrackingEnabled = batchTrackingEnabled; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

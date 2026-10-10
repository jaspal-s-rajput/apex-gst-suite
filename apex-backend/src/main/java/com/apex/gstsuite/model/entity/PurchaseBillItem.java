package com.apex.gstsuite.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "purchase_bill_items")
public class PurchaseBillItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_bill_id", nullable = false)
    @JsonIgnore
    private PurchaseBill purchaseBill;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id")
    private Item item;

    @NotBlank(message = "Item name is required")
    @Column(nullable = false)
    private String itemName;

    @NotBlank(message = "HSN/SAC code is required")
    @Column(nullable = false, length = 10)
    private String hsnSacCode;

    @NotNull(message = "Quantity is required")
    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(length = 20)
    private String uom = "PCS";

    @NotNull(message = "Unit price is required")
    @Column(nullable = false)
    private BigDecimal unitPrice;

    @NotNull(message = "Taxable value is required")
    @Column(nullable = false)
    private BigDecimal taxableValue;

    @NotNull(message = "GST rate is required")
    @Column(nullable = false)
    private BigDecimal gstRate;

    private BigDecimal cgstAmount = BigDecimal.ZERO;
    private BigDecimal sgstAmount = BigDecimal.ZERO;
    private BigDecimal igstAmount = BigDecimal.ZERO;

    @NotNull(message = "Total amount is required")
    @Column(nullable = false)
    private BigDecimal totalAmount;

    public PurchaseBillItem() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final PurchaseBillItem pbi = new PurchaseBillItem();

        public Builder id(UUID id) { pbi.id = id; return this; }
        public Builder purchaseBill(PurchaseBill pb) { pbi.purchaseBill = pb; return this; }
        public Builder item(Item i) { pbi.item = i; return this; }
        public Builder itemName(String name) { pbi.itemName = name; return this; }
        public Builder hsnSacCode(String hsn) { pbi.hsnSacCode = hsn; return this; }
        public Builder quantity(BigDecimal qty) { pbi.quantity = qty; return this; }
        public Builder uom(String uom) { pbi.uom = uom; return this; }
        public Builder unitPrice(BigDecimal price) { pbi.unitPrice = price; return this; }
        public Builder taxableValue(BigDecimal val) { pbi.taxableValue = val; return this; }
        public Builder gstRate(BigDecimal rate) { pbi.gstRate = rate; return this; }
        public Builder cgstAmount(BigDecimal amt) { pbi.cgstAmount = amt; return this; }
        public Builder sgstAmount(BigDecimal amt) { pbi.sgstAmount = amt; return this; }
        public Builder igstAmount(BigDecimal amt) { pbi.igstAmount = amt; return this; }
        public Builder totalAmount(BigDecimal total) { pbi.totalAmount = total; return this; }
        public PurchaseBillItem build() { return pbi; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public PurchaseBill getPurchaseBill() { return purchaseBill; }
    public void setPurchaseBill(PurchaseBill purchaseBill) { this.purchaseBill = purchaseBill; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getHsnSacCode() { return hsnSacCode; }
    public void setHsnSacCode(String hsnSacCode) { this.hsnSacCode = hsnSacCode; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getUom() { return uom; }
    public void setUom(String uom) { this.uom = uom; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTaxableValue() { return taxableValue; }
    public void setTaxableValue(BigDecimal taxableValue) { this.taxableValue = taxableValue; }

    public BigDecimal getGstRate() { return gstRate; }
    public void setGstRate(BigDecimal gstRate) { this.gstRate = gstRate; }

    public BigDecimal getCgstAmount() { return cgstAmount; }
    public void setCgstAmount(BigDecimal cgstAmount) { this.cgstAmount = cgstAmount; }

    public BigDecimal getSgstAmount() { return sgstAmount; }
    public void setSgstAmount(BigDecimal sgstAmount) { this.sgstAmount = sgstAmount; }

    public BigDecimal getIgstAmount() { return igstAmount; }
    public void setIgstAmount(BigDecimal igstAmount) { this.igstAmount = igstAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}

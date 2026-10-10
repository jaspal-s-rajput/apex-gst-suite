package com.apex.gstsuite.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "invoice_items")
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    @JsonIgnore
    private Invoice invoice;

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

    private BigDecimal discountPercent = BigDecimal.ZERO;
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @NotNull(message = "Taxable value is required")
    @Column(nullable = false)
    private BigDecimal taxableValue;

    @NotNull(message = "GST rate is required")
    @Column(nullable = false)
    private BigDecimal gstRate;

    private BigDecimal cgstRate = BigDecimal.ZERO;
    private BigDecimal cgstAmount = BigDecimal.ZERO;
    private BigDecimal sgstRate = BigDecimal.ZERO;
    private BigDecimal sgstAmount = BigDecimal.ZERO;
    private BigDecimal igstRate = BigDecimal.ZERO;
    private BigDecimal igstAmount = BigDecimal.ZERO;
    private BigDecimal cessRate = BigDecimal.ZERO;
    private BigDecimal cessAmount = BigDecimal.ZERO;

    @NotNull(message = "Total amount is required")
    @Column(nullable = false)
    private BigDecimal totalAmount;

    public InvoiceItem() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final InvoiceItem ii = new InvoiceItem();

        public Builder id(UUID id) { ii.id = id; return this; }
        public Builder invoice(Invoice inv) { ii.invoice = inv; return this; }
        public Builder item(Item item) { ii.item = item; return this; }
        public Builder itemName(String name) { ii.itemName = name; return this; }
        public Builder hsnSacCode(String hsn) { ii.hsnSacCode = hsn; return this; }
        public Builder quantity(BigDecimal qty) { ii.quantity = qty; return this; }
        public Builder uom(String uom) { ii.uom = uom; return this; }
        public Builder unitPrice(BigDecimal price) { ii.unitPrice = price; return this; }
        public Builder discountPercent(BigDecimal discPct) { ii.discountPercent = discPct; return this; }
        public Builder discountAmount(BigDecimal discAmt) { ii.discountAmount = discAmt; return this; }
        public Builder taxableValue(BigDecimal taxVal) { ii.taxableValue = taxVal; return this; }
        public Builder gstRate(BigDecimal rate) { ii.gstRate = rate; return this; }
        public Builder cgstRate(BigDecimal rate) { ii.cgstRate = rate; return this; }
        public Builder cgstAmount(BigDecimal amt) { ii.cgstAmount = amt; return this; }
        public Builder sgstRate(BigDecimal rate) { ii.sgstRate = rate; return this; }
        public Builder sgstAmount(BigDecimal amt) { ii.sgstAmount = amt; return this; }
        public Builder igstRate(BigDecimal rate) { ii.igstRate = rate; return this; }
        public Builder igstAmount(BigDecimal amt) { ii.igstAmount = amt; return this; }
        public Builder cessRate(BigDecimal rate) { ii.cessRate = rate; return this; }
        public Builder cessAmount(BigDecimal amt) { ii.cessAmount = amt; return this; }
        public Builder totalAmount(BigDecimal total) { ii.totalAmount = total; return this; }
        public InvoiceItem build() { return ii; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }

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

    public BigDecimal getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(BigDecimal discountPercent) { this.discountPercent = discountPercent; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTaxableValue() { return taxableValue; }
    public void setTaxableValue(BigDecimal taxableValue) { this.taxableValue = taxableValue; }

    public BigDecimal getGstRate() { return gstRate; }
    public void setGstRate(BigDecimal gstRate) { this.gstRate = gstRate; }

    public BigDecimal getCgstRate() { return cgstRate; }
    public void setCgstRate(BigDecimal cgstRate) { this.cgstRate = cgstRate; }

    public BigDecimal getCgstAmount() { return cgstAmount; }
    public void setCgstAmount(BigDecimal cgstAmount) { this.cgstAmount = cgstAmount; }

    public BigDecimal getSgstRate() { return sgstRate; }
    public void setSgstRate(BigDecimal sgstRate) { this.sgstRate = sgstRate; }

    public BigDecimal getSgstAmount() { return sgstAmount; }
    public void setSgstAmount(BigDecimal sgstAmount) { this.sgstAmount = sgstAmount; }

    public BigDecimal getIgstRate() { return igstRate; }
    public void setIgstRate(BigDecimal igstRate) { this.igstRate = igstRate; }

    public BigDecimal getIgstAmount() { return igstAmount; }
    public void setIgstAmount(BigDecimal igstAmount) { this.igstAmount = igstAmount; }

    public BigDecimal getCessRate() { return cessRate; }
    public void setCessRate(BigDecimal cessRate) { this.cessRate = cessRate; }

    public BigDecimal getCessAmount() { return cessAmount; }
    public void setCessAmount(BigDecimal cessAmount) { this.cessAmount = cessAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}

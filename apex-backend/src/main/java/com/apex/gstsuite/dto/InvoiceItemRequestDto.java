package com.apex.gstsuite.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public class InvoiceItemRequestDto {
    private UUID itemId;

    @NotBlank(message = "Item name is required")
    private String itemName;

    @NotBlank(message = "HSN/SAC code is required")
    private String hsnSacCode;

    @NotNull(message = "Quantity is required")
    private BigDecimal quantity;

    private String uom = "PCS";

    @NotNull(message = "Unit price is required")
    private BigDecimal unitPrice;

    private BigDecimal discountPercent = BigDecimal.ZERO;
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @NotNull(message = "GST rate is required")
    private BigDecimal gstRate;

    private BigDecimal cessRate = BigDecimal.ZERO;

    public InvoiceItemRequestDto() {}

    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }

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

    public BigDecimal getGstRate() { return gstRate; }
    public void setGstRate(BigDecimal gstRate) { this.gstRate = gstRate; }

    public BigDecimal getCessRate() { return cessRate; }
    public void setCessRate(BigDecimal cessRate) { this.cessRate = cessRate; }
}

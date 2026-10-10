package com.apex.gstsuite.dto;

import com.apex.gstsuite.model.entity.InvoiceType;
import com.apex.gstsuite.model.entity.PaymentStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class InvoiceRequestDto {
    private UUID companyId;
    private UUID partyId;
    private String invoiceNumber;
    private InvoiceType invoiceType = InvoiceType.TAX_INVOICE;

    @NotNull(message = "Invoice date is required")
    private LocalDate invoiceDate;
    private LocalDate dueDate;

    @NotNull(message = "Place of supply is required")
    private String placeOfSupply;

    private Boolean isReverseCharge = false;
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;
    private BigDecimal amountPaid = BigDecimal.ZERO;
    private String paymentMode;
    private String notes;
    private String termsAndConditions;

    @NotEmpty(message = "At least one line item is required")
    private List<InvoiceItemRequestDto> items;

    public InvoiceRequestDto() {}

    public UUID getCompanyId() { return companyId; }
    public void setCompanyId(UUID companyId) { this.companyId = companyId; }

    public UUID getPartyId() { return partyId; }
    public void setPartyId(UUID partyId) { this.partyId = partyId; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public InvoiceType getInvoiceType() { return invoiceType; }
    public void setInvoiceType(InvoiceType invoiceType) { this.invoiceType = invoiceType; }

    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getPlaceOfSupply() { return placeOfSupply; }
    public void setPlaceOfSupply(String placeOfSupply) { this.placeOfSupply = placeOfSupply; }

    public Boolean getIsReverseCharge() { return isReverseCharge; }
    public void setIsReverseCharge(Boolean reverseCharge) { isReverseCharge = reverseCharge; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getTermsAndConditions() { return termsAndConditions; }
    public void setTermsAndConditions(String termsAndConditions) { this.termsAndConditions = termsAndConditions; }

    public List<InvoiceItemRequestDto> getItems() { return items; }
    public void setItems(List<InvoiceItemRequestDto> items) { this.items = items; }
}

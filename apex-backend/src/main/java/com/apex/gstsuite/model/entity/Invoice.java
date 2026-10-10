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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnore
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "party_id")
    private Party party;

    @NotBlank(message = "Invoice number is required")
    @Column(nullable = false, length = 50)
    private String invoiceNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InvoiceType invoiceType = InvoiceType.TAX_INVOICE;

    @NotNull(message = "Invoice date is required")
    @Column(nullable = false)
    private LocalDate invoiceDate;

    private LocalDate dueDate;

    @NotBlank(message = "Place of supply is required")
    @Column(nullable = false, length = 2)
    private String placeOfSupply;

    private Boolean isInterState = false;
    private Boolean isReverseCharge = false;
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private BigDecimal taxableAmount = BigDecimal.ZERO;
    private BigDecimal cgstAmount = BigDecimal.ZERO;
    private BigDecimal sgstAmount = BigDecimal.ZERO;
    private BigDecimal igstAmount = BigDecimal.ZERO;
    private BigDecimal cessAmount = BigDecimal.ZERO;
    private BigDecimal roundOff = BigDecimal.ZERO;

    @NotNull(message = "Grand total is required")
    @Column(nullable = false)
    private BigDecimal grandTotal = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

    private BigDecimal amountPaid = BigDecimal.ZERO;
    private BigDecimal balanceAmount = BigDecimal.ZERO;
    private String paymentMode;

    @Column(columnDefinition = "TEXT")
    private String upiQrPayload;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String termsAndConditions;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<InvoiceItem> items = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Invoice() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Invoice inv = new Invoice();

        public Builder id(UUID id) { inv.id = id; return this; }
        public Builder company(Company c) { inv.company = c; return this; }
        public Builder party(Party p) { inv.party = p; return this; }
        public Builder invoiceNumber(String num) { inv.invoiceNumber = num; return this; }
        public Builder invoiceType(InvoiceType t) { inv.invoiceType = t; return this; }
        public Builder invoiceDate(LocalDate d) { inv.invoiceDate = d; return this; }
        public Builder dueDate(LocalDate d) { inv.dueDate = d; return this; }
        public Builder placeOfSupply(String pos) { inv.placeOfSupply = pos; return this; }
        public Builder isInterState(Boolean isInter) { inv.isInterState = isInter; return this; }
        public Builder isReverseCharge(Boolean rcm) { inv.isReverseCharge = rcm; return this; }
        public Builder subtotal(BigDecimal sub) { inv.subtotal = sub; return this; }
        public Builder discountAmount(BigDecimal disc) { inv.discountAmount = disc; return this; }
        public Builder taxableAmount(BigDecimal tax) { inv.taxableAmount = tax; return this; }
        public Builder cgstAmount(BigDecimal cgst) { inv.cgstAmount = cgst; return this; }
        public Builder sgstAmount(BigDecimal sgst) { inv.sgstAmount = sgst; return this; }
        public Builder igstAmount(BigDecimal igst) { inv.igstAmount = igst; return this; }
        public Builder cessAmount(BigDecimal cess) { inv.cessAmount = cess; return this; }
        public Builder roundOff(BigDecimal ro) { inv.roundOff = ro; return this; }
        public Builder grandTotal(BigDecimal total) { inv.grandTotal = total; return this; }
        public Builder paymentStatus(PaymentStatus s) { inv.paymentStatus = s; return this; }
        public Builder amountPaid(BigDecimal paid) { inv.amountPaid = paid; return this; }
        public Builder balanceAmount(BigDecimal bal) { inv.balanceAmount = bal; return this; }
        public Builder paymentMode(String mode) { inv.paymentMode = mode; return this; }
        public Builder upiQrPayload(String upi) { inv.upiQrPayload = upi; return this; }
        public Builder notes(String notes) { inv.notes = notes; return this; }
        public Builder termsAndConditions(String tc) { inv.termsAndConditions = tc; return this; }
        public Builder items(List<InvoiceItem> items) { inv.items = items; return this; }
        public Invoice build() { return inv; }
    }

    public void addItem(InvoiceItem item) {
        items.add(item);
        item.setInvoice(this);
    }

    public void removeItem(InvoiceItem item) {
        items.remove(item);
        item.setInvoice(null);
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public Party getParty() { return party; }
    public void setParty(Party party) { this.party = party; }

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

    public Boolean getIsInterState() { return isInterState; }
    public void setIsInterState(Boolean interState) { isInterState = interState; }

    public Boolean getIsReverseCharge() { return isReverseCharge; }
    public void setIsReverseCharge(Boolean reverseCharge) { isReverseCharge = reverseCharge; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTaxableAmount() { return taxableAmount; }
    public void setTaxableAmount(BigDecimal taxableAmount) { this.taxableAmount = taxableAmount; }

    public BigDecimal getCgstAmount() { return cgstAmount; }
    public void setCgstAmount(BigDecimal cgstAmount) { this.cgstAmount = cgstAmount; }

    public BigDecimal getSgstAmount() { return sgstAmount; }
    public void setSgstAmount(BigDecimal sgstAmount) { this.sgstAmount = sgstAmount; }

    public BigDecimal getIgstAmount() { return igstAmount; }
    public void setIgstAmount(BigDecimal igstAmount) { this.igstAmount = igstAmount; }

    public BigDecimal getCessAmount() { return cessAmount; }
    public void setCessAmount(BigDecimal cessAmount) { this.cessAmount = cessAmount; }

    public BigDecimal getRoundOff() { return roundOff; }
    public void setRoundOff(BigDecimal roundOff) { this.roundOff = roundOff; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }

    public BigDecimal getBalanceAmount() { return balanceAmount; }
    public void setBalanceAmount(BigDecimal balanceAmount) { this.balanceAmount = balanceAmount; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getUpiQrPayload() { return upiQrPayload; }
    public void setUpiQrPayload(String upiQrPayload) { this.upiQrPayload = upiQrPayload; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getTermsAndConditions() { return termsAndConditions; }
    public void setTermsAndConditions(String termsAndConditions) { this.termsAndConditions = termsAndConditions; }

    public List<InvoiceItem> getItems() { return items; }
    public void setItems(List<InvoiceItem> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

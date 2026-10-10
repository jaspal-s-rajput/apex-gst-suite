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
@Table(name = "purchase_bills")
public class PurchaseBill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnore
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Party vendor;

    @NotBlank(message = "Vendor bill number is required")
    @Column(nullable = false, length = 100)
    private String vendorBillNumber;

    @NotNull(message = "Bill date is required")
    @Column(nullable = false)
    private LocalDate billDate;

    private LocalDate dueDate;

    @NotBlank(message = "Place of supply is required")
    @Column(nullable = false, length = 2)
    private String placeOfSupply;

    private Boolean isInterState = false;
    private Boolean isItcEligible = true;
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

    @OneToMany(mappedBy = "purchaseBill", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PurchaseBillItem> items = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public PurchaseBill() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final PurchaseBill pb = new PurchaseBill();

        public Builder id(UUID id) { pb.id = id; return this; }
        public Builder company(Company c) { pb.company = c; return this; }
        public Builder vendor(Party v) { pb.vendor = v; return this; }
        public Builder vendorBillNumber(String num) { pb.vendorBillNumber = num; return this; }
        public Builder billDate(LocalDate d) { pb.billDate = d; return this; }
        public Builder dueDate(LocalDate d) { pb.dueDate = d; return this; }
        public Builder placeOfSupply(String pos) { pb.placeOfSupply = pos; return this; }
        public Builder isInterState(Boolean inter) { pb.isInterState = inter; return this; }
        public Builder isItcEligible(Boolean itc) { pb.isItcEligible = itc; return this; }
        public Builder taxableAmount(BigDecimal amt) { pb.taxableAmount = amt; return this; }
        public Builder cgstAmount(BigDecimal amt) { pb.cgstAmount = amt; return this; }
        public Builder sgstAmount(BigDecimal amt) { pb.sgstAmount = amt; return this; }
        public Builder igstAmount(BigDecimal amt) { pb.igstAmount = amt; return this; }
        public Builder cessAmount(BigDecimal amt) { pb.cessAmount = amt; return this; }
        public Builder roundOff(BigDecimal ro) { pb.roundOff = ro; return this; }
        public Builder grandTotal(BigDecimal total) { pb.grandTotal = total; return this; }
        public Builder paymentStatus(PaymentStatus s) { pb.paymentStatus = s; return this; }
        public Builder amountPaid(BigDecimal paid) { pb.amountPaid = paid; return this; }
        public Builder balanceAmount(BigDecimal bal) { pb.balanceAmount = bal; return this; }
        public Builder items(List<PurchaseBillItem> items) { pb.items = items; return this; }
        public PurchaseBill build() { return pb; }
    }

    public void addItem(PurchaseBillItem item) {
        items.add(item);
        item.setPurchaseBill(this);
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public Party getVendor() { return vendor; }
    public void setVendor(Party vendor) { this.vendor = vendor; }

    public String getVendorBillNumber() { return vendorBillNumber; }
    public void setVendorBillNumber(String vendorBillNumber) { this.vendorBillNumber = vendorBillNumber; }

    public LocalDate getBillDate() { return billDate; }
    public void setBillDate(LocalDate billDate) { this.billDate = billDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getPlaceOfSupply() { return placeOfSupply; }
    public void setPlaceOfSupply(String placeOfSupply) { this.placeOfSupply = placeOfSupply; }

    public Boolean getIsInterState() { return isInterState; }
    public void setIsInterState(Boolean interState) { isInterState = interState; }

    public Boolean getIsItcEligible() { return isItcEligible; }
    public void setIsItcEligible(Boolean itcEligible) { isItcEligible = itcEligible; }

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

    public List<PurchaseBillItem> getItems() { return items; }
    public void setItems(List<PurchaseBillItem> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

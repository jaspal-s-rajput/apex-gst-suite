package com.apex.gstsuite.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Legal name is required")
    @Column(nullable = false)
    private String legalName;

    private String tradeName;

    @Pattern(regexp = "^$|^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", message = "Invalid GSTIN format")
    @Column(length = 15)
    private String gstin;

    @Column(length = 10)
    private String pan;

    @NotBlank(message = "State code is required")
    @Column(nullable = false, length = 2)
    private String stateCode;

    private String stateName;

    @NotBlank(message = "Address line 1 is required")
    @Column(nullable = false)
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Pincode is required")
    @Column(length = 6)
    private String pincode;

    private String email;
    private String phone;
    private String upiId;
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    private String branchName;

    @Column(columnDefinition = "TEXT")
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String signatureUrl;

    @Column(length = 20)
    private String invoicePrefix = "INV";

    private Long nextInvoiceSequence = 1L;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Company() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Company company = new Company();

        public Builder id(UUID id) { company.id = id; return this; }
        public Builder legalName(String legalName) { company.legalName = legalName; return this; }
        public Builder tradeName(String tradeName) { company.tradeName = tradeName; return this; }
        public Builder gstin(String gstin) { company.gstin = gstin; return this; }
        public Builder pan(String pan) { company.pan = pan; return this; }
        public Builder stateCode(String stateCode) { company.stateCode = stateCode; return this; }
        public Builder stateName(String stateName) { company.stateName = stateName; return this; }
        public Builder addressLine1(String addressLine1) { company.addressLine1 = addressLine1; return this; }
        public Builder addressLine2(String addressLine2) { company.addressLine2 = addressLine2; return this; }
        public Builder city(String city) { company.city = city; return this; }
        public Builder pincode(String pincode) { company.pincode = pincode; return this; }
        public Builder email(String email) { company.email = email; return this; }
        public Builder phone(String phone) { company.phone = phone; return this; }
        public Builder upiId(String upiId) { company.upiId = upiId; return this; }
        public Builder bankName(String bankName) { company.bankName = bankName; return this; }
        public Builder accountNumber(String accountNumber) { company.accountNumber = accountNumber; return this; }
        public Builder ifscCode(String ifscCode) { company.ifscCode = ifscCode; return this; }
        public Builder branchName(String branchName) { company.branchName = branchName; return this; }
        public Builder logoUrl(String logoUrl) { company.logoUrl = logoUrl; return this; }
        public Builder signatureUrl(String signatureUrl) { company.signatureUrl = signatureUrl; return this; }
        public Builder invoicePrefix(String invoicePrefix) { company.invoicePrefix = invoicePrefix; return this; }
        public Builder nextInvoiceSequence(Long seq) { company.nextInvoiceSequence = seq; return this; }
        public Company build() { return company; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getLegalName() { return legalName; }
    public void setLegalName(String legalName) { this.legalName = legalName; }

    public String getTradeName() { return tradeName; }
    public void setTradeName(String tradeName) { this.tradeName = tradeName; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getPan() { return pan; }
    public void setPan(String pan) { this.pan = pan; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getStateName() { return stateName; }
    public void setStateName(String stateName) { this.stateName = stateName; }

    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getSignatureUrl() { return signatureUrl; }
    public void setSignatureUrl(String signatureUrl) { this.signatureUrl = signatureUrl; }

    public String getInvoicePrefix() { return invoicePrefix; }
    public void setInvoicePrefix(String invoicePrefix) { this.invoicePrefix = invoicePrefix; }

    public Long getNextInvoiceSequence() { return nextInvoiceSequence; }
    public void setNextInvoiceSequence(Long nextInvoiceSequence) { this.nextInvoiceSequence = nextInvoiceSequence; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

package com.apex.gstsuite.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "parties")
public class Party {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnore
    private Company company;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PartyType partyType = PartyType.CUSTOMER;

    @NotBlank(message = "Party name is required")
    @Column(nullable = false)
    private String name;

    @Column(length = 15)
    private String gstin;

    @Column(length = 10)
    private String pan;

    @NotBlank(message = "State code is required")
    @Column(nullable = false, length = 2)
    private String stateCode;

    private String stateName;
    private String phone;
    private String email;

    @Column(columnDefinition = "TEXT")
    private String billingAddress;

    @Column(columnDefinition = "TEXT")
    private String shippingAddress;

    private String city;
    private String pincode;

    private Integer creditPeriodDays = 30;
    private BigDecimal creditLimit = BigDecimal.ZERO;
    private BigDecimal openingBalance = BigDecimal.ZERO;
    private BigDecimal currentBalance = BigDecimal.ZERO;
    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Party() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Party party = new Party();

        public Builder id(UUID id) { party.id = id; return this; }
        public Builder company(Company company) { party.company = company; return this; }
        public Builder partyType(PartyType partyType) { party.partyType = partyType; return this; }
        public Builder name(String name) { party.name = name; return this; }
        public Builder gstin(String gstin) { party.gstin = gstin; return this; }
        public Builder pan(String pan) { party.pan = pan; return this; }
        public Builder stateCode(String stateCode) { party.stateCode = stateCode; return this; }
        public Builder stateName(String stateName) { party.stateName = stateName; return this; }
        public Builder phone(String phone) { party.phone = phone; return this; }
        public Builder email(String email) { party.email = email; return this; }
        public Builder billingAddress(String billingAddress) { party.billingAddress = billingAddress; return this; }
        public Builder shippingAddress(String shippingAddress) { party.shippingAddress = shippingAddress; return this; }
        public Builder city(String city) { party.city = city; return this; }
        public Builder pincode(String pincode) { party.pincode = pincode; return this; }
        public Builder creditPeriodDays(Integer days) { party.creditPeriodDays = days; return this; }
        public Builder creditLimit(BigDecimal limit) { party.creditLimit = limit; return this; }
        public Builder openingBalance(BigDecimal bal) { party.openingBalance = bal; return this; }
        public Builder currentBalance(BigDecimal bal) { party.currentBalance = bal; return this; }
        public Builder isActive(Boolean active) { party.isActive = active; return this; }
        public Party build() { return party; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public PartyType getPartyType() { return partyType; }
    public void setPartyType(PartyType partyType) { this.partyType = partyType; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getPan() { return pan; }
    public void setPan(String pan) { this.pan = pan; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getStateName() { return stateName; }
    public void setStateName(String stateName) { this.stateName = stateName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBillingAddress() { return billingAddress; }
    public void setBillingAddress(String billingAddress) { this.billingAddress = billingAddress; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public Integer getCreditPeriodDays() { return creditPeriodDays; }
    public void setCreditPeriodDays(Integer creditPeriodDays) { this.creditPeriodDays = creditPeriodDays; }

    public BigDecimal getCreditLimit() { return creditLimit; }
    public void setCreditLimit(BigDecimal creditLimit) { this.creditLimit = creditLimit; }

    public BigDecimal getOpeningBalance() { return openingBalance; }
    public void setOpeningBalance(BigDecimal openingBalance) { this.openingBalance = openingBalance; }

    public BigDecimal getCurrentBalance() { return currentBalance; }
    public void setCurrentBalance(BigDecimal currentBalance) { this.currentBalance = currentBalance; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

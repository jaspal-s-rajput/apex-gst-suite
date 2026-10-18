package com.apex.gstsuite.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class PartyStatementDto {

    private UUID partyId;
    private String partyName;
    private String partyType;
    private String gstin;
    private String pan;
    private String phone;
    private String email;
    private String billingAddress;
    private String stateCode;
    private String stateName;

    private Integer creditPeriodDays = 30;
    private BigDecimal creditLimit = BigDecimal.ZERO;
    private BigDecimal openingBalance = BigDecimal.ZERO;
    private BigDecimal currentBalance = BigDecimal.ZERO;

    private LocalDate fromDate;
    private LocalDate toDate;

    private BigDecimal totalDebit = BigDecimal.ZERO;
    private BigDecimal totalCredit = BigDecimal.ZERO;
    private BigDecimal closingBalance = BigDecimal.ZERO;

    private boolean creditLimitExceeded = false;
    private BigDecimal excessCreditAmount = BigDecimal.ZERO;
    private BigDecimal overdueAmount = BigDecimal.ZERO;
    private int overdueInvoicesCount = 0;

    private List<LedgerEntryDto> entries = new ArrayList<>();

    public PartyStatementDto() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final PartyStatementDto dto = new PartyStatementDto();

        public Builder partyId(UUID id) { dto.partyId = id; return this; }
        public Builder partyName(String name) { dto.partyName = name; return this; }
        public Builder partyType(String type) { dto.partyType = type; return this; }
        public Builder gstin(String gstin) { dto.gstin = gstin; return this; }
        public Builder pan(String pan) { dto.pan = pan; return this; }
        public Builder phone(String phone) { dto.phone = phone; return this; }
        public Builder email(String email) { dto.email = email; return this; }
        public Builder billingAddress(String addr) { dto.billingAddress = addr; return this; }
        public Builder stateCode(String code) { dto.stateCode = code; return this; }
        public Builder stateName(String name) { dto.stateName = name; return this; }
        public Builder creditPeriodDays(Integer days) { dto.creditPeriodDays = days; return this; }
        public Builder creditLimit(BigDecimal limit) { dto.creditLimit = limit != null ? limit : BigDecimal.ZERO; return this; }
        public Builder openingBalance(BigDecimal bal) { dto.openingBalance = bal != null ? bal : BigDecimal.ZERO; return this; }
        public Builder currentBalance(BigDecimal bal) { dto.currentBalance = bal != null ? bal : BigDecimal.ZERO; return this; }
        public Builder fromDate(LocalDate from) { dto.fromDate = from; return this; }
        public Builder toDate(LocalDate to) { dto.toDate = to; return this; }
        public Builder totalDebit(BigDecimal debit) { dto.totalDebit = debit != null ? debit : BigDecimal.ZERO; return this; }
        public Builder totalCredit(BigDecimal credit) { dto.totalCredit = credit != null ? credit : BigDecimal.ZERO; return this; }
        public Builder closingBalance(BigDecimal bal) { dto.closingBalance = bal != null ? bal : BigDecimal.ZERO; return this; }
        public Builder creditLimitExceeded(boolean exceeded) { dto.creditLimitExceeded = exceeded; return this; }
        public Builder excessCreditAmount(BigDecimal excess) { dto.excessCreditAmount = excess != null ? excess : BigDecimal.ZERO; return this; }
        public Builder overdueAmount(BigDecimal overdue) { dto.overdueAmount = overdue != null ? overdue : BigDecimal.ZERO; return this; }
        public Builder overdueInvoicesCount(int count) { dto.overdueInvoicesCount = count; return this; }
        public Builder entries(List<LedgerEntryDto> entries) { dto.entries = entries != null ? entries : new ArrayList<>(); return this; }
        public PartyStatementDto build() { return dto; }
    }

    public UUID getPartyId() { return partyId; }
    public void setPartyId(UUID partyId) { this.partyId = partyId; }

    public String getPartyName() { return partyName; }
    public void setPartyName(String partyName) { this.partyName = partyName; }

    public String getPartyType() { return partyType; }
    public void setPartyType(String partyType) { this.partyType = partyType; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getPan() { return pan; }
    public void setPan(String pan) { this.pan = pan; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBillingAddress() { return billingAddress; }
    public void setBillingAddress(String billingAddress) { this.billingAddress = billingAddress; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getStateName() { return stateName; }
    public void setStateName(String stateName) { this.stateName = stateName; }

    public Integer getCreditPeriodDays() { return creditPeriodDays; }
    public void setCreditPeriodDays(Integer creditPeriodDays) { this.creditPeriodDays = creditPeriodDays; }

    public BigDecimal getCreditLimit() { return creditLimit; }
    public void setCreditLimit(BigDecimal creditLimit) { this.creditLimit = creditLimit; }

    public BigDecimal getOpeningBalance() { return openingBalance; }
    public void setOpeningBalance(BigDecimal openingBalance) { this.openingBalance = openingBalance; }

    public BigDecimal getCurrentBalance() { return currentBalance; }
    public void setCurrentBalance(BigDecimal currentBalance) { this.currentBalance = currentBalance; }

    public LocalDate getFromDate() { return fromDate; }
    public void setFromDate(LocalDate fromDate) { this.fromDate = fromDate; }

    public LocalDate getToDate() { return toDate; }
    public void setToDate(LocalDate toDate) { this.toDate = toDate; }

    public BigDecimal getTotalDebit() { return totalDebit; }
    public void setTotalDebit(BigDecimal totalDebit) { this.totalDebit = totalDebit; }

    public BigDecimal getTotalCredit() { return totalCredit; }
    public void setTotalCredit(BigDecimal totalCredit) { this.totalCredit = totalCredit; }

    public BigDecimal getClosingBalance() { return closingBalance; }
    public void setClosingBalance(BigDecimal closingBalance) { this.closingBalance = closingBalance; }

    public boolean isCreditLimitExceeded() { return creditLimitExceeded; }
    public void setCreditLimitExceeded(boolean creditLimitExceeded) { this.creditLimitExceeded = creditLimitExceeded; }

    public BigDecimal getExcessCreditAmount() { return excessCreditAmount; }
    public void setExcessCreditAmount(BigDecimal excessCreditAmount) { this.excessCreditAmount = excessCreditAmount; }

    public BigDecimal getOverdueAmount() { return overdueAmount; }
    public void setOverdueAmount(BigDecimal overdueAmount) { this.overdueAmount = overdueAmount; }

    public int getOverdueInvoicesCount() { return overdueInvoicesCount; }
    public void setOverdueInvoicesCount(int overdueInvoicesCount) { this.overdueInvoicesCount = overdueInvoicesCount; }

    public List<LedgerEntryDto> getEntries() { return entries; }
    public void setEntries(List<LedgerEntryDto> entries) { this.entries = entries; }
}

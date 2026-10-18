package com.apex.gstsuite.dto;

import com.apex.gstsuite.model.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LedgerEntryDto {

    private LocalDate date;
    private String referenceNumber;
    private String type; // INVOICE, PAYMENT, PURCHASE_BILL, OPENING_BALANCE
    private String description;
    private BigDecimal debit = BigDecimal.ZERO;
    private BigDecimal credit = BigDecimal.ZERO;
    private BigDecimal balance = BigDecimal.ZERO;
    private PaymentStatus status;
    private LocalDate dueDate;
    private boolean isOverdue;

    public LedgerEntryDto() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final LedgerEntryDto dto = new LedgerEntryDto();

        public Builder date(LocalDate date) { dto.date = date; return this; }
        public Builder referenceNumber(String referenceNumber) { dto.referenceNumber = referenceNumber; return this; }
        public Builder type(String type) { dto.type = type; return this; }
        public Builder description(String description) { dto.description = description; return this; }
        public Builder debit(BigDecimal debit) { dto.debit = debit != null ? debit : BigDecimal.ZERO; return this; }
        public Builder credit(BigDecimal credit) { dto.credit = credit != null ? credit : BigDecimal.ZERO; return this; }
        public Builder balance(BigDecimal balance) { dto.balance = balance != null ? balance : BigDecimal.ZERO; return this; }
        public Builder status(PaymentStatus status) { dto.status = status; return this; }
        public Builder dueDate(LocalDate dueDate) { dto.dueDate = dueDate; return this; }
        public Builder isOverdue(boolean isOverdue) { dto.isOverdue = isOverdue; return this; }
        public LedgerEntryDto build() { return dto; }
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getDebit() { return debit; }
    public void setDebit(BigDecimal debit) { this.debit = debit; }

    public BigDecimal getCredit() { return credit; }
    public void setCredit(BigDecimal credit) { this.credit = credit; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public boolean isOverdue() { return isOverdue; }
    public void setOverdue(boolean overdue) { isOverdue = overdue; }
}

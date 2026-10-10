package com.apex.gstsuite.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "stock_movements")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnore
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MovementType movementType;

    @Column(nullable = false)
    private BigDecimal quantityChange;

    @Column(nullable = false)
    private BigDecimal balanceAfter;

    private String referenceNumber;
    private String remarks;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public StockMovement() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final StockMovement sm = new StockMovement();

        public Builder id(UUID id) { sm.id = id; return this; }
        public Builder company(Company company) { sm.company = company; return this; }
        public Builder item(Item item) { sm.item = item; return this; }
        public Builder movementType(MovementType type) { sm.movementType = type; return this; }
        public Builder quantityChange(BigDecimal qty) { sm.quantityChange = qty; return this; }
        public Builder balanceAfter(BigDecimal bal) { sm.balanceAfter = bal; return this; }
        public Builder referenceNumber(String ref) { sm.referenceNumber = ref; return this; }
        public Builder remarks(String remarks) { sm.remarks = remarks; return this; }
        public StockMovement build() { return sm; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }

    public MovementType getMovementType() { return movementType; }
    public void setMovementType(MovementType movementType) { this.movementType = movementType; }

    public BigDecimal getQuantityChange() { return quantityChange; }
    public void setQuantityChange(BigDecimal quantityChange) { this.quantityChange = quantityChange; }

    public BigDecimal getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(BigDecimal balanceAfter) { this.balanceAfter = balanceAfter; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}

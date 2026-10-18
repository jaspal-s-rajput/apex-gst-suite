package com.apex.gstsuite.dto;

import com.apex.gstsuite.model.entity.MovementType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class StockMovementResponseDto {

    private UUID id;
    private UUID itemId;
    private String itemName;
    private MovementType movementType;
    private BigDecimal quantityChange;
    private BigDecimal balanceAfter;
    private String referenceNumber;
    private String remarks;
    private LocalDateTime createdAt;

    public StockMovementResponseDto() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final StockMovementResponseDto dto = new StockMovementResponseDto();

        public Builder id(UUID id) { dto.id = id; return this; }
        public Builder itemId(UUID itemId) { dto.itemId = itemId; return this; }
        public Builder itemName(String itemName) { dto.itemName = itemName; return this; }
        public Builder movementType(MovementType movementType) { dto.movementType = movementType; return this; }
        public Builder quantityChange(BigDecimal quantityChange) { dto.quantityChange = quantityChange; return this; }
        public Builder balanceAfter(BigDecimal balanceAfter) { dto.balanceAfter = balanceAfter; return this; }
        public Builder referenceNumber(String referenceNumber) { dto.referenceNumber = referenceNumber; return this; }
        public Builder remarks(String remarks) { dto.remarks = remarks; return this; }
        public Builder createdAt(LocalDateTime createdAt) { dto.createdAt = createdAt; return this; }
        public StockMovementResponseDto build() { return dto; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

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
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

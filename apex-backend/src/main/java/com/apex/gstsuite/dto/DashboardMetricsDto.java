package com.apex.gstsuite.dto;

import java.math.BigDecimal;

public class DashboardMetricsDto {
    private BigDecimal totalSales;
    private BigDecimal todaySales;
    private BigDecimal totalTaxCollected;
    private BigDecimal cgstCollected;
    private BigDecimal sgstCollected;
    private BigDecimal igstCollected;
    private BigDecimal totalItcAvailable;
    private BigDecimal netTaxPayable;
    private BigDecimal totalReceivables;
    private BigDecimal totalPayables;
    private long totalInvoicesCount;
    private long lowStockCount;
    private long itemsCount;

    public DashboardMetricsDto() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final DashboardMetricsDto dto = new DashboardMetricsDto();

        public Builder totalSales(BigDecimal val) { dto.totalSales = val; return this; }
        public Builder todaySales(BigDecimal val) { dto.todaySales = val; return this; }
        public Builder totalTaxCollected(BigDecimal val) { dto.totalTaxCollected = val; return this; }
        public Builder cgstCollected(BigDecimal val) { dto.cgstCollected = val; return this; }
        public Builder sgstCollected(BigDecimal val) { dto.sgstCollected = val; return this; }
        public Builder igstCollected(BigDecimal val) { dto.igstCollected = val; return this; }
        public Builder totalItcAvailable(BigDecimal val) { dto.totalItcAvailable = val; return this; }
        public Builder netTaxPayable(BigDecimal val) { dto.netTaxPayable = val; return this; }
        public Builder totalReceivables(BigDecimal val) { dto.totalReceivables = val; return this; }
        public Builder totalPayables(BigDecimal val) { dto.totalPayables = val; return this; }
        public Builder totalInvoicesCount(long val) { dto.totalInvoicesCount = val; return this; }
        public Builder lowStockCount(long val) { dto.lowStockCount = val; return this; }
        public Builder itemsCount(long val) { dto.itemsCount = val; return this; }
        public DashboardMetricsDto build() { return dto; }
    }

    public BigDecimal getTotalSales() { return totalSales; }
    public void setTotalSales(BigDecimal totalSales) { this.totalSales = totalSales; }

    public BigDecimal getTodaySales() { return todaySales; }
    public void setTodaySales(BigDecimal todaySales) { this.todaySales = todaySales; }

    public BigDecimal getTotalTaxCollected() { return totalTaxCollected; }
    public void setTotalTaxCollected(BigDecimal totalTaxCollected) { this.totalTaxCollected = totalTaxCollected; }

    public BigDecimal getCgstCollected() { return cgstCollected; }
    public void setCgstCollected(BigDecimal cgstCollected) { this.cgstCollected = cgstCollected; }

    public BigDecimal getSgstCollected() { return sgstCollected; }
    public void setSgstCollected(BigDecimal sgstCollected) { this.sgstCollected = sgstCollected; }

    public BigDecimal getIgstCollected() { return igstCollected; }
    public void setIgstCollected(BigDecimal igstCollected) { this.igstCollected = igstCollected; }

    public BigDecimal getTotalItcAvailable() { return totalItcAvailable; }
    public void setTotalItcAvailable(BigDecimal totalItcAvailable) { this.totalItcAvailable = totalItcAvailable; }

    public BigDecimal getNetTaxPayable() { return netTaxPayable; }
    public void setNetTaxPayable(BigDecimal netTaxPayable) { this.netTaxPayable = netTaxPayable; }

    public BigDecimal getTotalReceivables() { return totalReceivables; }
    public void setTotalReceivables(BigDecimal totalReceivables) { this.totalReceivables = totalReceivables; }

    public BigDecimal getTotalPayables() { return totalPayables; }
    public void setTotalPayables(BigDecimal totalPayables) { this.totalPayables = totalPayables; }

    public long getTotalInvoicesCount() { return totalInvoicesCount; }
    public void setTotalInvoicesCount(long totalInvoicesCount) { this.totalInvoicesCount = totalInvoicesCount; }

    public long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }

    public long getItemsCount() { return itemsCount; }
    public void setItemsCount(long itemsCount) { this.itemsCount = itemsCount; }
}

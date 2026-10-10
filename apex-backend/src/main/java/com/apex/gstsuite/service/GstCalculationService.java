package com.apex.gstsuite.service;

import com.apex.gstsuite.model.entity.InvoiceItem;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class GstCalculationService {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final BigDecimal TWO = BigDecimal.valueOf(2);

    /**
     * Calculates tax amounts for an individual invoice line item based on state codes.
     */
    public void calculateLineItem(InvoiceItem item, String companyStateCode, String placeOfSupply) {
        BigDecimal qty = item.getQuantity() != null ? item.getQuantity() : BigDecimal.ONE;
        BigDecimal price = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;

        BigDecimal gross = price.multiply(qty).setScale(2, RoundingMode.HALF_UP);

        BigDecimal discount = BigDecimal.ZERO;
        if (item.getDiscountPercent() != null && item.getDiscountPercent().compareTo(BigDecimal.ZERO) > 0) {
            discount = gross.multiply(item.getDiscountPercent()).divide(HUNDRED, 2, RoundingMode.HALF_UP);
            item.setDiscountAmount(discount);
        } else if (item.getDiscountAmount() != null) {
            discount = item.getDiscountAmount();
        }

        BigDecimal taxableValue = gross.subtract(discount).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
        item.setTaxableValue(taxableValue);

        BigDecimal gstRate = item.getGstRate() != null ? item.getGstRate() : BigDecimal.ZERO;
        boolean isInterState = !companyStateCode.trim().equalsIgnoreCase(placeOfSupply.trim());

        if (isInterState) {
            item.setCgstRate(BigDecimal.ZERO);
            item.setCgstAmount(BigDecimal.ZERO);
            item.setSgstRate(BigDecimal.ZERO);
            item.setSgstAmount(BigDecimal.ZERO);

            item.setIgstRate(gstRate);
            BigDecimal igstAmount = taxableValue.multiply(gstRate).divide(HUNDRED, 2, RoundingMode.HALF_UP);
            item.setIgstAmount(igstAmount);
        } else {
            BigDecimal halfRate = gstRate.divide(TWO, 2, RoundingMode.HALF_UP);
            item.setCgstRate(halfRate);
            item.setSgstRate(halfRate);

            BigDecimal cgstAmount = taxableValue.multiply(halfRate).divide(HUNDRED, 2, RoundingMode.HALF_UP);
            BigDecimal sgstAmount = taxableValue.multiply(halfRate).divide(HUNDRED, 2, RoundingMode.HALF_UP);
            item.setCgstAmount(cgstAmount);
            item.setSgstAmount(sgstAmount);

            item.setIgstRate(BigDecimal.ZERO);
            item.setIgstAmount(BigDecimal.ZERO);
        }

        BigDecimal cessAmount = BigDecimal.ZERO;
        if (item.getCessRate() != null && item.getCessRate().compareTo(BigDecimal.ZERO) > 0) {
            cessAmount = taxableValue.multiply(item.getCessRate()).divide(HUNDRED, 2, RoundingMode.HALF_UP);
        }
        item.setCessAmount(cessAmount);

        BigDecimal lineTotal = taxableValue
                .add(item.getCgstAmount())
                .add(item.getSgstAmount())
                .add(item.getIgstAmount())
                .add(item.getCessAmount())
                .setScale(2, RoundingMode.HALF_UP);

        item.setTotalAmount(lineTotal);
    }

    /**
     * Calculates round-off to nearest rupee.
     * Example: 1045.30 -> roundOff = -0.30, roundedTotal = 1045.00
     * Example: 1045.70 -> roundOff = +0.30, roundedTotal = 1046.00
     */
    public BigDecimal calculateRoundOff(BigDecimal amount) {
        if (amount == null) return BigDecimal.ZERO;
        BigDecimal rounded = amount.setScale(0, RoundingMode.HALF_UP);
        return rounded.subtract(amount).setScale(2, RoundingMode.HALF_UP);
    }
}

package com.apex.gstsuite.service;

import com.apex.gstsuite.model.entity.InvoiceItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class GstCalculationServiceTest {

    private GstCalculationService calculationService;

    @BeforeEach
    void setUp() {
        calculationService = new GstCalculationService();
    }

    @Test
    void testIntraStateCalculation() {
        InvoiceItem item = InvoiceItem.builder()
                .quantity(BigDecimal.valueOf(2))
                .unitPrice(BigDecimal.valueOf(1000.00))
                .discountPercent(BigDecimal.valueOf(10.0)) // 10% discount on 2000 = 200 -> taxable = 1800
                .gstRate(BigDecimal.valueOf(18.0))
                .build();

        // Intra-state: Company state = 27 (MH), Place of supply = 27 (MH)
        calculationService.calculateLineItem(item, "27", "27");

        assertEquals(0, BigDecimal.valueOf(1800.00).compareTo(item.getTaxableValue()));
        assertEquals(0, BigDecimal.valueOf(9.00).compareTo(item.getCgstRate()));
        assertEquals(0, BigDecimal.valueOf(9.00).compareTo(item.getSgstRate()));
        assertEquals(0, BigDecimal.valueOf(162.00).compareTo(item.getCgstAmount()));
        assertEquals(0, BigDecimal.valueOf(162.00).compareTo(item.getSgstAmount()));
        assertEquals(0, BigDecimal.ZERO.compareTo(item.getIgstAmount()));
        assertEquals(0, BigDecimal.valueOf(2124.00).compareTo(item.getTotalAmount()));
    }

    @Test
    void testInterStateCalculation() {
        InvoiceItem item = InvoiceItem.builder()
                .quantity(BigDecimal.valueOf(1))
                .unitPrice(BigDecimal.valueOf(5000.00))
                .gstRate(BigDecimal.valueOf(18.0))
                .build();

        // Inter-state: Company state = 27 (MH), Place of supply = 29 (KA)
        calculationService.calculateLineItem(item, "27", "29");

        assertEquals(0, BigDecimal.valueOf(5000.00).compareTo(item.getTaxableValue()));
        assertEquals(0, BigDecimal.ZERO.compareTo(item.getCgstAmount()));
        assertEquals(0, BigDecimal.ZERO.compareTo(item.getSgstAmount()));
        assertEquals(0, BigDecimal.valueOf(18.00).compareTo(item.getIgstRate()));
        assertEquals(0, BigDecimal.valueOf(900.00).compareTo(item.getIgstAmount()));
        assertEquals(0, BigDecimal.valueOf(5900.00).compareTo(item.getTotalAmount()));
    }

    @Test
    void testRoundOffCalculation() {
        // 1450.35 rounds to 1450.00 -> diff = -0.35
        BigDecimal roundOffNegative = calculationService.calculateRoundOff(BigDecimal.valueOf(1450.35));
        assertEquals(0, BigDecimal.valueOf(-0.35).compareTo(roundOffNegative));

        // 1450.70 rounds to 1451.00 -> diff = +0.30
        BigDecimal roundOffPositive = calculationService.calculateRoundOff(BigDecimal.valueOf(1450.70));
        assertEquals(0, BigDecimal.valueOf(0.30).compareTo(roundOffPositive));
    }
}

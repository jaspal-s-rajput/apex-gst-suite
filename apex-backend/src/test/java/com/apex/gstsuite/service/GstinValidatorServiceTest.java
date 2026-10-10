package com.apex.gstsuite.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class GstinValidatorServiceTest {

    private GstinValidatorService validatorService;

    @BeforeEach
    void setUp() {
        validatorService = new GstinValidatorService();
    }

    @Test
    void testValidGstin() {
        // Valid Maharashtra GSTIN
        assertTrue(validatorService.isValidGstin("27AAPFU0939F1ZV"));
    }

    @Test
    void testInvalidChecksumGstin() {
        // Last char changed from V to X
        assertFalse(validatorService.isValidGstin("27AAPFU0939F1ZX"));
    }

    @Test
    void testInvalidLengthGstin() {
        assertFalse(validatorService.isValidGstin("27AAPFU0939F1"));
    }

    @Test
    void testStateExtraction() {
        assertEquals("27", validatorService.extractStateCode("27AAPFU0939F1ZV"));
        assertEquals("Maharashtra", validatorService.getStateName("27"));
        assertEquals("Karnataka", validatorService.getStateName("29"));
        assertEquals("Delhi", validatorService.getStateName("07"));
    }
}

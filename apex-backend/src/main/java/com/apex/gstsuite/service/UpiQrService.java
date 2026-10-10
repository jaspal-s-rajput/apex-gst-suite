package com.apex.gstsuite.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class UpiQrService {

    /**
     * Generates standard NPCI UPI link string for dynamic QR code rendering on invoices.
     * Compatible with PhonePe, Google Pay, Paytm, BHIM, and any NPCI UPI app.
     */
    public String generateUpiPayload(String upiId, String payeeName, BigDecimal amount, String invoiceNumber) {
        if (upiId == null || upiId.isBlank()) {
            return null;
        }

        StringBuilder uri = new StringBuilder("upi://pay?");
        uri.append("pa=").append(urlEncode(upiId.trim()));

        if (payeeName != null && !payeeName.isBlank()) {
            uri.append("&pn=").append(urlEncode(payeeName.trim()));
        }

        if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            uri.append("&am=").append(amount.setScale(2, java.math.RoundingMode.HALF_UP));
        }

        uri.append("&cu=INR");

        if (invoiceNumber != null && !invoiceNumber.isBlank()) {
            uri.append("&tr=").append(urlEncode(invoiceNumber.trim()));
            uri.append("&tn=").append(urlEncode("Payment for " + invoiceNumber.trim()));
        }

        return uri.toString();
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }
}

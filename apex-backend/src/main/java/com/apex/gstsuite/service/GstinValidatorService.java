package com.apex.gstsuite.service;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class GstinValidatorService {

    private static final Pattern GSTIN_PATTERN = Pattern.compile("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$");
    private static final String CONVERSION_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private static final Map<String, String> STATE_CODES;

    static {
        Map<String, String> states = new HashMap<>();
        states.put("01", "Jammu and Kashmir");
        states.put("02", "Himachal Pradesh");
        states.put("03", "Punjab");
        states.put("04", "Chandigarh");
        states.put("05", "Uttarakhand");
        states.put("06", "Haryana");
        states.put("07", "Delhi");
        states.put("08", "Rajasthan");
        states.put("09", "Uttar Pradesh");
        states.put("10", "Bihar");
        states.put("11", "Sikkim");
        states.put("12", "Arunachal Pradesh");
        states.put("13", "Nagaland");
        states.put("14", "Manipur");
        states.put("15", "Mizoram");
        states.put("16", "Tripura");
        states.put("17", "Meghalaya");
        states.put("18", "Assam");
        states.put("19", "West Bengal");
        states.put("20", "Jharkhand");
        states.put("21", "Odisha");
        states.put("22", "Chhattisgarh");
        states.put("23", "Madhya Pradesh");
        states.put("24", "Gujarat");
        states.put("25", "Daman and Diu");
        states.put("26", "Dadra and Nagar Haveli");
        states.put("27", "Maharashtra");
        states.put("28", "Andhra Pradesh (Old)");
        states.put("29", "Karnataka");
        states.put("30", "Goa");
        states.put("31", "Lakshadweep");
        states.put("32", "Kerala");
        states.put("33", "Tamil Nadu");
        states.put("34", "Puducherry");
        states.put("35", "Andaman and Nicobar Islands");
        states.put("36", "Telangana");
        states.put("37", "Andhra Pradesh (New)");
        states.put("38", "Ladakh");
        states.put("97", "Other Territory");
        states.put("99", "Centre Jurisdiction");
        STATE_CODES = Collections.unmodifiableMap(states);
    }

    public boolean isValidGstin(String gstin) {
        if (gstin == null || gstin.trim().length() != 15) {
            return false;
        }
        String cleanGstin = gstin.trim().toUpperCase();
        if (!GSTIN_PATTERN.matcher(cleanGstin).matches()) {
            return false;
        }
        String stateCode = cleanGstin.substring(0, 2);
        if (!STATE_CODES.containsKey(stateCode)) {
            return false;
        }
        return verifyChecksum(cleanGstin);
    }

    public String getStateName(String stateCode) {
        return STATE_CODES.getOrDefault(stateCode, "Unknown State");
    }

    public String extractStateCode(String gstin) {
        if (gstin != null && gstin.length() >= 2) {
            return gstin.substring(0, 2);
        }
        return null;
    }

    public Map<String, String> getAllStates() {
        return STATE_CODES;
    }

    /**
     * Luhn Algorithm (Mod-36) verification for GSTIN
     */
    private boolean verifyChecksum(String gstin) {
        int factor = 2;
        int sum = 0;
        int checkCodePoint = CONVERSION_CHARS.indexOf(gstin.charAt(14));

        for (int i = 13; i >= 0; i--) {
            int codePoint = CONVERSION_CHARS.indexOf(gstin.charAt(i));
            if (codePoint == -1) {
                return false;
            }
            int addend = factor * codePoint;
            factor = (factor == 2) ? 1 : 2;
            addend = (addend / 36) + (addend % 36);
            sum += addend;
        }

        int remainder = sum % 36;
        int computedCheckCodePoint = (36 - remainder) % 36;
        return computedCheckCodePoint == checkCodePoint;
    }
}

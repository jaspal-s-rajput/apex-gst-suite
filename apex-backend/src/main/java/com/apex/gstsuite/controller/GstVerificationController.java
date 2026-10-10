package com.apex.gstsuite.controller;

import com.apex.gstsuite.dto.GstVerifyResponseDto;
import com.apex.gstsuite.service.GstinValidatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/gst")
public class GstVerificationController {

    private final GstinValidatorService gstinValidatorService;

    public GstVerificationController(GstinValidatorService gstinValidatorService) {
        this.gstinValidatorService = gstinValidatorService;
    }

    @GetMapping("/verify/{gstin}")
    public ResponseEntity<GstVerifyResponseDto> verifyGstin(@PathVariable String gstin) {
        String cleanGstin = gstin != null ? gstin.trim().toUpperCase() : "";
        boolean valid = gstinValidatorService.isValidGstin(cleanGstin);

        String stateCode = gstinValidatorService.extractStateCode(cleanGstin);
        String stateName = stateCode != null ? gstinValidatorService.getStateName(stateCode) : null;
        String pan = (cleanGstin.length() >= 12) ? cleanGstin.substring(2, 12) : null;

        String entityType = null;
        if (pan != null && pan.length() >= 4) {
            char typeChar = pan.charAt(3);
            entityType = switch (typeChar) {
                case 'C' -> "Company";
                case 'P' -> "Individual / Proprietorship";
                case 'H' -> "HUF (Hindu Undivided Family)";
                case 'F' -> "Partnership Firm / LLP";
                case 'A' -> "Association of Persons (AOP)";
                case 'T' -> "Trust";
                case 'B' -> "Body of Individuals (BOI)";
                case 'L' -> "Local Authority";
                case 'J' -> "Artificial Juridical Person";
                case 'G' -> "Government";
                default -> "Registered Entity";
            };
        }

        GstVerifyResponseDto response = GstVerifyResponseDto.builder()
                .gstin(cleanGstin)
                .isValid(valid)
                .stateCode(stateCode)
                .stateName(stateName)
                .pan(pan)
                .entityType(entityType)
                .message(valid ? "Valid GSTIN format and checksum" : "Invalid GSTIN or checksum mismatch")
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/states")
    public ResponseEntity<Map<String, String>> getAllStates() {
        return ResponseEntity.ok(gstinValidatorService.getAllStates());
    }
}

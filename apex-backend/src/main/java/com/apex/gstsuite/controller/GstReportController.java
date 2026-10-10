package com.apex.gstsuite.controller;

import com.apex.gstsuite.dto.DashboardMetricsDto;
import com.apex.gstsuite.service.CompanyService;
import com.apex.gstsuite.service.GstReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
public class GstReportController {

    private final GstReportService gstReportService;
    private final CompanyService companyService;

    public GstReportController(GstReportService gstReportService, CompanyService companyService) {
        this.gstReportService = gstReportService;
        this.companyService = companyService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardMetricsDto> getDashboardMetrics(@RequestParam(required = false) UUID companyId) {
        UUID effectiveCompanyId = companyId != null ? companyId : companyService.getOrCreateDefaultCompany().getId();
        return ResponseEntity.ok(gstReportService.getDashboardMetrics(effectiveCompanyId));
    }

    @GetMapping("/hsn-summary")
    public ResponseEntity<Map<String, Object>> getHsnSummary(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        UUID effectiveCompanyId = companyId != null ? companyId : companyService.getOrCreateDefaultCompany().getId();
        return ResponseEntity.ok(gstReportService.getHsnSummary(effectiveCompanyId, startDate, endDate));
    }
}

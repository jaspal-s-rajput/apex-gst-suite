package com.apex.gstsuite.controller;

import com.apex.gstsuite.dto.InvoiceRequestDto;
import com.apex.gstsuite.model.entity.Invoice;
import com.apex.gstsuite.service.CompanyService;
import com.apex.gstsuite.service.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final CompanyService companyService;

    public InvoiceController(InvoiceService invoiceService, CompanyService companyService) {
        this.invoiceService = invoiceService;
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getInvoices(@RequestParam(required = false) UUID companyId) {
        UUID effectiveCompanyId = companyId != null ? companyId : companyService.getOrCreateDefaultCompany().getId();
        return ResponseEntity.ok(invoiceService.getAllInvoices(effectiveCompanyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable UUID id) {
        return invoiceService.getInvoice(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@Valid @RequestBody InvoiceRequestDto request) {
        if (request.getCompanyId() == null) {
            request.setCompanyId(companyService.getOrCreateDefaultCompany().getId());
        }
        return ResponseEntity.ok(invoiceService.createInvoice(request));
    }
}

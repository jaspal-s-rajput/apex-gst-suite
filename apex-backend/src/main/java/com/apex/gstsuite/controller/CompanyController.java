package com.apex.gstsuite.controller;

import com.apex.gstsuite.model.entity.Company;
import com.apex.gstsuite.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/current")
    public ResponseEntity<Company> getCurrentCompany() {
        return ResponseEntity.ok(companyService.getOrCreateDefaultCompany());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable UUID id) {
        return companyService.getCompany(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Company> updateOrCreateCompany(@Valid @RequestBody Company company) {
        return ResponseEntity.ok(companyService.saveCompany(company));
    }
}

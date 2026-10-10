package com.apex.gstsuite.service;

import com.apex.gstsuite.model.entity.Company;
import com.apex.gstsuite.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
    public Optional<Company> getCompany(UUID id) {
        return companyRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Company getOrCreateDefaultCompany() {
        return companyRepository.findAll().stream().findFirst().orElseGet(() -> {
            Company defaultCompany = Company.builder()
                    .legalName("Apex Enterprises Pvt Ltd")
                    .tradeName("Apex Solutions")
                    .gstin("27AAPFU0939F1ZV")
                    .pan("AAPFU0939F")
                    .stateCode("27")
                    .stateName("Maharashtra")
                    .addressLine1("Plot 42, Tech Park Avenue, Andheri East")
                    .city("Mumbai")
                    .pincode("400069")
                    .phone("+91 98765 43210")
                    .email("billing@apexsuite.in")
                    .upiId("apexsolutions@upi")
                    .bankName("HDFC Bank")
                    .accountNumber("50200012345678")
                    .ifscCode("HDFC0001234")
                    .branchName("Andheri East Branch")
                    .invoicePrefix("APEX/26-27")
                    .nextInvoiceSequence(101L)
                    .build();
            return companyRepository.save(defaultCompany);
        });
    }

    @Transactional
    public Company saveCompany(Company company) {
        return companyRepository.save(company);
    }
}

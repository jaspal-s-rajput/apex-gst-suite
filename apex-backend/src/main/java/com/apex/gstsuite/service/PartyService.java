package com.apex.gstsuite.service;

import com.apex.gstsuite.model.entity.Company;
import com.apex.gstsuite.model.entity.Party;
import com.apex.gstsuite.model.entity.PartyType;
import com.apex.gstsuite.dto.LedgerEntryDto;
import com.apex.gstsuite.dto.PartyStatementDto;
import com.apex.gstsuite.model.entity.Invoice;
import com.apex.gstsuite.model.entity.PaymentStatus;
import com.apex.gstsuite.model.entity.PurchaseBill;
import com.apex.gstsuite.repository.InvoiceRepository;
import com.apex.gstsuite.repository.PartyRepository;
import com.apex.gstsuite.repository.PurchaseBillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PartyService {

    private final PartyRepository partyRepository;
    private final CompanyService companyService;
    private final GstinValidatorService gstinValidatorService;
    private final InvoiceRepository invoiceRepository;
    private final PurchaseBillRepository purchaseBillRepository;

    public PartyService(PartyRepository partyRepository,
                        CompanyService companyService,
                        GstinValidatorService gstinValidatorService,
                        InvoiceRepository invoiceRepository,
                        PurchaseBillRepository purchaseBillRepository) {
        this.partyRepository = partyRepository;
        this.companyService = companyService;
        this.gstinValidatorService = gstinValidatorService;
        this.invoiceRepository = invoiceRepository;
        this.purchaseBillRepository = purchaseBillRepository;
    }

    @Transactional(readOnly = true)
    public List<Party> getParties(UUID companyId, PartyType partyType, String search) {
        if (search != null && !search.isBlank()) {
            return partyRepository.findByCompanyIdAndNameContainingIgnoreCaseAndIsActiveTrue(companyId, search.trim());
        }
        if (partyType != null) {
            return partyRepository.findByCompanyIdAndPartyTypeAndIsActiveTrue(companyId, partyType);
        }
        return partyRepository.findByCompanyIdAndIsActiveTrue(companyId);
    }

    @Transactional(readOnly = true)
    public Optional<Party> getParty(UUID id) {
        return partyRepository.findById(id);
    }

    @Transactional
    public Party saveParty(UUID companyId, Party party) {
        Company company = companyService.getCompany(companyId)
                .orElseGet(companyService::getOrCreateDefaultCompany);
        party.setCompany(company);

        if (party.getGstin() != null && !party.getGstin().isBlank()) {
            String cleanGstin = party.getGstin().trim().toUpperCase();
            party.setGstin(cleanGstin);
            String stateCode = gstinValidatorService.extractStateCode(cleanGstin);
            if (stateCode != null) {
                party.setStateCode(stateCode);
                party.setStateName(gstinValidatorService.getStateName(stateCode));
            }
            if (cleanGstin.length() >= 12) {
                party.setPan(cleanGstin.substring(2, 12));
            }
        }

        return partyRepository.save(party);
    }

    @Transactional
    public Party updateParty(UUID id, Party partyData) {
        Party party = partyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Party not found with ID: " + id));

        party.setName(partyData.getName());
        party.setPartyType(partyData.getPartyType());
        party.setPhone(partyData.getPhone());
        party.setEmail(partyData.getEmail());
        party.setBillingAddress(partyData.getBillingAddress());
        party.setShippingAddress(partyData.getShippingAddress());
        party.setCity(partyData.getCity());
        party.setPincode(partyData.getPincode());
        if (partyData.getCreditPeriodDays() != null) {
            party.setCreditPeriodDays(partyData.getCreditPeriodDays());
        }
        if (partyData.getCreditLimit() != null) {
            party.setCreditLimit(partyData.getCreditLimit());
        }
        if (partyData.getOpeningBalance() != null) {
            party.setOpeningBalance(partyData.getOpeningBalance());
        }

        if (partyData.getGstin() != null && !partyData.getGstin().isBlank()) {
            String cleanGstin = partyData.getGstin().trim().toUpperCase();
            party.setGstin(cleanGstin);
            String stateCode = gstinValidatorService.extractStateCode(cleanGstin);
            if (stateCode != null) {
                party.setStateCode(stateCode);
                party.setStateName(gstinValidatorService.getStateName(stateCode));
            }
            if (cleanGstin.length() >= 12) {
                party.setPan(cleanGstin.substring(2, 12));
            }
        } else {
            party.setGstin(null);
        }

        return partyRepository.save(party);
    }

    @Transactional
    public PartyStatementDto getPartyStatement(UUID partyId, LocalDate fromDate, LocalDate toDate) {
        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new IllegalArgumentException("Party not found with ID: " + partyId));

        List<Invoice> invoices = invoiceRepository.findByPartyIdOrderByInvoiceDateAsc(partyId);
        List<PurchaseBill> purchaseBills = purchaseBillRepository.findByVendorIdOrderByBillDateAsc(partyId);

        BigDecimal initialOpening = party.getOpeningBalance() != null ? party.getOpeningBalance() : BigDecimal.ZERO;
        BigDecimal runningBalance = initialOpening;
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;
        BigDecimal overdueAmount = BigDecimal.ZERO;
        int overdueCount = 0;

        List<LedgerEntryDto> allEntries = new ArrayList<>();

        // 1. Initial Opening balance entry (if non-zero)
        if (initialOpening.compareTo(BigDecimal.ZERO) != 0) {
            LocalDate opDate = party.getCreatedAt() != null ? party.getCreatedAt().toLocalDate() : LocalDate.now().minusMonths(1);
            allEntries.add(LedgerEntryDto.builder()
                    .date(opDate)
                    .referenceNumber("OP-BAL")
                    .type("OPENING_BALANCE")
                    .description("Opening Account Balance")
                    .debit(initialOpening.compareTo(BigDecimal.ZERO) > 0 ? initialOpening : BigDecimal.ZERO)
                    .credit(initialOpening.compareTo(BigDecimal.ZERO) < 0 ? initialOpening.abs() : BigDecimal.ZERO)
                    .balance(initialOpening)
                    .status(PaymentStatus.PAID)
                    .isOverdue(false)
                    .build());
            if (initialOpening.compareTo(BigDecimal.ZERO) > 0) {
                totalDebit = totalDebit.add(initialOpening);
            } else {
                totalCredit = totalCredit.add(initialOpening.abs());
            }
        }

        // 2. Process customer invoices
        for (Invoice inv : invoices) {
            BigDecimal invTotal = inv.getGrandTotal() != null ? inv.getGrandTotal() : BigDecimal.ZERO;
            BigDecimal invPaid = inv.getAmountPaid() != null ? inv.getAmountPaid() : BigDecimal.ZERO;
            BigDecimal invBal = inv.getBalanceAmount() != null ? inv.getBalanceAmount() : invTotal.subtract(invPaid);

            LocalDate due = inv.getDueDate();
            if (due == null && inv.getInvoiceDate() != null) {
                int terms = party.getCreditPeriodDays() != null ? party.getCreditPeriodDays() : 30;
                due = inv.getInvoiceDate().plusDays(terms);
            }
            boolean isOverdue = inv.getPaymentStatus() != PaymentStatus.PAID && due != null && due.isBefore(LocalDate.now());
            if (isOverdue && invBal.compareTo(BigDecimal.ZERO) > 0) {
                overdueAmount = overdueAmount.add(invBal);
                overdueCount++;
            }

            // Debit for Invoice
            runningBalance = runningBalance.add(invTotal);
            totalDebit = totalDebit.add(invTotal);

            allEntries.add(LedgerEntryDto.builder()
                    .date(inv.getInvoiceDate())
                    .referenceNumber(inv.getInvoiceNumber())
                    .type("INVOICE")
                    .description("Tax Invoice (" + inv.getInvoiceType() + ")")
                    .debit(invTotal)
                    .credit(BigDecimal.ZERO)
                    .balance(runningBalance)
                    .status(inv.getPaymentStatus())
                    .dueDate(due)
                    .isOverdue(isOverdue)
                    .build());

            // Credit for payment (if any paid on this invoice)
            if (invPaid.compareTo(BigDecimal.ZERO) > 0) {
                runningBalance = runningBalance.subtract(invPaid);
                totalCredit = totalCredit.add(invPaid);

                allEntries.add(LedgerEntryDto.builder()
                        .date(inv.getInvoiceDate())
                        .referenceNumber(inv.getInvoiceNumber())
                        .type("PAYMENT")
                        .description("Payment Received (" + (inv.getPaymentMode() != null ? inv.getPaymentMode() : "Direct") + ")")
                        .debit(BigDecimal.ZERO)
                        .credit(invPaid)
                        .balance(runningBalance)
                        .status(PaymentStatus.PAID)
                        .dueDate(null)
                        .isOverdue(false)
                        .build());
            }
        }

        // 3. Process vendor purchase bills
        for (PurchaseBill pb : purchaseBills) {
            BigDecimal pbTotal = pb.getGrandTotal() != null ? pb.getGrandTotal() : BigDecimal.ZERO;
            BigDecimal pbPaid = pb.getAmountPaid() != null ? pb.getAmountPaid() : BigDecimal.ZERO;

            // Purchase bill increases payable (credit)
            runningBalance = runningBalance.subtract(pbTotal);
            totalCredit = totalCredit.add(pbTotal);

            allEntries.add(LedgerEntryDto.builder()
                    .date(pb.getBillDate())
                    .referenceNumber(pb.getVendorBillNumber())
                    .type("PURCHASE_BILL")
                    .description("Vendor Purchase Bill")
                    .debit(BigDecimal.ZERO)
                    .credit(pbTotal)
                    .balance(runningBalance)
                    .status(pb.getPaymentStatus())
                    .dueDate(pb.getDueDate())
                    .isOverdue(false)
                    .build());

            if (pbPaid.compareTo(BigDecimal.ZERO) > 0) {
                runningBalance = runningBalance.add(pbPaid);
                totalDebit = totalDebit.add(pbPaid);

                allEntries.add(LedgerEntryDto.builder()
                        .date(pb.getBillDate())
                        .referenceNumber(pb.getVendorBillNumber())
                        .type("PAYMENT")
                        .description("Payment Made to Vendor")
                        .debit(pbPaid)
                        .credit(BigDecimal.ZERO)
                        .balance(runningBalance)
                        .status(PaymentStatus.PAID)
                        .dueDate(null)
                        .isOverdue(false)
                        .build());
            }
        }

        // Sort entries by date ascending
        allEntries.sort(Comparator.comparing(LedgerEntryDto::getDate));

        // Recompute continuous running balance in case entries were interleaved
        BigDecimal curBal = BigDecimal.ZERO;
        for (LedgerEntryDto entry : allEntries) {
            curBal = curBal.add(entry.getDebit()).subtract(entry.getCredit());
            entry.setBalance(curBal);
        }

        // Filter date range if specified
        List<LedgerEntryDto> filteredEntries = new ArrayList<>();
        for (LedgerEntryDto entry : allEntries) {
            if (fromDate != null && entry.getDate().isBefore(fromDate)) {
                continue;
            }
            if (toDate != null && entry.getDate().isAfter(toDate)) {
                continue;
            }
            filteredEntries.add(entry);
        }

        BigDecimal closingBalance = curBal;
        party.setCurrentBalance(closingBalance);
        partyRepository.save(party);

        boolean creditLimitExceeded = party.getCreditLimit() != null
                && party.getCreditLimit().compareTo(BigDecimal.ZERO) > 0
                && closingBalance.compareTo(party.getCreditLimit()) > 0;

        BigDecimal excessCredit = creditLimitExceeded ? closingBalance.subtract(party.getCreditLimit()) : BigDecimal.ZERO;

        return PartyStatementDto.builder()
                .partyId(party.getId())
                .partyName(party.getName())
                .partyType(party.getPartyType() != null ? party.getPartyType().name() : "CUSTOMER")
                .gstin(party.getGstin())
                .pan(party.getPan())
                .phone(party.getPhone())
                .email(party.getEmail())
                .billingAddress(party.getBillingAddress())
                .stateCode(party.getStateCode())
                .stateName(party.getStateName())
                .creditPeriodDays(party.getCreditPeriodDays() != null ? party.getCreditPeriodDays() : 30)
                .creditLimit(party.getCreditLimit())
                .openingBalance(party.getOpeningBalance())
                .currentBalance(closingBalance)
                .fromDate(fromDate)
                .toDate(toDate)
                .totalDebit(totalDebit)
                .totalCredit(totalCredit)
                .closingBalance(closingBalance)
                .creditLimitExceeded(creditLimitExceeded)
                .excessCreditAmount(excessCredit)
                .overdueAmount(overdueAmount)
                .overdueInvoicesCount(overdueCount)
                .entries(filteredEntries)
                .build();
    }

    @Transactional
    public void deleteParty(UUID id) {
        partyRepository.findById(id).ifPresent(p -> {
            p.setIsActive(false);
            partyRepository.save(p);
        });
    }
}

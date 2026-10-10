package com.apex.gstsuite.service;

import com.apex.gstsuite.dto.InvoiceItemRequestDto;
import com.apex.gstsuite.dto.InvoiceRequestDto;
import com.apex.gstsuite.model.entity.*;
import com.apex.gstsuite.repository.InvoiceRepository;
import com.apex.gstsuite.repository.ItemRepository;
import com.apex.gstsuite.repository.PartyRepository;
import com.apex.gstsuite.repository.StockMovementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ItemRepository itemRepository;
    private final PartyRepository partyRepository;
    private final StockMovementRepository stockMovementRepository;
    private final CompanyService companyService;
    private final GstCalculationService gstCalculationService;
    private final UpiQrService upiQrService;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          ItemRepository itemRepository,
                          PartyRepository partyRepository,
                          StockMovementRepository stockMovementRepository,
                          CompanyService companyService,
                          GstCalculationService gstCalculationService,
                          UpiQrService upiQrService) {
        this.invoiceRepository = invoiceRepository;
        this.itemRepository = itemRepository;
        this.partyRepository = partyRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.companyService = companyService;
        this.gstCalculationService = gstCalculationService;
        this.upiQrService = upiQrService;
    }

    @Transactional(readOnly = true)
    public List<Invoice> getAllInvoices(UUID companyId) {
        return invoiceRepository.findByCompanyIdOrderByInvoiceDateDesc(companyId);
    }

    @Transactional(readOnly = true)
    public Optional<Invoice> getInvoice(UUID id) {
        return invoiceRepository.findById(id);
    }

    @Transactional
    public Invoice createInvoice(InvoiceRequestDto request) {
        Company company = companyService.getCompany(request.getCompanyId())
                .orElseGet(companyService::getOrCreateDefaultCompany);

        Party party = null;
        if (request.getPartyId() != null) {
            party = partyRepository.findById(request.getPartyId()).orElse(null);
        }

        String placeOfSupply = request.getPlaceOfSupply();
        if ((placeOfSupply == null || placeOfSupply.isBlank()) && party != null) {
            placeOfSupply = party.getStateCode();
        }
        if (placeOfSupply == null || placeOfSupply.isBlank()) {
            placeOfSupply = company.getStateCode();
        }

        String invoiceNumber = request.getInvoiceNumber();
        if (invoiceNumber == null || invoiceNumber.isBlank()) {
            Long nextSeq = company.getNextInvoiceSequence() != null ? company.getNextInvoiceSequence() : 1L;
            invoiceNumber = String.format("%s/%04d", company.getInvoicePrefix(), nextSeq);
            company.setNextInvoiceSequence(nextSeq + 1);
            companyService.saveCompany(company);
        }

        boolean isInterState = !company.getStateCode().trim().equalsIgnoreCase(placeOfSupply.trim());

        Invoice invoice = Invoice.builder()
                .company(company)
                .party(party)
                .invoiceNumber(invoiceNumber)
                .invoiceType(request.getInvoiceType() != null ? request.getInvoiceType() : InvoiceType.TAX_INVOICE)
                .invoiceDate(request.getInvoiceDate() != null ? request.getInvoiceDate() : LocalDate.now())
                .dueDate(request.getDueDate())
                .placeOfSupply(placeOfSupply)
                .isInterState(isInterState)
                .isReverseCharge(Boolean.TRUE.equals(request.getIsReverseCharge()))
                .paymentMode(request.getPaymentMode())
                .notes(request.getNotes())
                .termsAndConditions(request.getTermsAndConditions())
                .items(new ArrayList<>())
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxableTotal = BigDecimal.ZERO;
        BigDecimal cgstTotal = BigDecimal.ZERO;
        BigDecimal sgstTotal = BigDecimal.ZERO;
        BigDecimal igstTotal = BigDecimal.ZERO;
        BigDecimal cessTotal = BigDecimal.ZERO;

        for (InvoiceItemRequestDto itemDto : request.getItems()) {
            Item existingItem = null;
            if (itemDto.getItemId() != null) {
                existingItem = itemRepository.findById(itemDto.getItemId()).orElse(null);
            }

            InvoiceItem lineItem = InvoiceItem.builder()
                    .invoice(invoice)
                    .item(existingItem)
                    .itemName(itemDto.getItemName())
                    .hsnSacCode(itemDto.getHsnSacCode())
                    .quantity(itemDto.getQuantity())
                    .uom(itemDto.getUom() != null ? itemDto.getUom() : "PCS")
                    .unitPrice(itemDto.getUnitPrice())
                    .discountPercent(itemDto.getDiscountPercent())
                    .discountAmount(itemDto.getDiscountAmount())
                    .gstRate(itemDto.getGstRate())
                    .cessRate(itemDto.getCessRate())
                    .build();

            gstCalculationService.calculateLineItem(lineItem, company.getStateCode(), placeOfSupply);

            BigDecimal lineGross = itemDto.getUnitPrice().multiply(itemDto.getQuantity());
            subtotal = subtotal.add(lineGross);
            taxableTotal = taxableTotal.add(lineItem.getTaxableValue());
            cgstTotal = cgstTotal.add(lineItem.getCgstAmount());
            sgstTotal = sgstTotal.add(lineItem.getSgstAmount());
            igstTotal = igstTotal.add(lineItem.getIgstAmount());
            cessTotal = cessTotal.add(lineItem.getCessAmount());

            invoice.addItem(lineItem);

            if (existingItem != null && existingItem.getItemType() == ItemType.GOODS) {
                BigDecimal currentStock = existingItem.getCurrentStock() != null ? existingItem.getCurrentStock() : BigDecimal.ZERO;
                BigDecimal updatedStock = currentStock.subtract(itemDto.getQuantity());
                existingItem.setCurrentStock(updatedStock);
                itemRepository.save(existingItem);

                StockMovement movement = StockMovement.builder()
                        .company(company)
                        .item(existingItem)
                        .movementType(MovementType.OUTWARD_SALE)
                        .quantityChange(itemDto.getQuantity().negate())
                        .balanceAfter(updatedStock)
                        .referenceNumber(invoiceNumber)
                        .remarks("Sale Invoice #" + invoiceNumber)
                        .build();
                stockMovementRepository.save(movement);
            }
        }

        BigDecimal preRoundTotal = taxableTotal.add(cgstTotal).add(sgstTotal).add(igstTotal).add(cessTotal);
        BigDecimal roundOff = gstCalculationService.calculateRoundOff(preRoundTotal);
        BigDecimal grandTotal = preRoundTotal.add(roundOff);

        invoice.setSubtotal(subtotal);
        invoice.setDiscountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO);
        invoice.setTaxableAmount(taxableTotal);
        invoice.setCgstAmount(cgstTotal);
        invoice.setSgstAmount(sgstTotal);
        invoice.setIgstAmount(igstTotal);
        invoice.setCessAmount(cessTotal);
        invoice.setRoundOff(roundOff);
        invoice.setGrandTotal(grandTotal);

        BigDecimal paid = request.getAmountPaid() != null ? request.getAmountPaid() : BigDecimal.ZERO;
        invoice.setAmountPaid(paid);
        BigDecimal balance = grandTotal.subtract(paid).max(BigDecimal.ZERO);
        invoice.setBalanceAmount(balance);

        if (balance.compareTo(BigDecimal.ZERO) == 0) {
            invoice.setPaymentStatus(PaymentStatus.PAID);
        } else if (paid.compareTo(BigDecimal.ZERO) > 0) {
            invoice.setPaymentStatus(PaymentStatus.PARTIALLY_PAID);
        } else {
            invoice.setPaymentStatus(PaymentStatus.UNPAID);
        }

        String upiPayload = upiQrService.generateUpiPayload(
                company.getUpiId(),
                company.getTradeName() != null ? company.getTradeName() : company.getLegalName(),
                balance.compareTo(BigDecimal.ZERO) > 0 ? balance : grandTotal,
                invoiceNumber
        );
        invoice.setUpiQrPayload(upiPayload);

        if (party != null && balance.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal currentPartyBal = party.getCurrentBalance() != null ? party.getCurrentBalance() : BigDecimal.ZERO;
            party.setCurrentBalance(currentPartyBal.add(balance));
            partyRepository.save(party);
        }

        return invoiceRepository.save(invoice);
    }
}

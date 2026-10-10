package com.apex.gstsuite.service;

import com.apex.gstsuite.dto.DashboardMetricsDto;
import com.apex.gstsuite.model.entity.Invoice;
import com.apex.gstsuite.model.entity.InvoiceItem;
import com.apex.gstsuite.model.entity.PurchaseBill;
import com.apex.gstsuite.repository.InvoiceRepository;
import com.apex.gstsuite.repository.ItemRepository;
import com.apex.gstsuite.repository.PartyRepository;
import com.apex.gstsuite.repository.PurchaseBillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class GstReportService {

    private final InvoiceRepository invoiceRepository;
    private final PurchaseBillRepository purchaseBillRepository;
    private final ItemRepository itemRepository;
    private final PartyRepository partyRepository;

    public GstReportService(InvoiceRepository invoiceRepository,
                            PurchaseBillRepository purchaseBillRepository,
                            ItemRepository itemRepository,
                            PartyRepository partyRepository) {
        this.invoiceRepository = invoiceRepository;
        this.purchaseBillRepository = purchaseBillRepository;
        this.itemRepository = itemRepository;
        this.partyRepository = partyRepository;
    }

    @Transactional(readOnly = true)
    public DashboardMetricsDto getDashboardMetrics(UUID companyId) {
        List<Invoice> invoices = invoiceRepository.findByCompanyIdOrderByInvoiceDateDesc(companyId);
        List<PurchaseBill> purchaseBills = purchaseBillRepository.findByCompanyIdOrderByBillDateDesc(companyId);

        BigDecimal totalSales = BigDecimal.ZERO;
        BigDecimal todaySales = BigDecimal.ZERO;
        BigDecimal totalTaxCollected = BigDecimal.ZERO;
        BigDecimal cgstCollected = BigDecimal.ZERO;
        BigDecimal sgstCollected = BigDecimal.ZERO;
        BigDecimal igstCollected = BigDecimal.ZERO;
        BigDecimal totalReceivables = BigDecimal.ZERO;

        LocalDate today = LocalDate.now();

        for (Invoice inv : invoices) {
            totalSales = totalSales.add(inv.getGrandTotal());
            if (today.equals(inv.getInvoiceDate())) {
                todaySales = todaySales.add(inv.getGrandTotal());
            }
            cgstCollected = cgstCollected.add(inv.getCgstAmount());
            sgstCollected = sgstCollected.add(inv.getSgstAmount());
            igstCollected = igstCollected.add(inv.getIgstAmount());
            totalTaxCollected = totalTaxCollected.add(inv.getCgstAmount()).add(inv.getSgstAmount()).add(inv.getIgstAmount());
            totalReceivables = totalReceivables.add(inv.getBalanceAmount());
        }

        BigDecimal totalItcAvailable = BigDecimal.ZERO;
        BigDecimal totalPayables = BigDecimal.ZERO;
        for (PurchaseBill bill : purchaseBills) {
            if (Boolean.TRUE.equals(bill.getIsItcEligible())) {
                totalItcAvailable = totalItcAvailable.add(bill.getCgstAmount())
                        .add(bill.getSgstAmount())
                        .add(bill.getIgstAmount());
            }
            totalPayables = totalPayables.add(bill.getBalanceAmount());
        }

        BigDecimal netTaxPayable = totalTaxCollected.subtract(totalItcAvailable).max(BigDecimal.ZERO);
        long lowStockCount = itemRepository.findLowStockItems(companyId).size();

        return DashboardMetricsDto.builder()
                .totalSales(totalSales)
                .todaySales(todaySales)
                .totalTaxCollected(totalTaxCollected)
                .cgstCollected(cgstCollected)
                .sgstCollected(sgstCollected)
                .igstCollected(igstCollected)
                .totalItcAvailable(totalItcAvailable)
                .netTaxPayable(netTaxPayable)
                .totalReceivables(totalReceivables)
                .totalPayables(totalPayables)
                .totalInvoicesCount(invoices.size())
                .lowStockCount(lowStockCount)
                .build();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getHsnSummary(UUID companyId, LocalDate startDate, LocalDate endDate) {
        List<Invoice> invoices;
        if (startDate != null && endDate != null) {
            invoices = invoiceRepository.findByCompanyIdAndInvoiceDateBetweenOrderByInvoiceDateDesc(companyId, startDate, endDate);
        } else {
            invoices = invoiceRepository.findByCompanyIdOrderByInvoiceDateDesc(companyId);
        }

        Map<String, Map<String, Object>> hsnMap = new LinkedHashMap<>();

        for (Invoice invoice : invoices) {
            for (InvoiceItem item : invoice.getItems()) {
                String hsn = item.getHsnSacCode();
                Map<String, Object> entry = hsnMap.computeIfAbsent(hsn, k -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("hsnCode", k);
                    m.put("description", item.getItemName());
                    m.put("uom", item.getUom());
                    m.put("totalQuantity", BigDecimal.ZERO);
                    m.put("totalTaxableValue", BigDecimal.ZERO);
                    m.put("totalCgst", BigDecimal.ZERO);
                    m.put("totalSgst", BigDecimal.ZERO);
                    m.put("totalIgst", BigDecimal.ZERO);
                    m.put("totalTax", BigDecimal.ZERO);
                    return m;
                });

                entry.put("totalQuantity", ((BigDecimal) entry.get("totalQuantity")).add(item.getQuantity()));
                entry.put("totalTaxableValue", ((BigDecimal) entry.get("totalTaxableValue")).add(item.getTaxableValue()));
                entry.put("totalCgst", ((BigDecimal) entry.get("totalCgst")).add(item.getCgstAmount()));
                entry.put("totalSgst", ((BigDecimal) entry.get("totalSgst")).add(item.getSgstAmount()));
                entry.put("totalIgst", ((BigDecimal) entry.get("totalIgst")).add(item.getIgstAmount()));
                entry.put("totalTax", ((BigDecimal) entry.get("totalTax")).add(item.getCgstAmount()).add(item.getSgstAmount()).add(item.getIgstAmount()));
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("hsnSummary", new ArrayList<>(hsnMap.values()));
        result.put("recordCount", hsnMap.size());
        return result;
    }
}

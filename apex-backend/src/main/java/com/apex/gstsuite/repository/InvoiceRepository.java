package com.apex.gstsuite.repository;

import com.apex.gstsuite.model.entity.Invoice;
import com.apex.gstsuite.model.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    List<Invoice> findByCompanyIdOrderByInvoiceDateDesc(UUID companyId);

    Optional<Invoice> findByCompanyIdAndInvoiceNumber(UUID companyId, String invoiceNumber);

    List<Invoice> findByCompanyIdAndInvoiceDateBetweenOrderByInvoiceDateDesc(
            UUID companyId, LocalDate startDate, LocalDate endDate);

    List<Invoice> findByCompanyIdAndPaymentStatus(UUID companyId, PaymentStatus paymentStatus);

    @Query("SELECT i FROM Invoice i WHERE i.company.id = :companyId AND i.invoiceDate >= :startDate ORDER BY i.invoiceDate DESC")
    List<Invoice> findRecentInvoices(@Param("companyId") UUID companyId, @Param("startDate") LocalDate startDate);
}

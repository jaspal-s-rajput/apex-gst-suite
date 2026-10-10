package com.apex.gstsuite.repository;

import com.apex.gstsuite.model.entity.PurchaseBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface PurchaseBillRepository extends JpaRepository<PurchaseBill, UUID> {
    List<PurchaseBill> findByCompanyIdOrderByBillDateDesc(UUID companyId);
    List<PurchaseBill> findByCompanyIdAndBillDateBetweenOrderByBillDateDesc(
            UUID companyId, LocalDate startDate, LocalDate endDate);
}

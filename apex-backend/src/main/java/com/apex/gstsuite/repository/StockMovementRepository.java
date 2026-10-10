package com.apex.gstsuite.repository;

import com.apex.gstsuite.model.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
    List<StockMovement> findByCompanyIdAndItemIdOrderByCreatedAtDesc(UUID companyId, UUID itemId);
    List<StockMovement> findByCompanyIdOrderByCreatedAtDesc(UUID companyId);
}

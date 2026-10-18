package com.apex.gstsuite.repository;

import com.apex.gstsuite.model.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ItemRepository extends JpaRepository<Item, UUID> {
    List<Item> findByCompanyIdAndIsActiveTrue(UUID companyId);

    List<Item> findByCompanyId(UUID companyId);

    long countByCompanyIdAndIsActiveTrue(UUID companyId);

    Optional<Item> findByCompanyIdAndBarcodeAndIsActiveTrue(UUID companyId, String barcode);

    Optional<Item> findByCompanyIdAndSkuAndIsActiveTrue(UUID companyId, String sku);

    List<Item> findByCompanyIdAndNameContainingIgnoreCaseAndIsActiveTrue(UUID companyId, String name);

    @Query("SELECT i FROM Item i WHERE i.company.id = :companyId AND i.isActive = true AND i.currentStock <= i.minStockAlert")
    List<Item> findLowStockItems(@Param("companyId") UUID companyId);
}

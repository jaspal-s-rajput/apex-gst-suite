package com.apex.gstsuite.service;

import com.apex.gstsuite.model.entity.*;
import com.apex.gstsuite.repository.ItemRepository;
import com.apex.gstsuite.repository.StockMovementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final StockMovementRepository stockMovementRepository;
    private final CompanyService companyService;

    public ItemService(ItemRepository itemRepository,
                       StockMovementRepository stockMovementRepository,
                       CompanyService companyService) {
        this.itemRepository = itemRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.companyService = companyService;
    }

    @Transactional(readOnly = true)
    public List<Item> getItems(UUID companyId, String search) {
        if (search != null && !search.isBlank()) {
            return itemRepository.findByCompanyIdAndNameContainingIgnoreCaseAndIsActiveTrue(companyId, search.trim());
        }
        return itemRepository.findByCompanyIdAndIsActiveTrue(companyId);
    }

    @Transactional(readOnly = true)
    public Optional<Item> findByBarcode(UUID companyId, String barcode) {
        return itemRepository.findByCompanyIdAndBarcodeAndIsActiveTrue(companyId, barcode.trim());
    }

    @Transactional(readOnly = true)
    public List<Item> getLowStockItems(UUID companyId) {
        return itemRepository.findLowStockItems(companyId);
    }

    @Transactional(readOnly = true)
    public Optional<Item> getItem(UUID id) {
        return itemRepository.findById(id);
    }

    @Transactional
    public Item saveItem(UUID companyId, Item item) {
        Company company = companyService.getCompany(companyId)
                .orElseGet(companyService::getOrCreateDefaultCompany);
        item.setCompany(company);

        boolean isNew = item.getId() == null;

        Item saved = itemRepository.save(item);

        if (isNew && saved.getCurrentStock() != null && saved.getCurrentStock().compareTo(BigDecimal.ZERO) > 0) {
            StockMovement movement = StockMovement.builder()
                    .company(company)
                    .item(saved)
                    .movementType(MovementType.ADJUSTMENT_CORRECTION)
                    .quantityChange(saved.getCurrentStock())
                    .balanceAfter(saved.getCurrentStock())
                    .remarks("Opening Stock")
                    .build();
            stockMovementRepository.save(movement);
        }

        return saved;
    }

    @Transactional
    public Item adjustStock(UUID itemId, BigDecimal quantityChange, MovementType movementType, String remarks) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found with ID: " + itemId));

        BigDecimal currentStock = item.getCurrentStock() != null ? item.getCurrentStock() : BigDecimal.ZERO;
        BigDecimal newStock = currentStock.add(quantityChange);
        item.setCurrentStock(newStock);

        StockMovement movement = StockMovement.builder()
                .company(item.getCompany())
                .item(item)
                .movementType(movementType)
                .quantityChange(quantityChange)
                .balanceAfter(newStock)
                .remarks(remarks)
                .build();
        stockMovementRepository.save(movement);

        return itemRepository.save(item);
    }

    @Transactional
    public Item updateItem(UUID itemId, Item updatedData) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found with ID: " + itemId));

        item.setName(updatedData.getName());
        item.setSku(updatedData.getSku());
        item.setBarcode(updatedData.getBarcode());
        item.setCategory(updatedData.getCategory());
        if (updatedData.getItemType() != null) {
            item.setItemType(updatedData.getItemType());
        }
        item.setHsnSacCode(updatedData.getHsnSacCode());
        item.setUom(updatedData.getUom() != null ? updatedData.getUom() : "PCS");
        item.setPurchasePrice(updatedData.getPurchasePrice() != null ? updatedData.getPurchasePrice() : BigDecimal.ZERO);
        item.setSellingPrice(updatedData.getSellingPrice() != null ? updatedData.getSellingPrice() : BigDecimal.ZERO);
        item.setGstRate(updatedData.getGstRate() != null ? updatedData.getGstRate() : BigDecimal.valueOf(18.0));
        item.setCessRate(updatedData.getCessRate() != null ? updatedData.getCessRate() : BigDecimal.ZERO);
        item.setMinStockAlert(updatedData.getMinStockAlert() != null ? updatedData.getMinStockAlert() : BigDecimal.valueOf(5.0));
        item.setBatchTrackingEnabled(Boolean.TRUE.equals(updatedData.getBatchTrackingEnabled()));
        item.setBatchNumber(updatedData.getBatchNumber());
        item.setExpiryDate(updatedData.getExpiryDate());

        return itemRepository.save(item);
    }

    @Transactional(readOnly = true)
    public List<com.apex.gstsuite.dto.StockMovementResponseDto> getItemMovements(UUID companyId, UUID itemId) {
        return stockMovementRepository.findByCompanyIdAndItemIdOrderByCreatedAtDesc(companyId, itemId)
                .stream()
                .map(this::mapToMovementDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<com.apex.gstsuite.dto.StockMovementResponseDto> getAllMovements(UUID companyId) {
        return stockMovementRepository.findByCompanyIdOrderByCreatedAtDesc(companyId)
                .stream()
                .map(this::mapToMovementDto)
                .toList();
    }

    private com.apex.gstsuite.dto.StockMovementResponseDto mapToMovementDto(StockMovement sm) {
        return com.apex.gstsuite.dto.StockMovementResponseDto.builder()
                .id(sm.getId())
                .itemId(sm.getItem() != null ? sm.getItem().getId() : null)
                .itemName(sm.getItem() != null ? sm.getItem().getName() : "Unknown Item")
                .movementType(sm.getMovementType())
                .quantityChange(sm.getQuantityChange())
                .balanceAfter(sm.getBalanceAfter())
                .referenceNumber(sm.getReferenceNumber())
                .remarks(sm.getRemarks())
                .createdAt(sm.getCreatedAt())
                .build();
    }

    @Transactional
    public void deleteItem(UUID id) {
        itemRepository.findById(id).ifPresent(item -> {
            item.setIsActive(false);
            itemRepository.save(item);
        });
    }
}

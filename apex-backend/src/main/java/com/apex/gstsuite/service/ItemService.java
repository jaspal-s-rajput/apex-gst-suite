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
    public void deleteItem(UUID id) {
        itemRepository.findById(id).ifPresent(item -> {
            item.setIsActive(false);
            itemRepository.save(item);
        });
    }
}

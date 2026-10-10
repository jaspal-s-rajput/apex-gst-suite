package com.apex.gstsuite.controller;

import com.apex.gstsuite.model.entity.Item;
import com.apex.gstsuite.model.entity.MovementType;
import com.apex.gstsuite.service.CompanyService;
import com.apex.gstsuite.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/items")
public class ItemController {

    private final ItemService itemService;
    private final CompanyService companyService;

    public ItemController(ItemService itemService, CompanyService companyService) {
        this.itemService = itemService;
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<List<Item>> getItems(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(required = false) String search) {
        UUID effectiveCompanyId = companyId != null ? companyId : companyService.getOrCreateDefaultCompany().getId();
        return ResponseEntity.ok(itemService.getItems(effectiveCompanyId, search));
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<Item> getItemByBarcode(
            @PathVariable String barcode,
            @RequestParam(required = false) UUID companyId) {
        UUID effectiveCompanyId = companyId != null ? companyId : companyService.getOrCreateDefaultCompany().getId();
        return itemService.findByBarcode(effectiveCompanyId, barcode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Item>> getLowStockItems(@RequestParam(required = false) UUID companyId) {
        UUID effectiveCompanyId = companyId != null ? companyId : companyService.getOrCreateDefaultCompany().getId();
        return ResponseEntity.ok(itemService.getLowStockItems(effectiveCompanyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable UUID id) {
        return itemService.getItem(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Item> createItem(
            @RequestParam(required = false) UUID companyId,
            @Valid @RequestBody Item item) {
        UUID effectiveCompanyId = companyId != null ? companyId : companyService.getOrCreateDefaultCompany().getId();
        return ResponseEntity.ok(itemService.saveItem(effectiveCompanyId, item));
    }

    @PostMapping("/{id}/adjust-stock")
    public ResponseEntity<Item> adjustStock(
            @PathVariable UUID id,
            @RequestBody StockAdjustRequest request) {
        return ResponseEntity.ok(itemService.adjustStock(
                id,
                request.getQuantityChange(),
                request.getMovementType() != null ? request.getMovementType() : MovementType.ADJUSTMENT_CORRECTION,
                request.getRemarks()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable UUID id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    public static class StockAdjustRequest {
        private BigDecimal quantityChange;
        private MovementType movementType;
        private String remarks;

        public StockAdjustRequest() {}

        public BigDecimal getQuantityChange() { return quantityChange; }
        public void setQuantityChange(BigDecimal quantityChange) { this.quantityChange = quantityChange; }

        public MovementType getMovementType() { return movementType; }
        public void setMovementType(MovementType movementType) { this.movementType = movementType; }

        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }
}

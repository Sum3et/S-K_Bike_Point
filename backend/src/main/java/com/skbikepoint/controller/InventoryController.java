package com.skbikepoint.controller;

import com.skbikepoint.dto.ApiResponse;
import com.skbikepoint.dto.inventory.InventoryItemDto;
import com.skbikepoint.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<InventoryItemDto>>> getAllItems() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAllItems(), "Inventory items retrieved"));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<InventoryItemDto>>> getLowStockItems() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getLowStockItems(), "Low stock items retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InventoryItemDto>> addItem(@Valid @RequestBody InventoryItemDto dto) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.createItem(dto), "Inventory item added successfully"));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InventoryItemDto>> updateStock(@PathVariable Long id, @RequestParam int change) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.updateStock(id, change), "Stock quantity updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.ok(ApiResponse.success("Item deleted successfully", "Inventory item deleted"));
    }
}

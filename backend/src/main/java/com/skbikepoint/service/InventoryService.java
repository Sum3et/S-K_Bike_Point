package com.skbikepoint.service;

import com.skbikepoint.dto.inventory.InventoryItemDto;
import com.skbikepoint.entity.InventoryItem;
import com.skbikepoint.exception.BadRequestException;
import com.skbikepoint.exception.ResourceNotFoundException;
import com.skbikepoint.repository.InventoryItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryItemRepository inventoryRepository;

    public InventoryService(InventoryItemRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional(readOnly = true)
    public List<InventoryItemDto> getAllItems() {
        return inventoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryItemDto> getLowStockItems() {
        return inventoryRepository.findLowStockItems().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public InventoryItemDto createItem(InventoryItemDto dto) {
        String cleanCode = dto.getPartNumber().trim().toUpperCase();
        if (inventoryRepository.existsByPartNumberIgnoreCase(cleanCode)) {
            throw new BadRequestException("Part number '" + cleanCode + "' already exists");
        }

        InventoryItem item = InventoryItem.builder()
                .partNumber(cleanCode)
                .name(dto.getName())
                .category(dto.getCategory())
                .stockQuantity(dto.getStockQuantity())
                .minThreshold(dto.getMinThreshold())
                .unitPrice(dto.getUnitPrice())
                .locationBin(dto.getLocationBin())
                .build();

        return mapToDto(inventoryRepository.save(item));
    }

    @Transactional
    public InventoryItemDto updateStock(Long id, int quantityChange) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", id));

        int newQty = Math.max(0, item.getStockQuantity() + quantityChange);
        item.setStockQuantity(newQty);
        return mapToDto(inventoryRepository.save(item));
    }

    @Transactional
    public void deleteItem(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("InventoryItem", "id", id);
        }
        inventoryRepository.deleteById(id);
    }

    public InventoryItemDto mapToDto(InventoryItem item) {
        return InventoryItemDto.builder()
                .id(item.getId())
                .partNumber(item.getPartNumber())
                .name(item.getName())
                .category(item.getCategory())
                .stockQuantity(item.getStockQuantity())
                .minThreshold(item.getMinThreshold())
                .unitPrice(item.getUnitPrice())
                .locationBin(item.getLocationBin())
                .isLowStock(item.getStockQuantity() <= item.getMinThreshold())
                .build();
    }
}

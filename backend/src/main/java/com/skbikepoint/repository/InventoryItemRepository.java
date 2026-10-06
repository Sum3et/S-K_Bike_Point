package com.skbikepoint.repository;

import com.skbikepoint.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    Optional<InventoryItem> findByPartNumberIgnoreCase(String partNumber);
    boolean existsByPartNumberIgnoreCase(String partNumber);
    List<InventoryItem> findByCategoryOrderByStockQuantityAsc(String category);

    @Query("SELECT i FROM InventoryItem i WHERE i.stockQuantity <= i.minThreshold ORDER BY i.stockQuantity ASC")
    List<InventoryItem> findLowStockItems();

    @Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.stockQuantity <= i.minThreshold")
    long countLowStockItems();
}

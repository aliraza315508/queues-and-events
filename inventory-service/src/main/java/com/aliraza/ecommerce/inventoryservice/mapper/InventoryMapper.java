package com.aliraza.ecommerce.inventoryservice.mapper;

import com.aliraza.ecommerce.inventoryservice.dto.InventoryResponse;
import com.aliraza.ecommerce.inventoryservice.model.Inventory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InventoryMapper {

    public InventoryResponse toResponse(Inventory inventory) {
        return new InventoryResponse(
                inventory.getId(),
                inventory.getProductId(),
                inventory.getAvailableQuantity(),
                inventory.getReservedQuantity(),
                inventory.getCreatedAt(),
                inventory.getUpdatedAt()
        );
    }

    public List<InventoryResponse> toResponseList(List<Inventory> inventoryList) {
        return inventoryList.stream()
                .map(this::toResponse)
                .toList();
    }
}

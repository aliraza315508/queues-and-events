package com.aliraza.ecommerce.inventoryservice.mapper;

import com.aliraza.ecommerce.inventoryservice.dto.CreateInventoryRequest;
import com.aliraza.ecommerce.inventoryservice.dto.InventoryResponse;
import com.aliraza.ecommerce.inventoryservice.model.Inventory;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public Inventory toEntity(CreateInventoryRequest request) {
        return new Inventory(
                request.productId(),
                request.availableQuantity()
        );
    }

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
}
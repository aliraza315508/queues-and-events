package com.aliraza.ecommerce.inventoryservice.dto;

import java.time.Instant;
import java.util.UUID;

public record InventoryResponse(

        UUID id,

        String productId,

        Integer availableQuantity,

        Integer reservedQuantity,

        Instant createdAt,

        Instant updatedAt

) {
}

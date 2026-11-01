package com.aliraza.ecommerce.inventoryservice.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record InventoryReservedEvent(
        UUID eventId,
        UUID orderId,
        String customerId,
        String productId,
        Integer quantity,
        Instant occurredAt ,
        BigDecimal totalAmount
) {
}

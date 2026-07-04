package com.aliraza.ecommerce.orderservice.event;

import java.time.Instant;
import java.util.UUID;

public record InventoryRejectedEvent(
        UUID eventId,
        UUID orderId,
        String customerId,
        String productId,
        Integer quantity,
        String reason,
        Instant occurredAt
) {
}

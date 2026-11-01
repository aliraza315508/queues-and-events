package com.aliraza.ecommerce.orderservice.event;

import java.time.Instant;
import java.util.UUID;

public record OrderCancelledEvent(
        UUID eventId,
        UUID orderId,
        String customerId,
        String reason,
        Instant occurredAt
) {
}

package com.aliraza.ecommerce.notificationservice.event;

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

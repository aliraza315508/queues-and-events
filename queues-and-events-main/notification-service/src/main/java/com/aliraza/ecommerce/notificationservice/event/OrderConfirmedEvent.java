package com.aliraza.ecommerce.notificationservice.event;

import java.time.Instant;
import java.util.UUID;

public record OrderConfirmedEvent(
        UUID eventId,
        UUID orderId,
        String customerId,
        Instant occurredAt
) {
}

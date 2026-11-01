package com.aliraza.ecommerce.orderservice.event;

import java.time.Instant;
import java.util.UUID;

public record OrderConfirmedEvent(
        UUID eventId,
        UUID orderId,
        String customerId,
        Instant occurredAt
) {
}

package com.aliraza.ecommerce.orderservice.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderCreatedEvent(
        UUID eventId,
        UUID orderId,
        String customerId,
        String productId,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal totalAmount,
        Instant occurredAt
) {
}

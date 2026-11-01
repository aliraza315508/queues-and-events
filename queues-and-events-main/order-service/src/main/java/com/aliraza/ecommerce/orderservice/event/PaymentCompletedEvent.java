package com.aliraza.ecommerce.orderservice.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentCompletedEvent(
        UUID eventId,
        UUID orderId,
        String customerId,
        UUID paymentId,
        BigDecimal amount,
        String paymentMethod,
        Instant occurredAt
) {
}
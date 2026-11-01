package com.aliraza.ecommerce.paymentservice.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentFailedEvent(
        UUID eventId,
        UUID orderId,
        String customerId,
        BigDecimal amount,
        String paymentMethod,
        String reason,
        Instant occurredAt
) {
}

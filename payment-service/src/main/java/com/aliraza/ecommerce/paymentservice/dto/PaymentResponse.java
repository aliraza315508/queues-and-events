package com.aliraza.ecommerce.paymentservice.dto;

import com.aliraza.ecommerce.paymentservice.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        String orderId,
        String customerId,
        BigDecimal amount,
        String paymentMethod,
        PaymentStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}

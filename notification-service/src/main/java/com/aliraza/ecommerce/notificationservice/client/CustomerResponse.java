package com.aliraza.ecommerce.notificationservice.client;

import java.time.Instant;
import java.util.UUID;

public record CustomerResponse(
        UUID id,
        String fullName,
        String email,
        String phone,
        Instant createdAt,
        Instant updatedAt
) {
}
package com.aliraza.ecommerce.customerservice.dto;

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
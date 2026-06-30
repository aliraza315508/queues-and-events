package com.aliraza.ecommerce.productservice.dto;


import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String sku,
        String name,
        String description,
        BigDecimal price,
        Boolean active,
        Instant createdAt,
        Instant updatedAt
) {
}
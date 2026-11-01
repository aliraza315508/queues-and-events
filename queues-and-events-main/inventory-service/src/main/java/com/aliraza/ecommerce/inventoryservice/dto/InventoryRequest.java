package com.aliraza.ecommerce.inventoryservice.dto;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InventoryRequest(

        @NotBlank(message = "productId is required")
        String productId,

        @NotNull(message = "availableQuantity is required")
        @Min(value = 0, message = "availableQuantity cannot be negative")
        Integer availableQuantity

) {
}

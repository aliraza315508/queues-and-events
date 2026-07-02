package com.aliraza.ecommerce.paymentservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PaymentRequest(

        @NotBlank(message = "orderId is required")
        String orderId,

        @NotBlank(message = "customerId is required")
        String customerId,

        @NotNull(message = "amount is required")
        @DecimalMin(value = "0.01", message = "amount must be greater than 0")
        @Digits(integer = 17, fraction = 2, message = "amount must have max 2 decimal places")
        BigDecimal amount,

        @NotBlank(message = "paymentMethod is required")
        String paymentMethod
) {
}

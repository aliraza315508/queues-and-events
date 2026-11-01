package com.aliraza.ecommerce.notificationservice.dto;


import com.aliraza.ecommerce.notificationservice.model.NotificationType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NotificationRequest(

        @NotBlank(message = "Order id is required")
        @Size(max = 100, message = "Order id must be 100 characters or less")
        String orderId,

        @NotBlank(message = "Customer id is required")
        @Size(max = 100, message = "Customer id must be 100 characters or less")
        String customerId,

        @NotBlank(message = "Recipient email is required")
        @Email(message = "Recipient email must be valid")
        @Size(max = 150, message = "Recipient email must be 150 characters or less")
        String recipientEmail,

        @NotNull(message = "Notification type is required")
        NotificationType notificationType,

        @Size(max = 30, message = "Recipient phone must be 30 characters or less")
        String recipientPhone,

        @NotBlank(message = "Subject is required")
        @Size(max = 200, message = "Subject must be 200 characters or less")
        String subject,

        @NotBlank(message = "Message is required")
        @Size(max = 1000, message = "Message must be 1000 characters or less")
        String message
) {
}

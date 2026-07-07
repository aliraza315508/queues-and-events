package com.aliraza.ecommerce.notificationservice.message;


import java.util.UUID;

public record NotificationMessage(
        UUID notificationId,
        UUID orderId,
        String customerId,
        String recipientEmail,
        String notificationType,
        String subject,
        String message
) {
}

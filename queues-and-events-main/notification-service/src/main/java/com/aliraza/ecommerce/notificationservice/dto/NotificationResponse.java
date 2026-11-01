package com.aliraza.ecommerce.notificationservice.dto;


import com.aliraza.ecommerce.notificationservice.model.NotificationStatus;
import com.aliraza.ecommerce.notificationservice.model.NotificationType;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(

        UUID id,

        String orderId,

        String customerId,

        String recipientEmail,

        String recipientPhone,

        NotificationType notificationType,

        String subject,

        String message,

        NotificationStatus status,

        Instant createdAt,

        Instant updatedAt
) {
}
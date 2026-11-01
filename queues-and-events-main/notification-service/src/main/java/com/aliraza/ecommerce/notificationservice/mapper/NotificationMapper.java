package com.aliraza.ecommerce.notificationservice.mapper;


import com.aliraza.ecommerce.notificationservice.dto.NotificationRequest;
import com.aliraza.ecommerce.notificationservice.dto.NotificationResponse;
import com.aliraza.ecommerce.notificationservice.model.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public Notification toEntity(NotificationRequest request) {
        return new Notification(
                request.orderId(),
                request.customerId(),
                request.recipientEmail(),
                request.recipientPhone(),
                request.notificationType(),
                request.subject(),
                request.message()
        );
    }

    public NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getOrderId(),
                notification.getCustomerId(),
                notification.getRecipientEmail(),
                notification.getRecipientPhone(),
                notification.getNotificationType(),
                notification.getSubject(),
                notification.getMessage(),
                notification.getStatus(),
                notification.getCreatedAt(),
                notification.getUpdatedAt()
        );
    }
}

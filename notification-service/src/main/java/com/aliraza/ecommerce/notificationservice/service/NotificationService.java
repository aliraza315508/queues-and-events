package com.aliraza.ecommerce.notificationservice.service;

import com.aliraza.ecommerce.notificationservice.dto.NotificationRequest;
import com.aliraza.ecommerce.notificationservice.dto.NotificationResponse;
import com.aliraza.ecommerce.notificationservice.model.NotificationStatus;
import com.aliraza.ecommerce.notificationservice.model.NotificationType;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    NotificationResponse createNotification(NotificationRequest request);

    NotificationResponse getNotificationById(UUID id);

    List<NotificationResponse> getAllNotifications();

    List<NotificationResponse> getNotificationsByOrderId(String orderId);

    List<NotificationResponse> getNotificationsByCustomerId(String customerId);

    List<NotificationResponse> getNotificationsByStatus(NotificationStatus status);

    List<NotificationResponse> getNotificationsByType(NotificationType notificationType);

    NotificationResponse queueNotification(UUID id);

    NotificationResponse markNotificationAsSent(UUID id);

    NotificationResponse markNotificationAsFailed(UUID id);
}
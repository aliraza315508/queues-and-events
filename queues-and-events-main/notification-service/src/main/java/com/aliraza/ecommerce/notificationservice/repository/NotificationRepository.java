package com.aliraza.ecommerce.notificationservice.repository;

import com.aliraza.ecommerce.notificationservice.model.Notification;
import com.aliraza.ecommerce.notificationservice.model.NotificationStatus;
import com.aliraza.ecommerce.notificationservice.model.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByOrderId(String orderId);

    List<Notification> findByCustomerId(String customerId);

    List<Notification> findByStatus(NotificationStatus status);

    List<Notification> findByNotificationType(NotificationType notificationType);
}

package com.aliraza.ecommerce.notificationservice.service.impl;

import com.aliraza.ecommerce.notificationservice.dto.NotificationRequest;
import com.aliraza.ecommerce.notificationservice.dto.NotificationResponse;
import com.aliraza.ecommerce.notificationservice.event.OrderCancelledEvent;
import com.aliraza.ecommerce.notificationservice.event.OrderConfirmedEvent;
import com.aliraza.ecommerce.notificationservice.mapper.NotificationMapper;
import com.aliraza.ecommerce.notificationservice.model.Notification;
import com.aliraza.ecommerce.notificationservice.model.NotificationStatus;
import com.aliraza.ecommerce.notificationservice.model.NotificationType;
import com.aliraza.ecommerce.notificationservice.repository.NotificationRepository;
import com.aliraza.ecommerce.notificationservice.service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationServiceImplementation implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    public NotificationServiceImplementation(
            NotificationRepository notificationRepository,
            NotificationMapper notificationMapper
    ) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
    }

    @Override
    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {
        Notification notification = notificationMapper.toEntity(request);

        Notification savedNotification = notificationRepository.save(notification);

        return notificationMapper.toResponse(savedNotification);
    }

    @Override
    @Transactional
    public NotificationResponse createOrderConfirmedNotification(OrderConfirmedEvent event) {
        Notification notification = new Notification(
                event.orderId().toString(),
                event.customerId(),
                resolveRecipientEmail(event.customerId()),
                NotificationType.ORDER_CONFIRMED,
                "Order Confirmed",
                "Your order " + event.orderId() + " has been confirmed."
        );

        Notification savedNotification = notificationRepository.save(notification);

        return notificationMapper.toResponse(savedNotification);
    }

    @Override
    @Transactional
    public NotificationResponse createOrderCancelledNotification(OrderCancelledEvent event) {
        Notification notification = new Notification(
                event.orderId().toString(),
                event.customerId(),
                resolveRecipientEmail(event.customerId()),
                NotificationType.ORDER_CANCELLED,
                "Order Cancelled",
                "Your order " + event.orderId() + " has been cancelled. Reason: " + event.reason()
        );

        Notification savedNotification = notificationRepository.save(notification);

        return notificationMapper.toResponse(savedNotification);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationById(UUID id) {
        Notification notification = getNotificationEntityById(id);

        return notificationMapper.toResponse(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByOrderId(String orderId) {
        return notificationRepository.findByOrderId(orderId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByCustomerId(String customerId) {
        return notificationRepository.findByCustomerId(customerId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByStatus(NotificationStatus status) {
        return notificationRepository.findByStatus(status)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByType(NotificationType notificationType) {
        return notificationRepository.findByNotificationType(notificationType)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public NotificationResponse queueNotification(UUID id) {
        Notification notification = getNotificationEntityById(id);

        notification.markQueued();

        Notification savedNotification = notificationRepository.save(notification);

        return notificationMapper.toResponse(savedNotification);
    }

    @Override
    @Transactional
    public NotificationResponse markNotificationAsSent(UUID id) {
        Notification notification = getNotificationEntityById(id);

        notification.markSent();

        Notification savedNotification = notificationRepository.save(notification);

        return notificationMapper.toResponse(savedNotification);
    }

    @Override
    @Transactional
    public NotificationResponse markNotificationAsFailed(UUID id) {
        Notification notification = getNotificationEntityById(id);

        notification.markFailed();

        Notification savedNotification = notificationRepository.save(notification);

        return notificationMapper.toResponse(savedNotification);
    }

    private Notification getNotificationEntityById(UUID id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found with id: " + id));
    }

    private String resolveRecipientEmail(String customerId) {
        return customerId + "@customer.local";
    }
}
package com.aliraza.ecommerce.notificationservice.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @Column(name = "id", nullable = false, updatable = false, columnDefinition = "uuid")
    private UUID id;

    @Column(name = "order_id", nullable = false, length = 100)
    private String orderId;

    @Column(name = "customer_id", nullable = false, length = 100)
    private String customerId;

    @Column(name = "recipient_email", nullable = false, length = 150)
    private String recipientEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false, length = 50)
    private NotificationType notificationType;

    @Column(name = "subject", nullable = false, length = 200)
    private String subject;

    @Column(name = "message", nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private NotificationStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Notification() {
    }

    public Notification(
            String orderId,
            String customerId,
            String recipientEmail,
            String recipientPhone,
            NotificationType notificationType,
            String subject,
            String message
    ) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.recipientEmail = recipientEmail;
        this.recipientPhone = recipientPhone;
        this.notificationType = notificationType;
        this.subject = subject;
        this.message = message;
        this.status = NotificationStatus.PENDING;
    }

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();

        if (id == null) {
            id = UUID.randomUUID();
        }

        if (status == null) {
            status = NotificationStatus.PENDING;
        }

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public void markQueued() {
        if (status != NotificationStatus.PENDING) {
            throw new IllegalStateException("Only pending notifications can be queued");
        }

        status = NotificationStatus.QUEUED;
    }

    public void markSent() {
        if (status != NotificationStatus.QUEUED) {
            throw new IllegalStateException("Only queued notifications can be sent");
        }

        status = NotificationStatus.SENT;
    }

    public void markFailed() {
        if (status != NotificationStatus.QUEUED) {
            throw new IllegalStateException("Only queued notifications can be failed");
        }

        status = NotificationStatus.FAILED;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }



    public UUID getId() {
        return id;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public  NotificationType getNotificationType() {
        return notificationType;
    }

    public String getSubject() {
        return subject;
    }

    public String getMessage() {
        return message;
    }

    public NotificationStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}

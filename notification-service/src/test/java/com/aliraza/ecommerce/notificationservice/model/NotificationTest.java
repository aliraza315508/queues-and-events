package com.aliraza.ecommerce.notificationservice.model;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThat;

public class NotificationTest {

    @Test
    void newNotificationStartsAsPending(){
        Notification notification = new Notification(
                "order-123",
                "customer-123",
                "customer@example.com",
                "+15555550123",
                NotificationType.ORDER_CONFIRMED,
                "Order Confirmed",
                "Your order has been confirmed."

        );

        assertThat(notification.getStatus())
                .isEqualTo(NotificationStatus.PENDING) ;

    }



    @Test
    void pendingNotificationCanBeQueued() {

        Notification notification = new Notification(
                "order-123",
                "customer-123",
                "customer@example.com",
                "+15555550123",
                NotificationType.ORDER_CONFIRMED,
                "Order Confirmed",
                "Your order has been confirmed."
        );

        notification.markQueued();

        assertThat(notification.getStatus())
                .isEqualTo(NotificationStatus.QUEUED);
    }

    @Test
    void queuedNotificationCanBeMarkedSent() {

        Notification notification = new Notification(
                "order-123",
                "customer-123",
                "customer@example.com",
                "+15555550123",
                NotificationType.ORDER_CONFIRMED,
                "Order Confirmed",
                "Your order has been confirmed."
        );

        notification.markQueued();
        notification.markSent();

        assertThat(notification.getStatus())
                .isEqualTo(NotificationStatus.SENT);
    }


    @Test
    void queuedNotificationCanBeMarkedFailed() {

        Notification notification = new Notification(
                "order-123",
                "customer-123",
                "customer@example.com",
                "+15555550123",
                NotificationType.ORDER_CONFIRMED,
                "Order Confirmed",
                "Your order has been confirmed."
        );

        notification.markQueued();
        notification.markFailed();

        assertThat(notification.getStatus())
                .isEqualTo(NotificationStatus.FAILED);
    }

    @Test
    void pendingNotificationCannotBeMarkedSent() {

        Notification notification = new Notification(
                "order-123",
                "customer-123",
                "customer@example.com",
                "+15555550123",
                NotificationType.ORDER_CONFIRMED,
                "Order Confirmed",
                "Your order has been confirmed."
        );

        assertThatThrownBy(notification::markSent)
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Only queued notifications can be sent");

        assertThat(notification.getStatus())
                .isEqualTo(NotificationStatus.PENDING);
    }

    @Test
    void pendingNotificationCannotBeMarkedFailed() {

        Notification notification = new Notification(
                "order-123",
                "customer-123",
                "customer@example.com",
                "+15555550123",
                NotificationType.ORDER_CONFIRMED,
                "Order Confirmed",
                "Your order has been confirmed."
        );

        assertThatThrownBy(notification::markFailed)
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Only queued notifications can be failed");

        assertThat(notification.getStatus())
                .isEqualTo(NotificationStatus.PENDING);
    }

}



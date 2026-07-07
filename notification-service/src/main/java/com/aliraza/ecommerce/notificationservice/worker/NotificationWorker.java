package com.aliraza.ecommerce.notificationservice.worker;

import com.aliraza.ecommerce.notificationservice.message.NotificationMessage;
import com.aliraza.ecommerce.notificationservice.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationWorker {

    private static final Logger log = LoggerFactory.getLogger(NotificationWorker.class);

    private final NotificationService notificationService;

    public NotificationWorker(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = "${app.rabbitmq.notification.queue}")
    public void processNotification(NotificationMessage notificationMessage) {
        log.info(
                "Received notification message from RabbitMQ. notificationId={}, orderId={}, customerId={}",
                notificationMessage.notificationId(),
                notificationMessage.orderId(),
                notificationMessage.customerId()
        );

        try {
            sendNotification(notificationMessage);

            notificationService.markNotificationAsSent(notificationMessage.notificationId());

            log.info(
                    "Notification sent successfully. notificationId={}",
                    notificationMessage.notificationId()
            );
        } catch (Exception exception) {
            log.error(
                    "Failed to send notification. notificationId={}",
                    notificationMessage.notificationId(),
                    exception
            );

            notificationService.markNotificationAsFailed(notificationMessage.notificationId());
        }
    }

    private void sendNotification(NotificationMessage notificationMessage) {
        log.info(
                "Sending {} notification to {}. Subject: {}. Message: {}",
                notificationMessage.notificationType(),
                notificationMessage.recipientEmail(),
                notificationMessage.subject(),
                notificationMessage.message()
        );

        // Later, this is where real email/SMS/push notification logic can be added.
        // For now, logging means the notification was "sent" successfully.
    }
}

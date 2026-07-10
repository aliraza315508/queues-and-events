package com.aliraza.ecommerce.notificationservice.worker;

import com.aliraza.ecommerce.notificationservice.message.NotificationMessage;
import com.aliraza.ecommerce.notificationservice.sender.EmailNotificationSender;
import com.aliraza.ecommerce.notificationservice.sender.SmsNotificationSender;
import com.aliraza.ecommerce.notificationservice.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationWorker {

    private static final Logger log = LoggerFactory.getLogger(NotificationWorker.class);

    private final NotificationService notificationService;
    private final EmailNotificationSender emailNotificationSender;
    private final SmsNotificationSender smsNotificationSender;

    public NotificationWorker(
            NotificationService notificationService,
            EmailNotificationSender emailNotificationSender,
            SmsNotificationSender smsNotificationSender
    ) {
        this.notificationService = notificationService;
        this.emailNotificationSender = emailNotificationSender;
        this.smsNotificationSender = smsNotificationSender;
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
            emailNotificationSender.send(notificationMessage);
            smsNotificationSender.send(notificationMessage);

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
}
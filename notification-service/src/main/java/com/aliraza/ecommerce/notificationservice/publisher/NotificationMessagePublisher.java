package com.aliraza.ecommerce.notificationservice.publisher;

import com.aliraza.ecommerce.notificationservice.message.NotificationMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class NotificationMessagePublisher {

    private final RabbitTemplate rabbitTemplate;
    private final String notificationExchangeName;
    private final String notificationRoutingKey;

    public NotificationMessagePublisher(
            RabbitTemplate rabbitTemplate,
            @Value("${app.rabbitmq.notification.exchange}") String notificationExchangeName,
            @Value("${app.rabbitmq.notification.routing-key}") String notificationRoutingKey
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.notificationExchangeName = notificationExchangeName;
        this.notificationRoutingKey = notificationRoutingKey;
    }

    public void publish(NotificationMessage notificationMessage) {
        rabbitTemplate.convertAndSend(
                notificationExchangeName,
                notificationRoutingKey,
                notificationMessage
        );
    }
}
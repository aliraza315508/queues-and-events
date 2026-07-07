package com.aliraza.ecommerce.notificationservice.consumer;

import com.aliraza.ecommerce.notificationservice.dto.NotificationRequest;
import com.aliraza.ecommerce.notificationservice.event.OrderConfirmedEvent;
import com.aliraza.ecommerce.notificationservice.model.NotificationType;
import com.aliraza.ecommerce.notificationservice.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class OrderConfirmedConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderConfirmedConsumer.class);

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    public OrderConfirmedConsumer(
            ObjectMapper objectMapper,
            NotificationService notificationService
    ) {
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
    }

    @KafkaListener(
            topics = "${app.kafka.topics.order-confirmed}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consume(String message) throws Exception {
        OrderConfirmedEvent event = objectMapper.readValue(message, OrderConfirmedEvent.class);

        log.info(
                "Consumed OrderConfirmedEvent for orderId={} customerId={}",
                event.orderId(),
                event.customerId()
        );

        notificationService.createNotification(
                new NotificationRequest(
                        event.orderId().toString(),
                        event.customerId(),
                        buildTemporaryRecipientEmail(event.customerId()),
                        NotificationType.ORDER_CONFIRMED,
                        "Order Confirmed",
                        "Your order " + event.orderId() + " has been confirmed."
                )
        );
    }

    private String buildTemporaryRecipientEmail(String customerId) {
        return "customer-" + customerId + "@example.com";
    }
}
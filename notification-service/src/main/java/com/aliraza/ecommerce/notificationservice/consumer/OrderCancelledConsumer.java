package com.aliraza.ecommerce.notificationservice.consumer;

import com.aliraza.ecommerce.notificationservice.event.OrderCancelledEvent;
import com.aliraza.ecommerce.notificationservice.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class OrderCancelledConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderCancelledConsumer.class);

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    public OrderCancelledConsumer(
            ObjectMapper objectMapper,
            NotificationService notificationService
    ) {
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
    }

    @KafkaListener(
            topics = "${app.kafka.topics.order-cancelled}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consume(String message) throws Exception {
        OrderCancelledEvent event = objectMapper.readValue(message, OrderCancelledEvent.class);

        log.info(
                "Consumed OrderCancelledEvent for orderId={} customerId={} reason={}",
                event.orderId(),
                event.customerId(),
                event.reason()
        );

        notificationService.createOrderCancelledNotification(event);
    }
}
